import lc2Building from "./lc2.v2";

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
    id: building.facility.id,
    name: building.facility.name,
    levels: building.levels.length,
    floors: building.levels.length,
  }));
}
