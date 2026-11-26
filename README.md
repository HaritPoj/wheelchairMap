# Wheelchair Map

Accessible indoor-navigation prototype for the LC2 building at Thammasat University.

## Source of truth: one IndoorGML document

`assets/data/indoorgml/lc2.gml` is the **single active map source** for
**Floor 1 and Floor 2**. Both levels, room/corridor geometries, routing
states, transitions, and the inter-floor elevator connection live in that
document. Do not maintain additional LC2 floor source files.

Data loading:

```text
assets/data/indoorgml/lc2.gml
             |
        parseIndoorGML()
             |
     migrateBuildingV1ToV2()
             |
      buildingAdapter
             |
    nodes / edges / floors
             |
   Resource-Constrained A* + COP → FloorPlan
```

The app converts the XML/GML into the existing generic schema v2 with
`site`, `facility`, `levels`, `units`, `openings`,
`routing.states`, and `routing.transitions`. The building footprint is
separately georeferenced using `lc2.site.json`; the indoor room
coordinates remain local. The current `wc:` namespace and simplified
geometry encoding are a project-specific IndoorGML application profile,
**not** proof of strict OGC XSD conformance.

### Room layouts

Floor 1: 18 numbered rooms (`106, 107, 108, 109, 110, 111, 113, 114,
115, 116, 119, 120, 121, 122, 123, 124, 125, 126`), three WC
areas, an elevator, and the central stairs.

Floor 2: 17 numbered rooms (`211, 212, 213, 217, 218, 219, 220, 221,
222, 223, 224, 225, 226, 227, 228, 229, 230`), WC and an elevator.
The latest Floor 2 layout **does not include stairs**.

Door-gap positions are driven by room-to-corridor transition metadata.
Cross-floor routing uses the elevator, and A* applies wheelchair routing
restrictions. Unmeasured accessibility attributes are not fabricated.

The route overlay shares the same door-gap geometry as the wall renderer,
snaps onto corridor centerlines when they pass within the visible door
opening, and draws route segments in the original floor coordinate system
before scaling. Floor 1 now has dedicated corridor junctions aligned with the doorways of
Rooms 109, 110, 111, 113 and 114, eliminating artificial overshoots caused
by reusing distant waypoints. Original corridor-edge weights were divided
proportionally across the added segments. Room 114 keeps its left-wall door,
with a nearer corridor junction to reduce unnecessary detours. Selected room
highlights are drawn at the exact room footprint independently of larger
touch targets, so narrow rooms no longer paint over adjacent rooms.

## Live route optimization (COP)

The user-facing navigation screen now calls `solveConstrainedRoute()` in
`src/logic/pathfinder.js` directly. It solves a **Constraint Optimization
Problem** on the wheelchair-accessible weighted indoor graph using an
**Resource-Constrained A*** (A* priority `f = g + h` with non-dominated
resource labels). It searches for a minimum-cost feasible route using an
admissible distance-based lower bound and nonnegative edge costs.
This is an on-device, pure-JavaScript solver; it does **not** require
OR-Tools, CP-SAT, a backend, or an internet connection.

```text
Unified lc2.gml → validated/normalized graph
    → COP hard constraints (stairs, known width/slope, elevator)
    → Resource-Constrained A* (g + h, resource-label dominance)
    → feasible, lowest-cost path or "no feasible route"
    → FloorPlan and directions
```

The core applies the same existing wheelchair edge restrictions and penalties:
blocked stairs, known insufficient widths, inaccessible nodes/edges, and
cross-floor elevator/ramp transitions. It can additionally enforce route-wide
limits (`maxCost`, `maxElevatorTransfers`, `maxSteepSegments`,
`maxThresholdSegments`), temporary blocked nodes/edges, or require
measured corridor/door widths and slopes. All such limits are applied
**during optimization**, not after a route is generated.

The LC2 navigation screen currently limits elevator transfers to **one**
between its two levels. All other optional route-wide limits are unlimited.
Example for a future preference or accessibility configuration:

```javascript
const result = solveConstrainedRoute('room_124', 'room_211', mapData, {
  maxElevatorTransfers: 1,
  maxSteepSegments: 0,
  blockedNodeIds: [],
});
// result = { path, cost, feasible, resources }
```

`findPath(startId, goalId, mapData, optionalConstraints)` remains available
as a compatibility wrapper around constrained A*. The original unconstrained
A* (with existing per-edge accessibility filtering) remains available as
`findAStarPath()` for a separate baseline in the standalone benchmark.

**Data quality:** Unmeasured widths/slopes/thresholds remain *unknown*;
the default solver does not falsely mark them as measured. A feasible path
means it satisfies **recorded** constraints, not that real-world wheelchair
passage has been certified safe. Before deployment, survey door widths,
obstacles, slopes, and other real building features. Strict measurements
can be required using `requireMeasuredWidths`,
`requireMeasuredDoorWidths`, and `requireMeasuredSlopes`, but the
current LC2 source has incomplete measurements, so enabling these will
likely reject many/all routes.

## Recording doorway measurements and informing users

Doorway measurements are **optional, per physical doorway**. Add surveyed values
to the corresponding `core:Transition` in the **single source**
`assets/data/indoorgml/lc2.gml`. Keep attributes **absent** when not measured;
do not estimate meters from map pixels.

Rooms 109, 110 and 111 on Floor 1 each have double doors at one entrance, with a reported clear opening of 74 cm and a threshold height of 10 cm. The Room 109 record is shown below.

```xml
<core:Transition
  gml:id="f1_room109_top"
  wc:from="room_109"
  wc:to="corridor_f1_d109"
  wc:cost="1"
  wc:doorWidth="0.74"
  wc:leafCount="2"
  wc:threshold="0.10" />
```

- `wc:doorWidth`: **clear usable doorway width**, in meters. `0.95` means 95 cm.
- Record the number of leaves at one opening in `wc:leafCount`. A value of `2` represents double doors at a single entrance. For equal-width leaves, include `wc:leafWidth` when the width of one leaf is known. Use `wc:doorWidth` for the measured clear opening.
- `wc:threshold`: **vertical threshold height**, in meters. `0.015` means 1.5 cm.
  Record an observed flush threshold as `0`; an unknown threshold is **not** zero.
- `wc:width` is the **corridor/edge passage width**, which is a different quantity.
- For rooms with multiple doors, measure each door separately using its own
  transition ID. Older `CellSpace` `wc:doorWidth` / `wc:threshold` metadata is
  supported as a fallback, but transition-specific measurements take priority.
- Invalid negative heights or nonpositive doorway widths fail schema-v2 data
  validation; measurements are not treated as certified accessibility.

The app reads these measurements through the XML parser, schema-v2 migration
and building adapter. **Measured room-door widths below 0.9 m are advisory
only**, not hard barriers: Resource-Constrained A* still finds routes into
and out of these rooms, while the app displays a caution that wheelchair
access may not be possible for some users. Recorded thresholds from **1 cm**
and **2 cm** retain the prototype's route-cost penalties (50 and 200).
Explicitly inaccessible doors, stairs, and known insufficient corridor/edge
widths remain hard routing constraints. These are prototype routing
parameters, **not legal accessibility standards**.

When a route is selected, **Next Step** reports missing measurements or raised
thresholds. **Directions → Doorway Conditions** lists the clear width and
threshold height for each doorway crossed, including the exit from the
starting room. Each missing measurement is shown as **Not measured**; routes
with unknown measurements are labelled **Data incomplete**, not guaranteed
accessible. Physical access still requires on-site verification of the
building and individual wheelchair user's needs.

### Floor 2, Rooms 211–213

Each room has double doors at its mapped entrance. The clear opening width is unmeasured for all three rooms.

| Room | Leaves | Width per leaf | Threshold height |
| --- | ---: | ---: | ---: |
| 211 | 2 | 90 cm | 7 cm |
| 212 | 2 | 76 cm | 4 cm |
| 213 | 2 | 80 cm | 0 cm (flush) |

### Floor 2, Rooms 217–222

The user-supplied door measurements for **Rooms 217, 218, 219, 220, 221
and 222** are recorded on their individual `f2_roomNNN_top` transitions:

- **Clear doorway width:** `0.80` m (80 cm).
- **Raised doorway threshold:** `0.04` m (4 cm).

These are reported measurements, not independently verified by the app.
Each of these six rooms currently has one modeled doorway. **These rooms
remain selectable as a starting point or destination, and paths are
calculated normally.** The navigation HUD advises that a door of **80 cm**
with a **4 cm threshold** may not be accessible to some wheelchair users;
the Directions and Next Step UI also report the doorway conditions on a
chosen route. This is a caution, **not an automatic determination that
every user cannot enter**. On-site verification and user-specific clearance
needs remain essential. Other room measurements stay unknown until surveyed.

### Floor 2, Room 223

Room 223 has double doors at one entrance, with a recorded clear opening of 109 cm and a flush threshold (0 cm). Individual leaf widths are unmeasured.

## Build and test

```bash
npm install
npm test
npx expo start --dev-client -c
```

For an experiment **outside the app**, compare A*, Dijkstra,
Greedy Best-First Search, and Artificial Bee Colony:

```bash
node benchmarks/test_benchmark.cjs
node benchmarks/compare_routes.cjs --pairs 20 --runs 10 --seed 42
node benchmarks/create_charts.cjs
```

See `benchmarks/README.md` for methodology and limits.
The OCR/camera workflow needs the Expo camera configuration in `app.json`.
