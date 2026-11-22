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
