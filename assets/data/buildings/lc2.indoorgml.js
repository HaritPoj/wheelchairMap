import lc2Gml from '../indoorgml/lc2.gml';
import lc2Site from './lc2.site.json';
import { parseIndoorGML } from '../indoorgml/indoorGMLParser';
import { migrateBuildingV1ToV2 } from '../schemaV2';

// Single canonical IndoorGML document contains both levels and the
// inter-floor elevator transition.
const lc2Source = parseIndoorGML(lc2Gml);

const lc2 = migrateBuildingV1ToV2(lc2Source, lc2Site, {
  siteId: 'tu_rangsit',
  siteName: 'Thammasat University Rangsit Campus',
  displayName: 'อาคารบรรยายเรียนรวม 2',
});

lc2.sourceFormat = 'IndoorGML-GML';
lc2.sourceFiles = ['assets/data/indoorgml/lc2.gml'];

export default lc2;
