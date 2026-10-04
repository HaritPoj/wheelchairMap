# Wheelchair Map

Indoor wheelchair-navigation prototype built with Expo and React Native.

## Run the project

Install dependencies:

```bash
npm install
```

Run the routing tests:

```bash
npm test
```

Start the development server:

```bash
npx expo start
```

## Android development build

This project uses `@react-native-ml-kit/text-recognition`, which is a native React Native module. Use a development build rather than relying on the fixed native libraries in Expo Go.

The repository already contains an EAS `development` profile.

Build with EAS:

```bash
eas build --platform android --profile development
```

After the development build is installed, start the server with:

```bash
npx expo start
```

When native dependencies or `app.json` native configuration change, rebuild the development client.

## Navigation model

The app uses one map graph for:

- room and corridor geometry
- wheelchair accessibility constraints
- elevator transitions
- room search
- OCR-based starting-location detection

Unknown accessibility measurements are stored as `null` and are not treated as either accessible or inaccessible until measured.

## Map data

Each node has:

```text
room | corridor | lift | entrance | toilet
```

Routing edges contain:

```text
from
to
weight
width
slope
transition (when needed)
```

Cross-floor edges must explicitly use:

```json
"transition": "elevator"
```

and connect two `lift` nodes.

## Camera scanning

Point the camera at a room sign and press **Scan Sign**. OCR candidates are normalized and then checked against the rooms actually present in `assets/data/map.json`.

The app asks for confirmation before setting the detected room as the starting location.

## Important

This is an indoor navigation prototype. Accessibility measurements such as corridor width, slope, door width, and thresholds should be replaced with verified measurements from the real building before using the app for real-world accessibility decisions.
