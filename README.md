# Wheelchair Map

Accessible indoor-navigation prototype for the LC2 building at Thammasat University.

## LC2 map and doorway survey

`assets/data/indoorgml/lc2.gml` contains three floors, room and corridor
geometries, routing states, transitions, and the inter-floor elevator connections.
`assets/data/buildings/lc2.doors.json` contains the doorway survey.
Each JSON key matches the `gml:id` of a transition in the map.

Data loading:

```text
lc2.gml + lc2.doors.json
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
coordinates remain local to each floor. The active map uses **OGC IndoorGML
1.0.3 Core** with GML 3.2 geometry. Each cell has a polygon and a link to its
dual state. Each transition carries a weight and two local XLinks to states.
Floor layouts, room classifications and app-specific passage properties live in
`gml:metaDataProperty/gml:GenericMetaData` under the project’s `wc:` namespace.
The app reads older LC2 files as well as this rectangular, 2D Core encoding.

### Room layouts

Floor 1: 18 numbered rooms (`106, 107, 108, 109, 110, 111, 113, 114,
115, 116, 119, 120, 121, 122, 123, 124, 125, 126`), three WC
areas, an elevator, and the central stairs.

Floor 2: 17 numbered rooms (`211, 212, 213, 217, 218, 219, 220, 221,
222, 223, 224, 225, 226, 227, 228, 229, 230`), WC and an elevator.
The latest Floor 2 layout **does not include stairs**.

Floor 3 follows the supplied oriented plan, with traced interior walls, Rooms 301–317, a WC and an elevator marker along the upper corridor. Rooms appear on the floor plan and in search. Rooms 314–317 open into Room 313, which connects to the landing outside its entrance. The mapped corridor connects all 17 rooms and the WC on Floor 3. A short approach links the Floor 3 elevator door to the main corridor. The same elevator serves Floors 1, 2 and 3, with one ride between any two stops. Doorway measurements are recorded for Rooms 308–313 and the Floor 3 WC.

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
lc2.gml + lc2.doors.json → validated/normalized graph
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
between any two of its three levels. All other optional route-wide limits are unlimited.
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

Edit doorway measurements in `assets/data/buildings/lc2.doors.json`. Use the
transition ID for the physical doorway as the key. Include all three fields for every entry. Use `null` for an unknown value.

Room 106 has double doors with a 92 cm clear opening and a 12 cm threshold. Rooms 107–111 and 114 on Floor 1 each have double doors at one entrance and a 10 cm threshold. The reported clear opening is 74 cm for Rooms 107–111 and 84 cm for Room 114. The Room 109 record is shown below.

```json
{
  "f1_room109_top": { "doorWidth": 0.74, "leafCount": 2, "threshold": 0.10 }
}
```

- `doorWidth` records the measured clear opening in meters. A value of `0.74` means 74 cm.
- `leafCount` records the number of leaves at one opening. Use `1` for a single door and `2` for double doors.
- `threshold` records the vertical threshold height in meters. Use `0` for a measured flush threshold.
- In the Core file, corridor width and slope can be recorded as `width` and `slope` on `wc:Passage` in transition metadata.
- For older maps, the parser also reads inline GML measurements. Supplied JSON fields take precedence over inline transition values.
- Invalid negative heights or nonpositive doorway widths fail schema-v2 data
  validation; measurements are not treated as certified accessibility.

The app joins the survey to the map before schema-v2 migration and normalization.
**Measured room-door widths below 0.9 m are advisory
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

Each room has double doors at its mapped entrance.

| Room | Leaves | Clear opening width | Threshold height |
| --- | ---: | ---: | ---: |
| 211 | 2 | 90 cm | 7 cm |
| 212 | 2 | 76 cm | 4 cm |
| 213 | 2 | 80 cm | 0 cm (flush) |

### Floor 2, Rooms 217–222

The user-supplied door measurements for **Rooms 217, 218, 219, 220, 221
and 222** are recorded under their individual `f2_roomNNN_top` keys in the doorway survey:

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

Room 223 has double doors at one entrance, with a recorded clear opening of 109 cm and a flush threshold (0 cm).

## Build and test

To check the active file against the OGC IndoorGML 1.0.3 Core XSD in PowerShell:

```powershell
./scripts/Test-IndoorGmlSchema.ps1
```

The script loads the published Core schema and its dependencies. For offline checks,
pass `-SchemaDirectory` pointing to the same schema files listed in the script.
`npm test` also checks graph links, cell/state duality and LC2 navigation behavior.

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
