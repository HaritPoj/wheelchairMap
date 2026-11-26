<?xml version="1.0" encoding="UTF-8"?>
<core:IndoorFeatures gml:id="lc2" xmlns:core="http://www.opengis.net/indoorgml/1.0/core"
  xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:wc="https://example.org/wheelchair-map/indoorgml-extension/1.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/indoorgml/1.0/core https://schemas.opengis.net/indoorgml/1.0/indoorgmlcore.xsd">
  <gml:metaDataProperty><gml:GenericMetaData><wc:Map coordinateSystem="local">
    <wc:Level id="floor_1" number="1" name="Floor 1" width="1104" height="395" boundary="33,249 390,249 390,223 690,223 690,246 946,246 946,42 1082,42 1082,349 690,349 690,377 389,377 389,354 33,354"/>
    <wc:Level id="floor_2" number="2" name="Floor 2" width="1331" height="452" boundary="56,279 486,279 486,249 847,249 847,273 1156,273 1156,31 1288,31 1288,400 843,400 843,432 483,432 483,408 56,408"/>
    <wc:Level id="floor_3" number="3" name="Floor 3" width="970" height="253" boundary="14,78 289,78 290,46 672,46 672,72 954,72 954,209 671,209 671,238 285,238 285,211 14,211">
      <wc:Wall points="14,78 289,78 290,46 672,46 672,72 954,72 954,209 671,209"/>
      <wc:Wall points="14,82 14,210 241,210 241,178"/>
      <wc:Wall points="14,187 84,187 84,153"/>
      <wc:Wall points="84,78 84,113"/>
      <wc:Wall points="241,151 241,105 285,105"/>
      <wc:Wall points="241,166 285,166"/>
      <wc:Wall points="241,211 285,211"/>
      <wc:Wall points="285,95 285,238 671,238 671,106"/>
      <wc:Wall points="285,121 302,121"/>
      <wc:Wall points="316,121 335,121 335,238"/>
      <wc:Wall points="357,238 357,186"/>
      <wc:Wall points="355,160 355,108 438,108"/>
      <wc:Wall points="355,172 430,172"/>
      <wc:Wall points="430,108 430,238"/>
      <wc:Wall points="457,108 570,108"/>
      <wc:Wall points="510,108 510,238"/>
      <wc:Wall points="593,108 613,108"/>
      <wc:Wall points="600,108 600,238"/>
      <wc:Wall points="632,108 702,108"/>
      <wc:Wall points="671,205 954,205"/>
      <wc:Wall points="761,205 761,105 830,105"/>
      <wc:Wall points="856,205 856,105 895,105"/>
      <wc:Wall points="856,158 893,158"/>
      <wc:Wall points="892,105 892,145"/>
      <wc:Wall points="894,171 894,205"/>
      <wc:Wall points="914,72 914,92"/>
      <wc:Wall points="914,145 914,105 954,105"/>
      <wc:Wall points="920,158 954,158"/>
      <wc:Wall points="918,171 918,205"/>
    </wc:Level>
  </wc:Map></gml:GenericMetaData></gml:metaDataProperty>
  <gml:name>LC2</gml:name>
  <core:primalSpaceFeatures><core:PrimalSpaceFeatures gml:id="lc2_primal">
    <core:cellSpaceMember><core:CellSpace gml:id="room_126">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="126" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 126</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_126">
        <gml:exterior><gml:LinearRing><gml:posList>50 278 108 278 108 334 50 334 50 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_126"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_125">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="125" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 125</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_125">
        <gml:exterior><gml:LinearRing><gml:posList>108 278 146 278 146 306 108 306 108 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_125"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_124">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="124" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 124</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_124">
        <gml:exterior><gml:LinearRing><gml:posList>108 306 146 306 146 334 108 334 108 306</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_124"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_123">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="123" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 123</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_123">
        <gml:exterior><gml:LinearRing><gml:posList>146 278 184 278 184 334 146 334 146 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_123"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_122">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="122" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 122</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_122">
        <gml:exterior><gml:LinearRing><gml:posList>184 278 222 278 222 334 184 334 184 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_122"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_121">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="121" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 121</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_121">
        <gml:exterior><gml:LinearRing><gml:posList>222 278 260 278 260 334 222 334 222 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_121"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_120">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="120" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 120</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_120">
        <gml:exterior><gml:LinearRing><gml:posList>260 278 298 278 298 334 260 334 260 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_120"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_119">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="119" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 119</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_119">
        <gml:exterior><gml:LinearRing><gml:posList>298 278 336 278 336 306 298 306 298 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_119"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="restroom_f1_west">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="restroom" code="WC" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>West restroom</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_restroom_f1_west">
        <gml:exterior><gml:LinearRing><gml:posList>298 306 336 306 336 334 298 334 298 306</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_restroom_f1_west"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_116">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="116" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 116</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_116">
        <gml:exterior><gml:LinearRing><gml:posList>336 278 374 278 374 334 336 334 336 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_116"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_115">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="115" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 115</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_115">
        <gml:exterior><gml:LinearRing><gml:posList>374 278 441 278 441 334 374 334 374 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_115"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_114">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="114" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 114</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_114">
        <gml:exterior><gml:LinearRing><gml:posList>651 278 751 278 751 348 651 348 651 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_114"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_113">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="113" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 113</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_113">
        <gml:exterior><gml:LinearRing><gml:posList>751 278 776 278 776 307 751 307 751 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_113"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="restroom_f1_center">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="restroom" code="WC" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Central restroom</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_restroom_f1_center">
        <gml:exterior><gml:LinearRing><gml:posList>776 278 817 278 817 348 776 348 776 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_restroom_f1_center"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_111">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="111" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 111</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_111">
        <gml:exterior><gml:LinearRing><gml:posList>817 278 895 278 895 348 817 348 817 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_111"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_110">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="110" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 110</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_110">
        <gml:exterior><gml:LinearRing><gml:posList>895 278 934 278 934 348 895 348 895 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_110"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_109">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="109" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 109</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_109">
        <gml:exterior><gml:LinearRing><gml:posList>934 278 972 278 972 348 934 348 934 278</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_109"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_108">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="108" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 108</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_108">
        <gml:exterior><gml:LinearRing><gml:posList>1013 300 1082 300 1082 349 1013 349 1013 300</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_108"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_107">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="107" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 107</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_107">
        <gml:exterior><gml:LinearRing><gml:posList>1013 203 1082 203 1082 299 1013 299 1013 203</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_107"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="restroom_f1_east">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="restroom" code="WC" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>East restroom</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_restroom_f1_east">
        <gml:exterior><gml:LinearRing><gml:posList>1052 145 1082 145 1082 202 1052 202 1052 145</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_restroom_f1_east"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_106">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="room" code="106" wheelchairAccessible="true" doorwayNotice="directions"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 106</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_106">
        <gml:exterior><gml:LinearRing><gml:posList>1013 43 1082 43 1082 144 1013 144 1013 43</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_106"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="elevator_01_f1">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="elevator" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Elevator Floor 1</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_elevator_01_f1">
        <gml:exterior><gml:LinearRing><gml:posList>392 230 420 230 420 260 392 260 392 230</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_elevator_01_f1"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="stairs_f1_central">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="stairs" code="STAIRS" wheelchairAccessible="false"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Central stairs</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_stairs_f1_central">
        <gml:exterior><gml:LinearRing><gml:posList>505 230 541 230 541 260 505 260 505 230</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_stairs_f1_central"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="corridor_f1_west_area">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="corridor" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>West corridor area</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_corridor_f1_west_area">
        <gml:exterior><gml:LinearRing><gml:posList>33 249 441 249 441 354 33 354 33 249</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_corridor_f1_west_area"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="corridor_f1_center_area">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="corridor" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Central corridor area</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_corridor_f1_center_area">
        <gml:exterior><gml:LinearRing><gml:posList>441 223 690 223 690 377 441 377 441 223</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_corridor_f1_center_area"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="corridor_f1_east_area">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="corridor" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>East corridor area</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_corridor_f1_east_area">
        <gml:exterior><gml:LinearRing><gml:posList>690 246 946 246 946 349 690 349 690 246</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_corridor_f1_east_area"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="corridor_f1_vertical_area">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_1" category="corridor" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Vertical corridor area</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_corridor_f1_vertical_area">
        <gml:exterior><gml:LinearRing><gml:posList>946 42 1013 42 1013 349 946 349 946 42</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_corridor_f1_vertical_area"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_230">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="230" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 230</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_230">
        <gml:exterior><gml:LinearRing><gml:posList>57 303 104 303 104 408 57 408 57 303</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_230"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_229">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="229" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 229</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_229">
        <gml:exterior><gml:LinearRing><gml:posList>104 303 209 303 209 408 104 408 104 303</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_229"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_228">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="228" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 228</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_228">
        <gml:exterior><gml:LinearRing><gml:posList>209 303 256 303 256 408 209 408 209 303</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_228"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_227">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="227" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 227</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_227">
        <gml:exterior><gml:LinearRing><gml:posList>256 303 303 303 303 408 256 408 256 303</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_227"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_226">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="226" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 226</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_226">
        <gml:exterior><gml:LinearRing><gml:posList>303 303 408 303 408 408 303 408 303 303</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_226"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_225">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="225" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 225</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_225">
        <gml:exterior><gml:LinearRing><gml:posList>408 303 457 303 457 408 408 408 408 303</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_225"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_224">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="224" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 224</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_224">
        <gml:exterior><gml:LinearRing><gml:posList>457 303 543 303 543 408 457 408 457 303</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_224"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_223">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="223" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 223</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_223">
        <gml:exterior><gml:LinearRing><gml:posList>792 302 830 302 830 400 792 400 792 302</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_223"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_222">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="222" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 222</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_222">
        <gml:exterior><gml:LinearRing><gml:posList>830 302 867 302 867 400 830 400 830 302</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_222"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_221">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="221" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 221</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_221">
        <gml:exterior><gml:LinearRing><gml:posList>867 302 904 302 904 400 867 400 867 302</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_221"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_220">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="220" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 220</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_220">
        <gml:exterior><gml:LinearRing><gml:posList>904 302 941 302 941 400 904 400 904 302</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_220"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_219">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="219" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 219</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_219">
        <gml:exterior><gml:LinearRing><gml:posList>941 302 978 302 978 400 941 400 941 302</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_219"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_218">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="218" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 218</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_218">
        <gml:exterior><gml:LinearRing><gml:posList>978 302 1015 302 1015 400 978 400 978 302</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_218"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_217">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="217" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 217</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_217">
        <gml:exterior><gml:LinearRing><gml:posList>1015 302 1052 302 1052 400 1015 400 1015 302</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_217"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_211">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="211" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 211</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_211">
        <gml:exterior><gml:LinearRing><gml:posList>1156 31 1288 31 1288 145 1156 145 1156 31</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_211"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="restroom_f2_east">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="restroom" code="WC" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>East restroom</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_restroom_f2_east">
        <gml:exterior><gml:LinearRing><gml:posList>1251 145 1288 145 1288 233 1251 233 1251 145</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_restroom_f2_east"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_212">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="212" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 212</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_212">
        <gml:exterior><gml:LinearRing><gml:posList>1200 233 1288 233 1288 302 1200 302 1200 233</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_212"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_213">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="room" code="213" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 213</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_213">
        <gml:exterior><gml:LinearRing><gml:posList>1156 302 1288 302 1288 400 1156 400 1156 302</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_213"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="elevator_01_f2">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_2" category="elevator" wheelchairAccessible="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Elevator Floor 2</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_elevator_01_f2">
        <gml:exterior><gml:LinearRing><gml:posList>487 249 517 249 517 279 487 279 487 249</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_elevator_01_f2"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_301">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="301"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 301</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_301">
        <gml:exterior><gml:LinearRing><gml:posList>914 72 954 72 954 105 914 105 914 72</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_301"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_302">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="302"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 302</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_302">
        <gml:exterior><gml:LinearRing><gml:posList>914 105 954 105 954 157 914 157 914 105</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_302"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_303">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="303"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 303</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_303">
        <gml:exterior><gml:LinearRing><gml:posList>918 158 954 158 954 205 918 205 918 158</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_303"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_304">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="304"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 304</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_304">
        <gml:exterior><gml:LinearRing><gml:posList>856 158 895 158 895 205 856 205 856 158</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_304"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_305">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="305"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 305</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_305">
        <gml:exterior><gml:LinearRing><gml:posList>856 105 892 105 892 157 856 157 856 105</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_305"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_306">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="306"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 306</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_306">
        <gml:exterior><gml:LinearRing><gml:posList>761 105 856 105 856 205 761 205 761 105</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_306"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_307">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="307"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 307</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_307">
        <gml:exterior><gml:LinearRing><gml:posList>671 108 760 108 760 205 671 205 671 108</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_307"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_308">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="308"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 308</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_308">
        <gml:exterior><gml:LinearRing><gml:posList>600 108 671 108 671 238 600 238 600 108</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_308"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_309">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="309"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 309</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_309">
        <gml:exterior><gml:LinearRing><gml:posList>510 108 600 108 600 238 510 238 510 108</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_309"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_310">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="310"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 310</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_310">
        <gml:exterior><gml:LinearRing><gml:posList>430 108 510 108 510 238 430 238 430 108</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_310"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_311">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="311"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 311</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_311">
        <gml:exterior><gml:LinearRing><gml:posList>357 173 430 173 430 238 357 238 357 173</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_311"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_312">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="312"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 312</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_312">
        <gml:exterior><gml:LinearRing><gml:posList>355 108 430 108 430 172 355 172 355 108</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_312"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_313">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="313" throughRoom="true"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 313</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_313">
        <gml:exterior><gml:LinearRing><gml:posList>84 103 241 103 241 210 84 210 84 103</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_313"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_314">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="314"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 314</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_314">
        <gml:exterior><gml:LinearRing><gml:posList>241 167 285 167 285 210 241 210 241 167</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_314"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_315">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="315"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 315</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_315">
        <gml:exterior><gml:LinearRing><gml:posList>241 105 285 105 285 166 241 166 241 105</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_315"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_316">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="316"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 316</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_316">
        <gml:exterior><gml:LinearRing><gml:posList>14 187 84 187 84 210 14 210 14 187</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_316"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_317">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="room" code="317"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Room 317</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_room_317">
        <gml:exterior><gml:LinearRing><gml:posList>14 78 84 78 84 187 14 187 14 78</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_room_317"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="restroom_f3">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="restroom" code="WC"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Floor 3 restroom</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_restroom_f3">
        <gml:exterior><gml:LinearRing><gml:posList>285 121 335 121 335 238 285 238 285 121</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_restroom_f3"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="elevator_01_f3">
      <gml:metaDataProperty><gml:GenericMetaData><wc:Space levelId="floor_3" category="elevator" code="Lift"/></gml:GenericMetaData></gml:metaDataProperty>
      <gml:name>Elevator Floor 3</gml:name>
      <core:cellSpaceGeometry><core:Geometry2D><gml:Polygon gml:id="polygon_elevator_01_f3">
        <gml:exterior><gml:LinearRing><gml:posList>418 25 436 25 436 45 418 45 418 25</gml:posList></gml:LinearRing></gml:exterior>
      </gml:Polygon></core:Geometry2D></core:cellSpaceGeometry>
      <core:duality xlink:href="#state_elevator_01_f3"/>
    </core:CellSpace></core:cellSpaceMember>
  </core:PrimalSpaceFeatures></core:primalSpaceFeatures>
  <core:multiLayeredGraph><core:MultiLayeredGraph gml:id="lc2_dual">
    <core:spaceLayers gml:id="lc2_space_layers">
      <core:spaceLayerMember><core:SpaceLayer gml:id="lc2_wheelchair_layer">
        <core:nodes gml:id="lc2_states">
          <core:stateMember><core:State gml:id="state_room_126">
            <gml:name>Room 126</gml:name>
            <core:duality xlink:href="#room_126"/>
            <core:connects xlink:href="#f1_room126_top"/>
            <core:connects xlink:href="#f1_room126_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_room_126"><gml:pos>79 306</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_125">
            <gml:name>Room 125</gml:name>
            <core:duality xlink:href="#room_125"/>
            <core:connects xlink:href="#f1_room125_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_125"><gml:pos>127 292</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_124">
            <gml:name>Room 124</gml:name>
            <core:duality xlink:href="#room_124"/>
            <core:connects xlink:href="#f1_room124_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_room_124"><gml:pos>127 320</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_123">
            <gml:name>Room 123</gml:name>
            <core:duality xlink:href="#room_123"/>
            <core:connects xlink:href="#f1_room123_top"/>
            <core:connects xlink:href="#f1_room123_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_room_123"><gml:pos>165 306</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_122">
            <gml:name>Room 122</gml:name>
            <core:duality xlink:href="#room_122"/>
            <core:connects xlink:href="#f1_room122_top"/>
            <core:connects xlink:href="#f1_room122_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_room_122"><gml:pos>203 306</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_121">
            <gml:name>Room 121</gml:name>
            <core:duality xlink:href="#room_121"/>
            <core:connects xlink:href="#f1_room121_top"/>
            <core:connects xlink:href="#f1_room121_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_room_121"><gml:pos>241 306</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_120">
            <gml:name>Room 120</gml:name>
            <core:duality xlink:href="#room_120"/>
            <core:connects xlink:href="#f1_room120_top"/>
            <core:connects xlink:href="#f1_room120_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_room_120"><gml:pos>279 306</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_119">
            <gml:name>Room 119</gml:name>
            <core:duality xlink:href="#room_119"/>
            <core:connects xlink:href="#f1_room119_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_119"><gml:pos>317 292</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_restroom_f1_west">
            <gml:name>West restroom</gml:name>
            <core:duality xlink:href="#restroom_f1_west"/>
            <core:connects xlink:href="#f1_wc_west_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_restroom_f1_west"><gml:pos>317 320</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_116">
            <gml:name>Room 116</gml:name>
            <core:duality xlink:href="#room_116"/>
            <core:connects xlink:href="#f1_room116_top"/>
            <core:connects xlink:href="#f1_room116_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_room_116"><gml:pos>355 306</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_115">
            <gml:name>Room 115</gml:name>
            <core:duality xlink:href="#room_115"/>
            <core:connects xlink:href="#f1_room115_top"/>
            <core:connects xlink:href="#f1_room115_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_room_115"><gml:pos>407.5 306</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_114">
            <gml:name>Room 114</gml:name>
            <core:duality xlink:href="#room_114"/>
            <core:connects xlink:href="#f1_room114_left"/>
            <core:geometry><gml:Point gml:id="point_state_room_114"><gml:pos>701 313</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_113">
            <gml:name>Room 113</gml:name>
            <core:duality xlink:href="#room_113"/>
            <core:connects xlink:href="#f1_room113_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_113"><gml:pos>763.5 292.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_restroom_f1_center">
            <gml:name>Central restroom</gml:name>
            <core:duality xlink:href="#restroom_f1_center"/>
            <core:connects xlink:href="#f1_wc_center_top"/>
            <core:geometry><gml:Point gml:id="point_state_restroom_f1_center"><gml:pos>796.5 313</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_111">
            <gml:name>Room 111</gml:name>
            <core:duality xlink:href="#room_111"/>
            <core:connects xlink:href="#f1_room111_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_111"><gml:pos>856 313</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_110">
            <gml:name>Room 110</gml:name>
            <core:duality xlink:href="#room_110"/>
            <core:connects xlink:href="#f1_room110_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_110"><gml:pos>914.5 313</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_109">
            <gml:name>Room 109</gml:name>
            <core:duality xlink:href="#room_109"/>
            <core:connects xlink:href="#f1_room109_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_109"><gml:pos>953 313</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_108">
            <gml:name>Room 108</gml:name>
            <core:duality xlink:href="#room_108"/>
            <core:connects xlink:href="#f1_room108_left"/>
            <core:geometry><gml:Point gml:id="point_state_room_108"><gml:pos>1047.5 324.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_107">
            <gml:name>Room 107</gml:name>
            <core:duality xlink:href="#room_107"/>
            <core:connects xlink:href="#f1_room107_left"/>
            <core:geometry><gml:Point gml:id="point_state_room_107"><gml:pos>1047.5 251</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_restroom_f1_east">
            <gml:name>East restroom</gml:name>
            <core:duality xlink:href="#restroom_f1_east"/>
            <core:connects xlink:href="#f1_wc_east_left"/>
            <core:geometry><gml:Point gml:id="point_state_restroom_f1_east"><gml:pos>1067 173.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_106">
            <gml:name>Room 106</gml:name>
            <core:duality xlink:href="#room_106"/>
            <core:connects xlink:href="#f1_room106_left"/>
            <core:geometry><gml:Point gml:id="point_state_room_106"><gml:pos>1047.5 93.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_elevator_01_f1">
            <gml:name>Elevator Floor 1</gml:name>
            <core:duality xlink:href="#elevator_01_f1"/>
            <core:connects xlink:href="#f1_elevator"/>
            <core:connects xlink:href="#connection_elevator_f1_f2"/>
            <core:geometry><gml:Point gml:id="point_state_elevator_01_f1"><gml:pos>406 245</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_stairs_f1_central">
            <gml:name>Central stairs</gml:name>
            <core:duality xlink:href="#stairs_f1_central"/>
            <core:geometry><gml:Point gml:id="point_state_stairs_f1_central"><gml:pos>523 245</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_corridor_f1_west_area">
            <gml:name>West corridor area</gml:name>
            <core:duality xlink:href="#corridor_f1_west_area"/>
            <core:geometry><gml:Point gml:id="point_state_corridor_f1_west_area"><gml:pos>237 301.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_corridor_f1_center_area">
            <gml:name>Central corridor area</gml:name>
            <core:duality xlink:href="#corridor_f1_center_area"/>
            <core:geometry><gml:Point gml:id="point_state_corridor_f1_center_area"><gml:pos>565.5 300</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_corridor_f1_east_area">
            <gml:name>East corridor area</gml:name>
            <core:duality xlink:href="#corridor_f1_east_area"/>
            <core:geometry><gml:Point gml:id="point_state_corridor_f1_east_area"><gml:pos>818 297.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_corridor_f1_vertical_area">
            <gml:name>Vertical corridor area</gml:name>
            <core:duality xlink:href="#corridor_f1_vertical_area"/>
            <core:geometry><gml:Point gml:id="point_state_corridor_f1_vertical_area"><gml:pos>979.5 195.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_230">
            <gml:name>Room 230</gml:name>
            <core:duality xlink:href="#room_230"/>
            <core:connects xlink:href="#f2_room230_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_230"><gml:pos>80.5 355.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_229">
            <gml:name>Room 229</gml:name>
            <core:duality xlink:href="#room_229"/>
            <core:connects xlink:href="#f2_room229_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_229"><gml:pos>156.5 355.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_228">
            <gml:name>Room 228</gml:name>
            <core:duality xlink:href="#room_228"/>
            <core:connects xlink:href="#f2_room228_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_228"><gml:pos>232.5 355.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_227">
            <gml:name>Room 227</gml:name>
            <core:duality xlink:href="#room_227"/>
            <core:connects xlink:href="#f2_room227_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_227"><gml:pos>279.5 355.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_226">
            <gml:name>Room 226</gml:name>
            <core:duality xlink:href="#room_226"/>
            <core:connects xlink:href="#f2_room226_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_226"><gml:pos>355.5 355.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_225">
            <gml:name>Room 225</gml:name>
            <core:duality xlink:href="#room_225"/>
            <core:connects xlink:href="#f2_room225_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_225"><gml:pos>432.5 355.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_224">
            <gml:name>Room 224</gml:name>
            <core:duality xlink:href="#room_224"/>
            <core:connects xlink:href="#f2_room224_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_224"><gml:pos>500 355.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_223">
            <gml:name>Room 223</gml:name>
            <core:duality xlink:href="#room_223"/>
            <core:connects xlink:href="#f2_room223_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_223"><gml:pos>811 351</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_222">
            <gml:name>Room 222</gml:name>
            <core:duality xlink:href="#room_222"/>
            <core:connects xlink:href="#f2_room222_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_222"><gml:pos>848.5 351</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_221">
            <gml:name>Room 221</gml:name>
            <core:duality xlink:href="#room_221"/>
            <core:connects xlink:href="#f2_room221_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_221"><gml:pos>885.5 351</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_220">
            <gml:name>Room 220</gml:name>
            <core:duality xlink:href="#room_220"/>
            <core:connects xlink:href="#f2_room220_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_220"><gml:pos>922.5 351</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_219">
            <gml:name>Room 219</gml:name>
            <core:duality xlink:href="#room_219"/>
            <core:connects xlink:href="#f2_room219_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_219"><gml:pos>959.5 351</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_218">
            <gml:name>Room 218</gml:name>
            <core:duality xlink:href="#room_218"/>
            <core:connects xlink:href="#f2_room218_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_218"><gml:pos>996.5 351</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_217">
            <gml:name>Room 217</gml:name>
            <core:duality xlink:href="#room_217"/>
            <core:connects xlink:href="#f2_room217_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_217"><gml:pos>1033.5 351</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_211">
            <gml:name>Room 211</gml:name>
            <core:duality xlink:href="#room_211"/>
            <core:connects xlink:href="#f2_room211_bottom_left"/>
            <core:geometry><gml:Point gml:id="point_state_room_211"><gml:pos>1222 88</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_restroom_f2_east">
            <gml:name>East restroom</gml:name>
            <core:duality xlink:href="#restroom_f2_east"/>
            <core:connects xlink:href="#f2_wc_east_left"/>
            <core:geometry><gml:Point gml:id="point_state_restroom_f2_east"><gml:pos>1269.5 189</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_212">
            <gml:name>Room 212</gml:name>
            <core:duality xlink:href="#room_212"/>
            <core:connects xlink:href="#f2_room212_left"/>
            <core:geometry><gml:Point gml:id="point_state_room_212"><gml:pos>1244 267.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_213">
            <gml:name>Room 213</gml:name>
            <core:duality xlink:href="#room_213"/>
            <core:connects xlink:href="#f2_room213_top_left"/>
            <core:geometry><gml:Point gml:id="point_state_room_213"><gml:pos>1222 351</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_elevator_01_f2">
            <gml:name>Elevator Floor 2</gml:name>
            <core:duality xlink:href="#elevator_01_f2"/>
            <core:connects xlink:href="#connection_elevator_f1_f2"/>
            <core:connects xlink:href="#f2_elevator_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_elevator_01_f2"><gml:pos>502 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u01">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Upper corridor 01</gml:name>
            <core:connects xlink:href="#f1_u01_u02"/>
            <core:connects xlink:href="#f1_room126_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u01"><gml:pos>79 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u02">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Upper corridor 02</gml:name>
            <core:connects xlink:href="#f1_u01_u02"/>
            <core:connects xlink:href="#f1_u02_u03"/>
            <core:connects xlink:href="#f1_room125_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u02"><gml:pos>127 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u03">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Upper corridor 03</gml:name>
            <core:connects xlink:href="#f1_u02_u03"/>
            <core:connects xlink:href="#f1_u03_u04"/>
            <core:connects xlink:href="#f1_room123_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u03"><gml:pos>165 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u04">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Upper corridor 04</gml:name>
            <core:connects xlink:href="#f1_u03_u04"/>
            <core:connects xlink:href="#f1_u04_u05"/>
            <core:connects xlink:href="#f1_room122_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u04"><gml:pos>203 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u05">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Upper corridor 05</gml:name>
            <core:connects xlink:href="#f1_u04_u05"/>
            <core:connects xlink:href="#f1_u05_u06"/>
            <core:connects xlink:href="#f1_room121_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u05"><gml:pos>241 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u06">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Upper corridor 06</gml:name>
            <core:connects xlink:href="#f1_u05_u06"/>
            <core:connects xlink:href="#f1_u06_u07"/>
            <core:connects xlink:href="#f1_room120_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u06"><gml:pos>279 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u07">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Upper corridor 07</gml:name>
            <core:connects xlink:href="#f1_u06_u07"/>
            <core:connects xlink:href="#f1_u07_u08"/>
            <core:connects xlink:href="#f1_room119_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u07"><gml:pos>317 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u08">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Upper corridor 08</gml:name>
            <core:connects xlink:href="#f1_u07_u08"/>
            <core:connects xlink:href="#f1_u08_u09"/>
            <core:connects xlink:href="#f1_room116_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u08"><gml:pos>355 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u09">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Upper corridor 09</gml:name>
            <core:connects xlink:href="#f1_u08_u09"/>
            <core:connects xlink:href="#f1_u09_u10"/>
            <core:connects xlink:href="#f1_elevator"/>
            <core:connects xlink:href="#f1_room115_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u09"><gml:pos>407 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u10">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Central upper west</gml:name>
            <core:connects xlink:href="#f1_u09_u10"/>
            <core:connects xlink:href="#f1_u10_u11"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u10"><gml:pos>500 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u11">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Central upper east</gml:name>
            <core:connects xlink:href="#f1_u10_u11"/>
            <core:connects xlink:href="#f1_u11_d114"/>
            <core:connects xlink:href="#f1_l11_u11"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u11"><gml:pos>610 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u12">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor 01</gml:name>
            <core:connects xlink:href="#f1_d114_u12"/>
            <core:connects xlink:href="#f1_u12_d113"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u12"><gml:pos>700 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u13">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor 02</gml:name>
            <core:connects xlink:href="#f1_d113_u13"/>
            <core:connects xlink:href="#f1_u13_d111"/>
            <core:connects xlink:href="#f1_wc_center_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u13"><gml:pos>790 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u14">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor 03</gml:name>
            <core:connects xlink:href="#f1_d111_u14"/>
            <core:connects xlink:href="#f1_u14_d110"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u14"><gml:pos>870 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_u15">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Vertical wing junction</gml:name>
            <core:connects xlink:href="#f1_d109_u15"/>
            <core:connects xlink:href="#f1_u15_v01"/>
            <core:connects xlink:href="#f1_u15_v02"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_u15"><gml:pos>980 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_d114">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Room 114 doorway junction</gml:name>
            <core:connects xlink:href="#f1_u11_d114"/>
            <core:connects xlink:href="#f1_d114_u12"/>
            <core:connects xlink:href="#f1_room114_left"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_d114"><gml:pos>640 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_d113">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Room 113 doorway junction</gml:name>
            <core:connects xlink:href="#f1_u12_d113"/>
            <core:connects xlink:href="#f1_d113_u13"/>
            <core:connects xlink:href="#f1_room113_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_d113"><gml:pos>763.5 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_d111">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Room 111 doorway junction</gml:name>
            <core:connects xlink:href="#f1_u13_d111"/>
            <core:connects xlink:href="#f1_d111_u14"/>
            <core:connects xlink:href="#f1_room111_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_d111"><gml:pos>856 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_d110">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Room 110 doorway junction</gml:name>
            <core:connects xlink:href="#f1_u14_d110"/>
            <core:connects xlink:href="#f1_d110_d109"/>
            <core:connects xlink:href="#f1_room110_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_d110"><gml:pos>914.5 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_d109">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Room 109 doorway junction</gml:name>
            <core:connects xlink:href="#f1_d110_d109"/>
            <core:connects xlink:href="#f1_d109_u15"/>
            <core:connects xlink:href="#f1_room109_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_d109"><gml:pos>953 264</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l01">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Lower corridor 01</gml:name>
            <core:connects xlink:href="#f1_l01_l02"/>
            <core:connects xlink:href="#f1_room126_bottom"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l01"><gml:pos>79 344</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l02">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Lower corridor 02</gml:name>
            <core:connects xlink:href="#f1_l01_l02"/>
            <core:connects xlink:href="#f1_l02_l03"/>
            <core:connects xlink:href="#f1_room124_bottom"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l02"><gml:pos>127 344</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l03">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Lower corridor 03</gml:name>
            <core:connects xlink:href="#f1_l02_l03"/>
            <core:connects xlink:href="#f1_l03_l04"/>
            <core:connects xlink:href="#f1_room123_bottom"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l03"><gml:pos>165 344</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l04">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Lower corridor 04</gml:name>
            <core:connects xlink:href="#f1_l03_l04"/>
            <core:connects xlink:href="#f1_l04_l05"/>
            <core:connects xlink:href="#f1_room122_bottom"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l04"><gml:pos>203 344</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l05">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Lower corridor 05</gml:name>
            <core:connects xlink:href="#f1_l04_l05"/>
            <core:connects xlink:href="#f1_l05_l06"/>
            <core:connects xlink:href="#f1_room121_bottom"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l05"><gml:pos>241 344</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l06">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Lower corridor 06</gml:name>
            <core:connects xlink:href="#f1_l05_l06"/>
            <core:connects xlink:href="#f1_l06_l07"/>
            <core:connects xlink:href="#f1_room120_bottom"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l06"><gml:pos>279 344</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l07">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Lower corridor 07</gml:name>
            <core:connects xlink:href="#f1_l06_l07"/>
            <core:connects xlink:href="#f1_l07_l08"/>
            <core:connects xlink:href="#f1_wc_west_bottom"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l07"><gml:pos>317 344</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l08">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Lower corridor 08</gml:name>
            <core:connects xlink:href="#f1_l07_l08"/>
            <core:connects xlink:href="#f1_l08_l09"/>
            <core:connects xlink:href="#f1_room116_bottom"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l08"><gml:pos>355 344</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l09">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Lower corridor 09</gml:name>
            <core:connects xlink:href="#f1_l08_l09"/>
            <core:connects xlink:href="#f1_l09_l10"/>
            <core:connects xlink:href="#f1_room115_bottom"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l09"><gml:pos>407 344</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l10">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Central lower west</gml:name>
            <core:connects xlink:href="#f1_l09_l10"/>
            <core:connects xlink:href="#f1_l10_l11"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l10"><gml:pos>500 360</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_l11">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Central lower east</gml:name>
            <core:connects xlink:href="#f1_l10_l11"/>
            <core:connects xlink:href="#f1_l11_u11"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_l11"><gml:pos>610 360</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_v01">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Vertical corridor lower</gml:name>
            <core:connects xlink:href="#f1_u15_v01"/>
            <core:connects xlink:href="#f1_room108_left"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_v01"><gml:pos>980 325</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_v02">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Vertical corridor room 107</gml:name>
            <core:connects xlink:href="#f1_u15_v02"/>
            <core:connects xlink:href="#f1_v02_v03"/>
            <core:connects xlink:href="#f1_room107_left"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_v02"><gml:pos>980 245</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_v03">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Vertical corridor restroom</gml:name>
            <core:connects xlink:href="#f1_v02_v03"/>
            <core:connects xlink:href="#f1_v03_v04"/>
            <core:connects xlink:href="#f1_wc_east_left"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_v03"><gml:pos>980 174</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f1_v04">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_1"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Vertical corridor room 106</gml:name>
            <core:connects xlink:href="#f1_v03_v04"/>
            <core:connects xlink:href="#f1_room106_left"/>
            <core:geometry><gml:Point gml:id="point_corridor_f1_v04"><gml:pos>980 95</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c01">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>West corridor 01</gml:name>
            <core:connects xlink:href="#f2_c01_c02"/>
            <core:connects xlink:href="#f2_room230_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c01"><gml:pos>80 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c02">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>West corridor 02</gml:name>
            <core:connects xlink:href="#f2_c01_c02"/>
            <core:connects xlink:href="#f2_c02_c03"/>
            <core:connects xlink:href="#f2_room229_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c02"><gml:pos>156 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c03">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>West corridor 03</gml:name>
            <core:connects xlink:href="#f2_c02_c03"/>
            <core:connects xlink:href="#f2_c03_c04"/>
            <core:connects xlink:href="#f2_room228_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c03"><gml:pos>232 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c04">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>West corridor 04</gml:name>
            <core:connects xlink:href="#f2_c03_c04"/>
            <core:connects xlink:href="#f2_c04_c05"/>
            <core:connects xlink:href="#f2_room227_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c04"><gml:pos>280 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c05">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>West corridor 05</gml:name>
            <core:connects xlink:href="#f2_c04_c05"/>
            <core:connects xlink:href="#f2_c05_c06"/>
            <core:connects xlink:href="#f2_room226_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c05"><gml:pos>355 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c06">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>West corridor 06</gml:name>
            <core:connects xlink:href="#f2_c05_c06"/>
            <core:connects xlink:href="#f2_c06_c07"/>
            <core:connects xlink:href="#f2_room225_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c06"><gml:pos>432 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c07">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Elevator junction</gml:name>
            <core:connects xlink:href="#f2_c06_c07"/>
            <core:connects xlink:href="#f2_c07_c08"/>
            <core:connects xlink:href="#f2_room224_top"/>
            <core:connects xlink:href="#f2_elevator_bottom"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c07"><gml:pos>500 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c08">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Central corridor</gml:name>
            <core:connects xlink:href="#f2_c07_c08"/>
            <core:connects xlink:href="#f2_c08_c09"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c08"><gml:pos>650 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c09">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor 223</gml:name>
            <core:connects xlink:href="#f2_c08_c09"/>
            <core:connects xlink:href="#f2_c09_c10"/>
            <core:connects xlink:href="#f2_room223_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c09"><gml:pos>811 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c10">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor 222</gml:name>
            <core:connects xlink:href="#f2_c09_c10"/>
            <core:connects xlink:href="#f2_c10_c11"/>
            <core:connects xlink:href="#f2_room222_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c10"><gml:pos>849 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c11">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor 221</gml:name>
            <core:connects xlink:href="#f2_c10_c11"/>
            <core:connects xlink:href="#f2_c11_c12"/>
            <core:connects xlink:href="#f2_room221_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c11"><gml:pos>886 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c12">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor 220</gml:name>
            <core:connects xlink:href="#f2_c11_c12"/>
            <core:connects xlink:href="#f2_c12_c13"/>
            <core:connects xlink:href="#f2_room220_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c12"><gml:pos>923 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c13">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor 219</gml:name>
            <core:connects xlink:href="#f2_c12_c13"/>
            <core:connects xlink:href="#f2_c13_c14"/>
            <core:connects xlink:href="#f2_room219_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c13"><gml:pos>960 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c14">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor 218</gml:name>
            <core:connects xlink:href="#f2_c13_c14"/>
            <core:connects xlink:href="#f2_c14_c15"/>
            <core:connects xlink:href="#f2_room218_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c14"><gml:pos>997 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c15">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor 217</gml:name>
            <core:connects xlink:href="#f2_c14_c15"/>
            <core:connects xlink:href="#f2_c15_c16"/>
            <core:connects xlink:href="#f2_room217_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c15"><gml:pos>1034 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c16">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East corridor open area</gml:name>
            <core:connects xlink:href="#f2_c15_c16"/>
            <core:connects xlink:href="#f2_c16_c17"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c16"><gml:pos>1100 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_c17">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>East wing junction</gml:name>
            <core:connects xlink:href="#f2_c16_c17"/>
            <core:connects xlink:href="#f2_c17_v02"/>
            <core:connects xlink:href="#f2_room213_top_left"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_c17"><gml:pos>1178 286</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_v02">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Room 212 corridor</gml:name>
            <core:connects xlink:href="#f2_c17_v02"/>
            <core:connects xlink:href="#f2_v02_v03"/>
            <core:connects xlink:href="#f2_room212_left"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_v02"><gml:pos>1178 267</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_v03">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Restroom corridor</gml:name>
            <core:connects xlink:href="#f2_v02_v03"/>
            <core:connects xlink:href="#f2_v03_v04"/>
            <core:connects xlink:href="#f2_wc_east_left"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_v03"><gml:pos>1178 190</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f2_v04">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_2"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Room 211 corridor</gml:name>
            <core:connects xlink:href="#f2_v03_v04"/>
            <core:connects xlink:href="#f2_room211_bottom_left"/>
            <core:geometry><gml:Point gml:id="point_corridor_f2_v04"><gml:pos>1178 168</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_301">
            <gml:name>Room 301</gml:name>
            <core:duality xlink:href="#room_301"/>
            <core:geometry><gml:Point gml:id="point_state_room_301"><gml:pos>934 88.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_302">
            <gml:name>Room 302</gml:name>
            <core:duality xlink:href="#room_302"/>
            <core:geometry><gml:Point gml:id="point_state_room_302"><gml:pos>934 131</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_303">
            <gml:name>Room 303</gml:name>
            <core:duality xlink:href="#room_303"/>
            <core:geometry><gml:Point gml:id="point_state_room_303"><gml:pos>936 181.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_304">
            <gml:name>Room 304</gml:name>
            <core:duality xlink:href="#room_304"/>
            <core:geometry><gml:Point gml:id="point_state_room_304"><gml:pos>875.5 181.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_305">
            <gml:name>Room 305</gml:name>
            <core:duality xlink:href="#room_305"/>
            <core:geometry><gml:Point gml:id="point_state_room_305"><gml:pos>874 131</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_306">
            <gml:name>Room 306</gml:name>
            <core:duality xlink:href="#room_306"/>
            <core:geometry><gml:Point gml:id="point_state_room_306"><gml:pos>808.5 155</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_307">
            <gml:name>Room 307</gml:name>
            <core:duality xlink:href="#room_307"/>
            <core:geometry><gml:Point gml:id="point_state_room_307"><gml:pos>715.5 156.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_308">
            <gml:name>Room 308</gml:name>
            <core:duality xlink:href="#room_308"/>
            <core:geometry><gml:Point gml:id="point_state_room_308"><gml:pos>635.5 173</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_309">
            <gml:name>Room 309</gml:name>
            <core:duality xlink:href="#room_309"/>
            <core:geometry><gml:Point gml:id="point_state_room_309"><gml:pos>555 173</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_310">
            <gml:name>Room 310</gml:name>
            <core:duality xlink:href="#room_310"/>
            <core:geometry><gml:Point gml:id="point_state_room_310"><gml:pos>470 173</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_311">
            <gml:name>Room 311</gml:name>
            <core:duality xlink:href="#room_311"/>
            <core:geometry><gml:Point gml:id="point_state_room_311"><gml:pos>393.5 205.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_312">
            <gml:name>Room 312</gml:name>
            <core:duality xlink:href="#room_312"/>
            <core:geometry><gml:Point gml:id="point_state_room_312"><gml:pos>392.5 140</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_313">
            <gml:name>Room 313</gml:name>
            <core:duality xlink:href="#room_313"/>
            <core:connects xlink:href="#f3_room313_top"/>
            <core:connects xlink:href="#f3_room314_left_top"/>
            <core:connects xlink:href="#f3_room315_left_bottom"/>
            <core:connects xlink:href="#f3_room316_right"/>
            <core:connects xlink:href="#f3_room317_right"/>
            <core:geometry><gml:Point gml:id="point_state_room_313"><gml:pos>162.5 156.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_314">
            <gml:name>Room 314</gml:name>
            <core:duality xlink:href="#room_314"/>
            <core:connects xlink:href="#f3_room314_left_top"/>
            <core:geometry><gml:Point gml:id="point_state_room_314"><gml:pos>263 188.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_315">
            <gml:name>Room 315</gml:name>
            <core:duality xlink:href="#room_315"/>
            <core:connects xlink:href="#f3_room315_left_bottom"/>
            <core:geometry><gml:Point gml:id="point_state_room_315"><gml:pos>263 135.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_316">
            <gml:name>Room 316</gml:name>
            <core:duality xlink:href="#room_316"/>
            <core:connects xlink:href="#f3_room316_right"/>
            <core:geometry><gml:Point gml:id="point_state_room_316"><gml:pos>49 198.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_room_317">
            <gml:name>Room 317</gml:name>
            <core:duality xlink:href="#room_317"/>
            <core:connects xlink:href="#f3_room317_right"/>
            <core:geometry><gml:Point gml:id="point_state_room_317"><gml:pos>49 132.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_restroom_f3">
            <gml:name>Floor 3 restroom</gml:name>
            <core:duality xlink:href="#restroom_f3"/>
            <core:geometry><gml:Point gml:id="point_state_restroom_f3"><gml:pos>310 179.5</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="state_elevator_01_f3">
            <gml:name>Elevator Floor 3</gml:name>
            <core:duality xlink:href="#elevator_01_f3"/>
            <core:geometry><gml:Point gml:id="point_state_elevator_01_f3"><gml:pos>427 35</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
          <core:stateMember><core:State gml:id="corridor_f3_313">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Waypoint levelId="floor_3"/></gml:GenericMetaData></gml:metaDataProperty>
            <gml:name>Corridor outside Room 313</gml:name>
            <core:connects xlink:href="#f3_room313_top"/>
            <core:geometry><gml:Point gml:id="point_corridor_f3_313"><gml:pos>162.5 89</gml:pos></gml:Point></core:geometry>
          </core:State></core:stateMember>
        </core:nodes>
        <core:edges gml:id="lc2_edges">
          <core:transitionMember><core:Transition gml:id="f1_u01_u02">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u01"/>
            <core:connects xlink:href="#corridor_f1_u02"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u02_u03">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u02"/>
            <core:connects xlink:href="#corridor_f1_u03"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u03_u04">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u03"/>
            <core:connects xlink:href="#corridor_f1_u04"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u04_u05">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u04"/>
            <core:connects xlink:href="#corridor_f1_u05"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u05_u06">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u05"/>
            <core:connects xlink:href="#corridor_f1_u06"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u06_u07">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u06"/>
            <core:connects xlink:href="#corridor_f1_u07"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u07_u08">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u07"/>
            <core:connects xlink:href="#corridor_f1_u08"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u08_u09">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u08"/>
            <core:connects xlink:href="#corridor_f1_u09"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u09_u10">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u09"/>
            <core:connects xlink:href="#corridor_f1_u10"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u10_u11">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u10"/>
            <core:connects xlink:href="#corridor_f1_u11"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u11_d114">
            <core:weight>0.666667</core:weight>
            <core:connects xlink:href="#corridor_f1_u11"/>
            <core:connects xlink:href="#corridor_f1_d114"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_d114_u12">
            <core:weight>1.333333</core:weight>
            <core:connects xlink:href="#corridor_f1_d114"/>
            <core:connects xlink:href="#corridor_f1_u12"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u12_d113">
            <core:weight>1.411111</core:weight>
            <core:connects xlink:href="#corridor_f1_u12"/>
            <core:connects xlink:href="#corridor_f1_d113"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_d113_u13">
            <core:weight>0.588889</core:weight>
            <core:connects xlink:href="#corridor_f1_d113"/>
            <core:connects xlink:href="#corridor_f1_u13"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u13_d111">
            <core:weight>1.65</core:weight>
            <core:connects xlink:href="#corridor_f1_u13"/>
            <core:connects xlink:href="#corridor_f1_d111"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_d111_u14">
            <core:weight>0.35</core:weight>
            <core:connects xlink:href="#corridor_f1_d111"/>
            <core:connects xlink:href="#corridor_f1_u14"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u14_d110">
            <core:weight>0.809091</core:weight>
            <core:connects xlink:href="#corridor_f1_u14"/>
            <core:connects xlink:href="#corridor_f1_d110"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_d110_d109">
            <core:weight>0.7</core:weight>
            <core:connects xlink:href="#corridor_f1_d110"/>
            <core:connects xlink:href="#corridor_f1_d109"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_d109_u15">
            <core:weight>0.490909</core:weight>
            <core:connects xlink:href="#corridor_f1_d109"/>
            <core:connects xlink:href="#corridor_f1_u15"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l01_l02">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l01"/>
            <core:connects xlink:href="#corridor_f1_l02"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l02_l03">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l02"/>
            <core:connects xlink:href="#corridor_f1_l03"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l03_l04">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l03"/>
            <core:connects xlink:href="#corridor_f1_l04"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l04_l05">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l04"/>
            <core:connects xlink:href="#corridor_f1_l05"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l05_l06">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l05"/>
            <core:connects xlink:href="#corridor_f1_l06"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l06_l07">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l06"/>
            <core:connects xlink:href="#corridor_f1_l07"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l07_l08">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l07"/>
            <core:connects xlink:href="#corridor_f1_l08"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l08_l09">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l08"/>
            <core:connects xlink:href="#corridor_f1_l09"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l09_l10">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l09"/>
            <core:connects xlink:href="#corridor_f1_l10"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l10_l11">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l10"/>
            <core:connects xlink:href="#corridor_f1_l11"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_l11_u11">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_l11"/>
            <core:connects xlink:href="#corridor_f1_u11"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u15_v01">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u15"/>
            <core:connects xlink:href="#corridor_f1_v01"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_u15_v02">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_u15"/>
            <core:connects xlink:href="#corridor_f1_v02"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_v02_v03">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_v02"/>
            <core:connects xlink:href="#corridor_f1_v03"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_v03_v04">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Passage width="1.02" rise="0.165" horizontalRun="0.675" slope="13.736268" slopePolicy="advisory" higherEndpoint="corridor_f1_v04" accessNote="Ramp rises from the east restroom toward Room 106"/></gml:GenericMetaData></gml:metaDataProperty>
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f1_v03"/>
            <core:connects xlink:href="#corridor_f1_v04"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_elevator">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_elevator_01_f1"/>
            <core:connects xlink:href="#corridor_f1_u09"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room126_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_126"/>
            <core:connects xlink:href="#corridor_f1_u01"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room126_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_126"/>
            <core:connects xlink:href="#corridor_f1_l01"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room125_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_125"/>
            <core:connects xlink:href="#corridor_f1_u02"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room124_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_124"/>
            <core:connects xlink:href="#corridor_f1_l02"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room123_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_123"/>
            <core:connects xlink:href="#corridor_f1_u03"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room123_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_123"/>
            <core:connects xlink:href="#corridor_f1_l03"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room122_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_122"/>
            <core:connects xlink:href="#corridor_f1_u04"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room122_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_122"/>
            <core:connects xlink:href="#corridor_f1_l04"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room121_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_121"/>
            <core:connects xlink:href="#corridor_f1_u05"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room121_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_121"/>
            <core:connects xlink:href="#corridor_f1_l05"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room120_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_120"/>
            <core:connects xlink:href="#corridor_f1_u06"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room120_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_120"/>
            <core:connects xlink:href="#corridor_f1_l06"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room119_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_119"/>
            <core:connects xlink:href="#corridor_f1_u07"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_wc_west_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_restroom_f1_west"/>
            <core:connects xlink:href="#corridor_f1_l07"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room116_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_116"/>
            <core:connects xlink:href="#corridor_f1_u08"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room116_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_116"/>
            <core:connects xlink:href="#corridor_f1_l08"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room115_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_115"/>
            <core:connects xlink:href="#corridor_f1_u09"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room115_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_115"/>
            <core:connects xlink:href="#corridor_f1_l09"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room114_left">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_114"/>
            <core:connects xlink:href="#corridor_f1_d114"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room113_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_113"/>
            <core:connects xlink:href="#corridor_f1_d113"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_wc_center_top">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Passage accessNote="Men's entrance: 2 steps, 13.5 cm each. Women's entrance: slope"/></gml:GenericMetaData></gml:metaDataProperty>
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_restroom_f1_center"/>
            <core:connects xlink:href="#corridor_f1_u13"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room111_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_111"/>
            <core:connects xlink:href="#corridor_f1_d111"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room110_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_110"/>
            <core:connects xlink:href="#corridor_f1_d110"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room109_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_109"/>
            <core:connects xlink:href="#corridor_f1_d109"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room108_left">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_108"/>
            <core:connects xlink:href="#corridor_f1_v01"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room107_left">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_107"/>
            <core:connects xlink:href="#corridor_f1_v02"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_wc_east_left">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_restroom_f1_east"/>
            <core:connects xlink:href="#corridor_f1_v03"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f1_room106_left">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_106"/>
            <core:connects xlink:href="#corridor_f1_v04"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="connection_elevator_f1_f2">
            <gml:metaDataProperty><gml:GenericMetaData><wc:Passage transitionType="elevator"/></gml:GenericMetaData></gml:metaDataProperty>
            <core:weight>10</core:weight>
            <core:connects xlink:href="#state_elevator_01_f1"/>
            <core:connects xlink:href="#state_elevator_01_f2"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c01_c02">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c01"/>
            <core:connects xlink:href="#corridor_f2_c02"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c02_c03">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c02"/>
            <core:connects xlink:href="#corridor_f2_c03"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c03_c04">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c03"/>
            <core:connects xlink:href="#corridor_f2_c04"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c04_c05">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c04"/>
            <core:connects xlink:href="#corridor_f2_c05"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c05_c06">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c05"/>
            <core:connects xlink:href="#corridor_f2_c06"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c06_c07">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c06"/>
            <core:connects xlink:href="#corridor_f2_c07"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c07_c08">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c07"/>
            <core:connects xlink:href="#corridor_f2_c08"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c08_c09">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c08"/>
            <core:connects xlink:href="#corridor_f2_c09"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c09_c10">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c09"/>
            <core:connects xlink:href="#corridor_f2_c10"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c10_c11">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c10"/>
            <core:connects xlink:href="#corridor_f2_c11"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c11_c12">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c11"/>
            <core:connects xlink:href="#corridor_f2_c12"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c12_c13">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c12"/>
            <core:connects xlink:href="#corridor_f2_c13"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c13_c14">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c13"/>
            <core:connects xlink:href="#corridor_f2_c14"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c14_c15">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c14"/>
            <core:connects xlink:href="#corridor_f2_c15"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c15_c16">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c15"/>
            <core:connects xlink:href="#corridor_f2_c16"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c16_c17">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c16"/>
            <core:connects xlink:href="#corridor_f2_c17"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_c17_v02">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_c17"/>
            <core:connects xlink:href="#corridor_f2_v02"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_v02_v03">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_v02"/>
            <core:connects xlink:href="#corridor_f2_v03"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_v03_v04">
            <core:weight>2</core:weight>
            <core:connects xlink:href="#corridor_f2_v03"/>
            <core:connects xlink:href="#corridor_f2_v04"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room230_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_230"/>
            <core:connects xlink:href="#corridor_f2_c01"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room229_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_229"/>
            <core:connects xlink:href="#corridor_f2_c02"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room228_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_228"/>
            <core:connects xlink:href="#corridor_f2_c03"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room227_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_227"/>
            <core:connects xlink:href="#corridor_f2_c04"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room226_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_226"/>
            <core:connects xlink:href="#corridor_f2_c05"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room225_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_225"/>
            <core:connects xlink:href="#corridor_f2_c06"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room224_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_224"/>
            <core:connects xlink:href="#corridor_f2_c07"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_elevator_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_elevator_01_f2"/>
            <core:connects xlink:href="#corridor_f2_c07"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room223_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_223"/>
            <core:connects xlink:href="#corridor_f2_c09"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room222_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_222"/>
            <core:connects xlink:href="#corridor_f2_c10"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room221_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_221"/>
            <core:connects xlink:href="#corridor_f2_c11"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room220_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_220"/>
            <core:connects xlink:href="#corridor_f2_c12"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room219_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_219"/>
            <core:connects xlink:href="#corridor_f2_c13"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room218_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_218"/>
            <core:connects xlink:href="#corridor_f2_c14"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room217_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_217"/>
            <core:connects xlink:href="#corridor_f2_c15"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room213_top_left">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_213"/>
            <core:connects xlink:href="#corridor_f2_c17"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room212_left">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_212"/>
            <core:connects xlink:href="#corridor_f2_v02"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_wc_east_left">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_restroom_f2_east"/>
            <core:connects xlink:href="#corridor_f2_v03"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f2_room211_bottom_left">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_211"/>
            <core:connects xlink:href="#corridor_f2_v04"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f3_room313_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_313"/>
            <core:connects xlink:href="#corridor_f3_313"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f3_room314_left_top">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_314"/>
            <core:connects xlink:href="#state_room_313"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f3_room315_left_bottom">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_315"/>
            <core:connects xlink:href="#state_room_313"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f3_room316_right">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_316"/>
            <core:connects xlink:href="#state_room_313"/>
          </core:Transition></core:transitionMember>
          <core:transitionMember><core:Transition gml:id="f3_room317_right">
            <core:weight>1</core:weight>
            <core:connects xlink:href="#state_room_317"/>
            <core:connects xlink:href="#state_room_313"/>
          </core:Transition></core:transitionMember>
        </core:edges>
      </core:SpaceLayer></core:spaceLayerMember>
    </core:spaceLayers>
  </core:MultiLayeredGraph></core:multiLayeredGraph>
</core:IndoorFeatures>
