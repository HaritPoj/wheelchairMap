import { validateBuildingData } from "./mapValidator";
import { normalizeBuildingData } from "./buildingAdapter";
import { getBuilding } from "./buildings";

export function getMapData(buildingId = "lc2") {
  const buildingData = getBuilding(buildingId);
  const errors = validateBuildingData(buildingData);

  if (errors.length > 0) {
    throw new Error(
      "Invalid building data:\n" + errors.join("\n")
    );
  }

  return normalizeBuildingData(buildingData);
}
