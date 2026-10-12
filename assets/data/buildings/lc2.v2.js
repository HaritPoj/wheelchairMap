import lc2Legacy from "./lc2.json";
import lc2Site from "./lc2.site.json";
import { migrateBuildingV1ToV2 } from "../schemaV2";

const lc2 = migrateBuildingV1ToV2(lc2Legacy, lc2Site, {
  siteId: "tu_rangsit",
  siteName: "Thammasat University Rangsit Campus",
  displayName: "อาคารบรรยายเรียนรวม 2",
});

export default lc2;
