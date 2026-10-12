import lc2Legacy from "./lc2.json";
import lc2Site from "./lc2.site.json";
import { migrateBuildingV1ToV2 } from "../schemaV2";

const BUILDINGS = {
  lc2: migrateBuildingV1ToV2(lc2Legacy, lc2Site, {
    siteId: "tu_rangsit",
    siteName: "Thammasat University Rangsit Campus",
    displayName: "อาคารบรรยายเรียนรวม 2",
  }),
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
