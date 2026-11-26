<?xml version="1.0" encoding="UTF-8"?>
<core:IndoorFeatures xmlns:core="http://www.opengis.net/indoorgml/1.0/core"
  xmlns:gml="http://www.opengis.net/gml/3.2"
  xmlns:wc="https://example.org/wheelchair-map/indoorgml-extension/1.0" gml:id="lc2">
  <gml:name>LC2</gml:name>
  <wc:Level id="floor_1" number="1" name="Floor 1" width="120" height="100" boundary="0,0 120,0 120,100 0,100"/>
  <core:primalSpaceFeatures><core:PrimalSpaceFeatures gml:id="primal">
    <core:cellSpaceMember><core:CellSpace gml:id="room_109" wc:levelId="floor_1" wc:category="room" wc:code="109">
      <gml:name>Room 109</gml:name><wc:Rectangle x="0" y="50" width="50" height="40"/>
    </core:CellSpace></core:cellSpaceMember>
    <core:cellSpaceMember><core:CellSpace gml:id="room_110" wc:levelId="floor_1" wc:category="room" wc:code="110">
      <gml:name>Room 110</gml:name><wc:Rectangle x="60" y="50" width="50" height="40"/>
    </core:CellSpace></core:cellSpaceMember>
  </core:PrimalSpaceFeatures></core:primalSpaceFeatures>
  <core:multiLayeredGraph><core:MultiLayeredGraph gml:id="graph">
    <core:State gml:id="corridor" wc:levelId="floor_1" wc:x="55" wc:y="45"/>
    <core:Transition gml:id="f1_room109_top" wc:from="room_109" wc:to="corridor" wc:cost="1" />
    <core:Transition gml:id="f1_room110_top" wc:from="room_110" wc:to="corridor" wc:cost="1" />
  </core:MultiLayeredGraph></core:multiLayeredGraph>
</core:IndoorFeatures>
