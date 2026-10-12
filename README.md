# Wheelchair Map

Indoor wheelchair navigation in Expo / React Native.

## Generic building schema v2

The active data model is `schemaVersion: "2.0"`. It separates the physical indoor map (primal space) from the navigation network (dual graph), so a new building can use the same rendering and routing logic.

```text
site
└── facility
    ├── levels
    │   ├── units
    │   ├── openings
    │   ├── details
    │   └── pois
    └── routing
        ├── states
        └── transitions
```

### Spatial hierarchy

- `site`: campus/property containing facilities.
- `facility`: one building, including its geographic footprint.
- `levels`: floors and their local drawing coordinate systems.
- `units`: rooms, corridors, elevators, stairs, restrooms, entrances, etc.
- `openings`: doors/portals connecting units.
- `details`: non-routing architecture such as walls, columns, and windows.
- `pois`: assets or destinations such as AEDs or kiosks.

### Primal vs dual model

The physical map is represented by `levels`, `units`, `openings`, `details`, and `pois`.

Routing is represented independently:

```json
{
  "routing": {
    "states": [],
    "transitions": []
  }
}
```

Each routing state references a physical `unitId`. Each transition connects two states and contains routing/accessibility metadata. The app's A*/alternative-route logic runs on this graph instead of parsing floor polygons.

### Example unit

```json
{
  "id": "room_126",
  "levelId": "floor_1",
  "type": "room",
  "categoryId": "room",
  "name": "Room 126",
  "code": "126",
  "geometry": {
    "type": "rectangle",
    "x": 14,
    "y": 284,
    "width": 64,
    "height": 84
  },
  "accessibility": {
    "wheelchairAccessible": true,
    "doorWidth": null,
    "threshold": null
  }
}
```

### Example opening

```json
{
  "id": "opening:connection_082",
  "levelId": "floor_1",
  "type": "opening.door",
  "connects": ["room_126", "corridor_f1_001"],
  "geometry": null,
  "accessibility": {
    "wheelchairAccessible": true,
    "width": null,
    "threshold": null
  }
}
```

### Example routing state

```json
{
  "id": "state:room_126",
  "levelId": "floor_1",
  "unitId": "room_126",
  "type": "state",
  "geometry": {
    "type": "Point",
    "coordinates": [46, 326]
  }
}
```

### Example transition

```json
{
  "id": "connection_082",
  "from": "state:room_126",
  "to": "state:corridor_f1_001",
  "type": "horizontal",
  "openingId": "opening:connection_082",
  "routing": {
    "cost": 5
  },
  "accessibility": {
    "wheelchairAccessible": true,
    "width": null,
    "slope": null
  }
}
```

Cross-floor elevator movement uses a semantic vertical transition:

```json
{
  "type": "vertical.elevator",
  "accessibility": {
    "wheelchairAccessible": true
  }
}
```

Stairs can exist in the physical model while remaining unavailable to wheelchair routing.

## LC2 data

LC2 currently keeps the original surveyed/traced data file as a migration source:

```text
assets/data/buildings/lc2.json
assets/data/buildings/lc2.site.json
```

`assets/data/schemaV2.js` converts that source into the active generic v2 structure when buildings are registered in `assets/data/buildings/index.js`.

The supplied WGS84 GeoJSON polygon is stored as the LC2 facility footprint. For the indoor renderer, the adapter projects that footprint into the local Floor 1 coordinate system and uniformly fits the complete Floor 1 layout into it. Floor 2 keeps its existing traced boundary because the surveyed footprint/directory reference currently applies to Floor 1.

## Runtime architecture

```text
legacy LC2 survey data + GeoJSON footprint
                ↓
        schema v2 migration
                ↓
 site / facility / levels / units / openings
                +
       routing states / transitions
                ↓
        schema v2 validator
                ↓
        building adapter
                ↓
    nodes + edges compatibility graph
                ↓
 FloorPlan / OCR / A* routing / directions
```

The compatibility graph is internal only. New application data is consumed through schema v2, while existing UI and routing code can continue using stable `nodes` and `edges` objects.

## Development

```bash
npm install
npm test
npx expo start -c
```

The camera scanner uses `@react-native-ml-kit/text-recognition`, so use an Expo development build when testing native OCR.
