import lc2Gml from '../indoorgml/lc2.gml';
import lc2Previous from './lc2.legacy.json';
import lc2Site from './lc2.site.json';
import { parseIndoorGML } from '../indoorgml/indoorGMLParser';
import { migrateBuildingV1ToV2 } from '../schemaV2';

const floor1 = parseIndoorGML(lc2Gml);
const floor2 = lc2Previous;

const floor1Ids = new Set(
  (floor1.spaces || [])
    .filter(space => space.floorId === 'floor_1')
    .map(space => space.id)
);

const floor2Ids = new Set(
  (floor2.spaces || [])
    .filter(space => space.floorId === 'floor_2')
    .map(space => space.id)
);

const mergedLegacy = {
  ...floor1,
  floors: [
    ...(floor1.floors || []).filter(floor => floor.id === 'floor_1'),
    ...(floor2.floors || []).filter(floor => floor.id === 'floor_2'),
  ],
  spaces: [
    ...(floor1.spaces || []).filter(space => space.floorId === 'floor_1'),
    ...(floor2.spaces || []).filter(space => space.floorId === 'floor_2'),
  ],
  connections: [
    ...(floor1.connections || []).filter(
      connection => floor1Ids.has(connection.from) || floor1Ids.has(connection.to)
    ),
    ...(floor2.connections || []).filter(
      connection => floor2Ids.has(connection.from) && floor2Ids.has(connection.to)
    ),
  ],
};

const lc2 = migrateBuildingV1ToV2(mergedLegacy, lc2Site, {
  siteId: 'tu_rangsit',
  siteName: 'Thammasat University Rangsit Campus',
  displayName: 'อาคารบรรยายเรียนรวม 2',
});

lc2.sourceFormat = 'IndoorGML-GML';
lc2.sourceFile = 'assets/data/indoorgml/lc2.gml';

export default lc2;
