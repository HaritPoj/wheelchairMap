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
   FloorPlan / A* pathfinder
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

## Live route optimization (COP)

The user-facing navigation screen now calls `solveConstrainedRoute()` in
`src/logic/pathfinder.js` directly. It solves a **Constraint Optimization
Problem** on the wheelchair-accessible weighted indoor graph using an
**exact resource-constrained shortest-path label-setting algorithm**.
This is an on-device, pure-JavaScript solver; it does **not** require
OR-Tools, CP-SAT, a backend, or an internet connection.

```text
Unified lc2.gml → validated/normalized graph
    → COP hard constraints (stairs, known width/slope, elevator)
    → resource-constrained minimum-cost search
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
as a compatibility wrapper around COP. The former A* implementation is still
available as `findAStarPath()` for a valid baseline in independent benchmarks.

**Data quality:** Unmeasured widths/slopes/thresholds remain *unknown*;
the default solver does not falsely mark them as measured. A feasible path
means it satisfies **recorded** constraints, not that real-world wheelchair
passage has been certified safe. Before deployment, survey door widths,
obstacles, slopes, and other real building features. Strict measurements
can be required using `requireMeasuredWidths`,
`requireMeasuredDoorWidths`, and `requireMeasuredSlopes`, but the
current LC2 source has incomplete measurements, so enabling these will
likely reject many/all routes.

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
