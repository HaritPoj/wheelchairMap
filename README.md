# Wheelchair Map

Indoor wheelchair navigation in Expo / React Native.

## Building-independent map schema

The app uses a generic building-data format so the same routing and UI code can work with another building.

Each building file contains:

- `building`: metadata and a building ID.
- `floors`: floor IDs, levels, map size, and optional boundary geometry.
- `spaces`: rooms, corridors, elevators, entrances, toilets, ramps, stairs, and other mapped spaces.
- `connections`: graph connections with routing cost, accessibility measurements, and optional transitions.

The current example is:

```
assets/data/buildings/sample_building.json
```

To add another building, create another JSON file with the same schema and register it in:

```
assets/data/buildings/index.js
```

The routing engine does not depend on room-number formats or building-specific IDs.

## Example space

```json
{
  "id": "room_example_01",
  "type": "room",
  "floorId": "floor_1",
  "name": "Room 101",
  "code": "101",
  "geometry": {
    "type": "rectangle",
    "x": 100,
    "y": 200,
    "width": 80,
    "height": 60
  },
  "accessibility": {
    "doorWidth": 1.0,
    "threshold": null
  }
}
```

## Example connection

```json
{
  "id": "connection_001",
  "from": "room_example_01",
  "to": "corridor_f1_001",
  "routing": {
    "cost": 5
  },
  "accessibility": {
    "width": null,
    "slope": null
  }
}
```

Cross-floor transitions can declare `elevator`, `ramp`, or `stairs`. The wheelchair router allows elevators and ramps and rejects stairs.

Unknown accessibility measurements are stored as `null`; the data model does not invent measurements.

## Architecture

```
building JSON
    ↓
buildingLoader
    ↓
validateBuildingData
    ↓
normalizeBuildingData
    ↓
internal routing graph
    ↓
UI / Dijkstra routing / directions / OCR
```

The adapter is intentional: the generic JSON schema stays clean while the UI can keep a simple graph representation internally.

## Development

```bash
npm install
npm test
npx expo start -c
```

The camera scanner uses `@react-native-ml-kit/text-recognition`, so use an Expo development build when testing native OCR.
