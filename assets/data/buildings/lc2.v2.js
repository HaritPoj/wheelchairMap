import lc2Legacy from "./lc2.json";
import lc2Site from "./lc2.site.json";
import { migrateBuildingV1ToV2 } from "../schemaV2";
import { applyLC2RouteAlternatives } from "./lc2RoutingExtensions";

const migrated = migrateBuildingV1ToV2(lc2Legacy, lc2Site, {
  siteId: "tu_rangsit",
  siteName: "Thammasat University Rangsit Campus",
  displayName: "อาคารบรรยายเรียนรวม 2",
});

const lc2 = applyLC2RouteAlternatives(migrated);

export default lc2;
