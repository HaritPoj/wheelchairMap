import lc2Building from "./lc2.json";

const BUILDINGS = {
  lc2: lc2Building,
};

export function getBuilding(buildingId = "lc2") {
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
