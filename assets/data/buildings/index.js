import sampleBuilding from "./sample_building.json";

const BUILDINGS = {
  sample_building: sampleBuilding,
};

export function getBuilding(buildingId = "sample_building") {
  const building = BUILDINGS[buildingId];

  if (!building) {
    throw new Error(
      "Unknown building: " + buildingId +
      ". Available buildings: " + Object.keys(BUILDINGS).join(", ")
    );
  }

  return building;
}

export function getAvailableBuildings() {
  return Object.values(BUILDINGS).map(building => ({
    id: building.building.id,
    name: building.building.name,
    floors: building.floors.length,
  }));
}
