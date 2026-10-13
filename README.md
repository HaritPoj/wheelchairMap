# Wheelchair Map

Indoor wheelchair-accessible navigation prototype for LC2 (Learning Center 2) at Thammasat University.

## Current data architecture

The runtime uses generic schema v2:

- `site`
- `facility`
- `levels`
- `units`
- `openings`
- `details`
- `pois`
- `routing.states`
- `routing.transitions`

`assets/data/buildings/lc2.json` contains the current Floor 1 source layout. `assets/data/buildings/lc2.legacy.json` preserves the previous dataset used for Floor 2. `assets/data/buildings/lc2.v2.js` merges Floor 1 and Floor 2, migrates them to schema v2, and keeps the rest of the app independent from LC2-specific source data.

## LC2 Floor 1 reference layout

The active Floor 1 layout follows the latest supplied floor-plan reference. It contains exactly 18 numbered rooms:

`106, 107, 108, 109, 110, 111, 113, 114, 115, 116, 119, 120, 121, 122, 123, 124, 125, 126`

The plan also contains three WC areas, one elevator, and the central stairs. Room `112` and `115/1` are not present in the latest reference and are therefore not included in the active Floor 1 data.

Room entrances/exits are represented by room-to-corridor routing transitions. On Floor 1 the renderer uses these access transitions to draw a visible gap in the corresponding room wall. For example, rooms with both upper and lower access have door gaps on both sides, while the 106/107/108 wing opens toward the vertical corridor.

## Wheelchair routing

Routing runs on the dual graph rather than directly on room polygons. The pathfinder:

- avoids stairs for wheelchair routes
- supports multiple accessible alternatives where the floor graph has real loops
- uses the elevator for cross-floor travel
- can use door/edge width, slope, threshold, and accessibility metadata when measurements are available

Unknown accessibility measurements stay `null` instead of being invented.

## Run

```bash
npm install
npm test
npx expo start -c
```

The OCR/camera workflow requires the Expo camera setup already configured in `app.json`.
