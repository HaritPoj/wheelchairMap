import { validateBuildingData } from "./mapValidator";
import { normalizeBuildingData } from "./buildingAdapter";
import { getBuilding } from "./buildings";

export function getMapData(buildingId = "sample_building") {
  const buildingData = getBuilding(buildingId);
  const errors = validateBuildingData(buildingData);

  if (errors.length > 0) {
    throw new Error(
      "Invalid building data:\n" + errors.join("\n")
    );
  }

  return normalizeBuildingData(buildingData);
}
