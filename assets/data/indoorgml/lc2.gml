<?xml version="1.0" encoding="UTF-8"?>
<core:IndoorFeatures
  xmlns:core="http://www.opengis.net/indoorgml/1.0/core"
  xmlns:gml="http://www.opengis.net/gml/3.2"
  xmlns:wc="https://example.org/wheelchair-map/indoorgml-extension/1.0"
  gml:id="lc2"
  wc:coordinateSystem="local">
  <gml:name>LC2</gml:name>

  <wc:Level id="floor_1" number="1" name="Floor 1" width="1104" height="395" boundary="33,249 390,249 390,223 690,223 690,246 946,246 946,42 1082,42 1082,349 690,349 690,377 389,377 389,354 33,354" />

  <!-- Floor 2 shares the same IndoorFeatures, primal, and routing graph. -->
  <wc:Level
    id="floor_2"
    number="2"
    name="Floor 2"
    width="1331"
    height="452"
    boundary="56,279 486,279 486,249 847,249 847,273 1156,273 1156,31 1288,31 1288,400 843,400 843,432 483,432 483,408 56,408" />

  <core:primalSpaceFeatures>
    <core:PrimalSpaceFeatures gml:id="lc2_primal">
      <core:cellSpaceMember><core:CellSpace gml:id="room_126" wc:levelId="floor_1" wc:category="room" wc:code="126" wc:wheelchairAccessible="true"><gml:name>Room 126</gml:name><wc:Rectangle x="50" y="278" width="58" height="56" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_125" wc:levelId="floor_1" wc:category="room" wc:code="125" wc:wheelchairAccessible="true"><gml:name>Room 125</gml:name><wc:Rectangle x="108" y="278" width="38" height="28" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_124" wc:levelId="floor_1" wc:category="room" wc:code="124" wc:wheelchairAccessible="true"><gml:name>Room 124</gml:name><wc:Rectangle x="108" y="306" width="38" height="28" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_123" wc:levelId="floor_1" wc:category="room" wc:code="123" wc:wheelchairAccessible="true"><gml:name>Room 123</gml:name><wc:Rectangle x="146" y="278" width="38" height="56" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_122" wc:levelId="floor_1" wc:category="room" wc:code="122" wc:wheelchairAccessible="true"><gml:name>Room 122</gml:name><wc:Rectangle x="184" y="278" width="38" height="56" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_121" wc:levelId="floor_1" wc:category="room" wc:code="121" wc:wheelchairAccessible="true"><gml:name>Room 121</gml:name><wc:Rectangle x="222" y="278" width="38" height="56" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_120" wc:levelId="floor_1" wc:category="room" wc:code="120" wc:wheelchairAccessible="true"><gml:name>Room 120</gml:name><wc:Rectangle x="260" y="278" width="38" height="56" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_119" wc:levelId="floor_1" wc:category="room" wc:code="119" wc:wheelchairAccessible="true"><gml:name>Room 119</gml:name><wc:Rectangle x="298" y="278" width="38" height="28" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="restroom_f1_west" wc:levelId="floor_1" wc:category="restroom" wc:code="WC" wc:wheelchairAccessible="true"><gml:name>West restroom</gml:name><wc:Rectangle x="298" y="306" width="38" height="28" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_116" wc:levelId="floor_1" wc:category="room" wc:code="116" wc:wheelchairAccessible="true"><gml:name>Room 116</gml:name><wc:Rectangle x="336" y="278" width="38" height="56" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_115" wc:levelId="floor_1" wc:category="room" wc:code="115" wc:wheelchairAccessible="true"><gml:name>Room 115</gml:name><wc:Rectangle x="374" y="278" width="67" height="56" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_114" wc:levelId="floor_1" wc:category="room" wc:code="114" wc:wheelchairAccessible="true"><gml:name>Room 114</gml:name><wc:Rectangle x="651" y="278" width="100" height="70" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_113" wc:levelId="floor_1" wc:category="room" wc:code="113" wc:wheelchairAccessible="true"><gml:name>Room 113</gml:name><wc:Rectangle x="751" y="278" width="25" height="29" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="restroom_f1_center" wc:levelId="floor_1" wc:category="restroom" wc:code="WC" wc:wheelchairAccessible="true"><gml:name>Central restroom</gml:name><wc:Rectangle x="776" y="278" width="41" height="70" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_111" wc:levelId="floor_1" wc:category="room" wc:code="111" wc:wheelchairAccessible="true"><gml:name>Room 111</gml:name><wc:Rectangle x="817" y="278" width="78" height="70" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_110" wc:levelId="floor_1" wc:category="room" wc:code="110" wc:wheelchairAccessible="true"><gml:name>Room 110</gml:name><wc:Rectangle x="895" y="278" width="39" height="70" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_109" wc:levelId="floor_1" wc:category="room" wc:code="109" wc:wheelchairAccessible="true"><gml:name>Room 109</gml:name><wc:Rectangle x="934" y="278" width="38" height="70" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_108" wc:levelId="floor_1" wc:category="room" wc:code="108" wc:wheelchairAccessible="true"><gml:name>Room 108</gml:name><wc:Rectangle x="1013" y="300" width="69" height="49" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_107" wc:levelId="floor_1" wc:category="room" wc:code="107" wc:wheelchairAccessible="true"><gml:name>Room 107</gml:name><wc:Rectangle x="1013" y="203" width="69" height="96" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="restroom_f1_east" wc:levelId="floor_1" wc:category="restroom" wc:code="WC" wc:wheelchairAccessible="true"><gml:name>East restroom</gml:name><wc:Rectangle x="1052" y="145" width="30" height="57" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_106" wc:levelId="floor_1" wc:category="room" wc:code="106" wc:wheelchairAccessible="true"><gml:name>Room 106</gml:name><wc:Rectangle x="1013" y="43" width="69" height="101" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="elevator_01_f1" wc:levelId="floor_1" wc:category="elevator" wc:wheelchairAccessible="true"><gml:name>Elevator Floor 1</gml:name><wc:Rectangle x="392" y="230" width="28" height="30" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="stairs_f1_central" wc:levelId="floor_1" wc:category="stairs" wc:code="STAIRS" wc:wheelchairAccessible="false"><gml:name>Central stairs</gml:name><wc:Rectangle x="505" y="230" width="36" height="30" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="corridor_f1_west_area" wc:levelId="floor_1" wc:category="corridor" wc:wheelchairAccessible="true"><gml:name>West corridor area</gml:name><wc:Rectangle x="33" y="249" width="408" height="105" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="corridor_f1_center_area" wc:levelId="floor_1" wc:category="corridor" wc:wheelchairAccessible="true"><gml:name>Central corridor area</gml:name><wc:Rectangle x="441" y="223" width="249" height="154" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="corridor_f1_east_area" wc:levelId="floor_1" wc:category="corridor" wc:wheelchairAccessible="true"><gml:name>East corridor area</gml:name><wc:Rectangle x="690" y="246" width="256" height="103" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="corridor_f1_vertical_area" wc:levelId="floor_1" wc:category="corridor" wc:wheelchairAccessible="true"><gml:name>Vertical corridor area</gml:name><wc:Rectangle x="946" y="42" width="67" height="307" /></core:CellSpace></core:cellSpaceMember>

      <!-- Floor 2 physical spaces -->
      <core:cellSpaceMember><core:CellSpace gml:id="room_230" wc:levelId="floor_2" wc:category="room" wc:code="230" wc:wheelchairAccessible="true"><gml:name>Room 230</gml:name><wc:Rectangle x="57" y="303" width="47" height="105" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_229" wc:levelId="floor_2" wc:category="room" wc:code="229" wc:wheelchairAccessible="true"><gml:name>Room 229</gml:name><wc:Rectangle x="104" y="303" width="105" height="105" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_228" wc:levelId="floor_2" wc:category="room" wc:code="228" wc:wheelchairAccessible="true"><gml:name>Room 228</gml:name><wc:Rectangle x="209" y="303" width="47" height="105" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_227" wc:levelId="floor_2" wc:category="room" wc:code="227" wc:wheelchairAccessible="true"><gml:name>Room 227</gml:name><wc:Rectangle x="256" y="303" width="47" height="105" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_226" wc:levelId="floor_2" wc:category="room" wc:code="226" wc:wheelchairAccessible="true"><gml:name>Room 226</gml:name><wc:Rectangle x="303" y="303" width="105" height="105" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_225" wc:levelId="floor_2" wc:category="room" wc:code="225" wc:wheelchairAccessible="true"><gml:name>Room 225</gml:name><wc:Rectangle x="408" y="303" width="49" height="105" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_224" wc:levelId="floor_2" wc:category="room" wc:code="224" wc:wheelchairAccessible="true"><gml:name>Room 224</gml:name><wc:Rectangle x="457" y="303" width="86" height="105" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_223" wc:levelId="floor_2" wc:category="room" wc:code="223" wc:wheelchairAccessible="true"><gml:name>Room 223</gml:name><wc:Rectangle x="792" y="302" width="38" height="98" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_222" wc:levelId="floor_2" wc:category="room" wc:code="222" wc:wheelchairAccessible="true"><gml:name>Room 222</gml:name><wc:Rectangle x="830" y="302" width="37" height="98" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_221" wc:levelId="floor_2" wc:category="room" wc:code="221" wc:wheelchairAccessible="true"><gml:name>Room 221</gml:name><wc:Rectangle x="867" y="302" width="37" height="98" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_220" wc:levelId="floor_2" wc:category="room" wc:code="220" wc:wheelchairAccessible="true"><gml:name>Room 220</gml:name><wc:Rectangle x="904" y="302" width="37" height="98" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_219" wc:levelId="floor_2" wc:category="room" wc:code="219" wc:wheelchairAccessible="true"><gml:name>Room 219</gml:name><wc:Rectangle x="941" y="302" width="37" height="98" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_218" wc:levelId="floor_2" wc:category="room" wc:code="218" wc:wheelchairAccessible="true"><gml:name>Room 218</gml:name><wc:Rectangle x="978" y="302" width="37" height="98" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_217" wc:levelId="floor_2" wc:category="room" wc:code="217" wc:wheelchairAccessible="true"><gml:name>Room 217</gml:name><wc:Rectangle x="1015" y="302" width="37" height="98" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_211" wc:levelId="floor_2" wc:category="room" wc:code="211" wc:wheelchairAccessible="true"><gml:name>Room 211</gml:name><wc:Rectangle x="1156" y="31" width="132" height="114" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="restroom_f2_east" wc:levelId="floor_2" wc:category="restroom" wc:code="WC" wc:wheelchairAccessible="true"><gml:name>East restroom</gml:name><wc:Rectangle x="1251" y="145" width="37" height="88" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_212" wc:levelId="floor_2" wc:category="room" wc:code="212" wc:wheelchairAccessible="true"><gml:name>Room 212</gml:name><wc:Rectangle x="1200" y="233" width="88" height="69" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="room_213" wc:levelId="floor_2" wc:category="room" wc:code="213" wc:wheelchairAccessible="true"><gml:name>Room 213</gml:name><wc:Rectangle x="1156" y="302" width="132" height="98" /></core:CellSpace></core:cellSpaceMember>
      <core:cellSpaceMember><core:CellSpace gml:id="elevator_01_f2" wc:levelId="floor_2" wc:category="elevator" wc:wheelchairAccessible="true"><gml:name>Elevator Floor 2</gml:name><wc:Rectangle x="487" y="249" width="30" height="30" /></core:CellSpace></core:cellSpaceMember>
    </core:PrimalSpaceFeatures>
  </core:primalSpaceFeatures>

  <core:multiLayeredGraph>
    <core:MultiLayeredGraph gml:id="lc2_dual">
      <core:spaceLayers>
        <core:SpaceLayers gml:id="lc2_space_layers">
          <core:spaceLayerMember>
            <core:SpaceLayer gml:id="lc2_wheelchair_layer">
              <core:nodes>
                <core:Nodes gml:id="lc2_states">
                  <core:stateMember><core:State gml:id="corridor_f1_u01" wc:levelId="floor_1" wc:name="Upper corridor 01" wc:x="79" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u02" wc:levelId="floor_1" wc:name="Upper corridor 02" wc:x="127" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u03" wc:levelId="floor_1" wc:name="Upper corridor 03" wc:x="165" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u04" wc:levelId="floor_1" wc:name="Upper corridor 04" wc:x="203" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u05" wc:levelId="floor_1" wc:name="Upper corridor 05" wc:x="241" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u06" wc:levelId="floor_1" wc:name="Upper corridor 06" wc:x="279" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u07" wc:levelId="floor_1" wc:name="Upper corridor 07" wc:x="317" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u08" wc:levelId="floor_1" wc:name="Upper corridor 08" wc:x="355" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u09" wc:levelId="floor_1" wc:name="Upper corridor 09" wc:x="407" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u10" wc:levelId="floor_1" wc:name="Central upper west" wc:x="500" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u11" wc:levelId="floor_1" wc:name="Central upper east" wc:x="610" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u12" wc:levelId="floor_1" wc:name="East corridor 01" wc:x="700" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u13" wc:levelId="floor_1" wc:name="East corridor 02" wc:x="790" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u14" wc:levelId="floor_1" wc:name="East corridor 03" wc:x="870" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_u15" wc:levelId="floor_1" wc:name="Vertical wing junction" wc:x="980" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_d114" wc:levelId="floor_1" wc:name="Room 114 doorway junction" wc:x="640" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_d113" wc:levelId="floor_1" wc:name="Room 113 doorway junction" wc:x="763.5" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_d111" wc:levelId="floor_1" wc:name="Room 111 doorway junction" wc:x="856" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_d110" wc:levelId="floor_1" wc:name="Room 110 doorway junction" wc:x="914.5" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_d109" wc:levelId="floor_1" wc:name="Room 109 doorway junction" wc:x="953" wc:y="264" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l01" wc:levelId="floor_1" wc:name="Lower corridor 01" wc:x="79" wc:y="344" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l02" wc:levelId="floor_1" wc:name="Lower corridor 02" wc:x="127" wc:y="344" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l03" wc:levelId="floor_1" wc:name="Lower corridor 03" wc:x="165" wc:y="344" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l04" wc:levelId="floor_1" wc:name="Lower corridor 04" wc:x="203" wc:y="344" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l05" wc:levelId="floor_1" wc:name="Lower corridor 05" wc:x="241" wc:y="344" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l06" wc:levelId="floor_1" wc:name="Lower corridor 06" wc:x="279" wc:y="344" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l07" wc:levelId="floor_1" wc:name="Lower corridor 07" wc:x="317" wc:y="344" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l08" wc:levelId="floor_1" wc:name="Lower corridor 08" wc:x="355" wc:y="344" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l09" wc:levelId="floor_1" wc:name="Lower corridor 09" wc:x="407" wc:y="344" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l10" wc:levelId="floor_1" wc:name="Central lower west" wc:x="500" wc:y="360" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_l11" wc:levelId="floor_1" wc:name="Central lower east" wc:x="610" wc:y="360" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_v01" wc:levelId="floor_1" wc:name="Vertical corridor lower" wc:x="980" wc:y="325" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_v02" wc:levelId="floor_1" wc:name="Vertical corridor room 107" wc:x="980" wc:y="245" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_v03" wc:levelId="floor_1" wc:name="Vertical corridor restroom" wc:x="980" wc:y="174" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f1_v04" wc:levelId="floor_1" wc:name="Vertical corridor room 106" wc:x="980" wc:y="95" /></core:stateMember>

                  <!-- Floor 2 routing states -->
                  <core:stateMember><core:State gml:id="corridor_f2_c01" wc:levelId="floor_2" wc:name="West corridor 01" wc:x="80" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c02" wc:levelId="floor_2" wc:name="West corridor 02" wc:x="156" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c03" wc:levelId="floor_2" wc:name="West corridor 03" wc:x="232" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c04" wc:levelId="floor_2" wc:name="West corridor 04" wc:x="280" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c05" wc:levelId="floor_2" wc:name="West corridor 05" wc:x="355" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c06" wc:levelId="floor_2" wc:name="West corridor 06" wc:x="432" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c07" wc:levelId="floor_2" wc:name="Elevator junction" wc:x="500" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c08" wc:levelId="floor_2" wc:name="Central corridor" wc:x="650" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c09" wc:levelId="floor_2" wc:name="East corridor 223" wc:x="811" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c10" wc:levelId="floor_2" wc:name="East corridor 222" wc:x="849" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c11" wc:levelId="floor_2" wc:name="East corridor 221" wc:x="886" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c12" wc:levelId="floor_2" wc:name="East corridor 220" wc:x="923" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c13" wc:levelId="floor_2" wc:name="East corridor 219" wc:x="960" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c14" wc:levelId="floor_2" wc:name="East corridor 218" wc:x="997" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c15" wc:levelId="floor_2" wc:name="East corridor 217" wc:x="1034" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c16" wc:levelId="floor_2" wc:name="East corridor open area" wc:x="1100" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_c17" wc:levelId="floor_2" wc:name="East wing junction" wc:x="1178" wc:y="286" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_v02" wc:levelId="floor_2" wc:name="Room 212 corridor" wc:x="1178" wc:y="267" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_v03" wc:levelId="floor_2" wc:name="Restroom corridor" wc:x="1178" wc:y="190" /></core:stateMember>
                  <core:stateMember><core:State gml:id="corridor_f2_v04" wc:levelId="floor_2" wc:name="Room 211 corridor" wc:x="1178" wc:y="168" /></core:stateMember>
                </core:Nodes>
              </core:nodes>

              <core:edges>
                <core:Edges gml:id="lc2_transitions">
                  <core:transitionMember><core:Transition gml:id="f1_u01_u02" wc:from="corridor_f1_u01" wc:to="corridor_f1_u02" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u02_u03" wc:from="corridor_f1_u02" wc:to="corridor_f1_u03" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u03_u04" wc:from="corridor_f1_u03" wc:to="corridor_f1_u04" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u04_u05" wc:from="corridor_f1_u04" wc:to="corridor_f1_u05" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u05_u06" wc:from="corridor_f1_u05" wc:to="corridor_f1_u06" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u06_u07" wc:from="corridor_f1_u06" wc:to="corridor_f1_u07" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u07_u08" wc:from="corridor_f1_u07" wc:to="corridor_f1_u08" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u08_u09" wc:from="corridor_f1_u08" wc:to="corridor_f1_u09" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u09_u10" wc:from="corridor_f1_u09" wc:to="corridor_f1_u10" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u10_u11" wc:from="corridor_f1_u10" wc:to="corridor_f1_u11" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u11_d114" wc:from="corridor_f1_u11" wc:to="corridor_f1_d114" wc:cost="0.666667" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_d114_u12" wc:from="corridor_f1_d114" wc:to="corridor_f1_u12" wc:cost="1.333333" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u12_d113" wc:from="corridor_f1_u12" wc:to="corridor_f1_d113" wc:cost="1.411111" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_d113_u13" wc:from="corridor_f1_d113" wc:to="corridor_f1_u13" wc:cost="0.588889" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u13_d111" wc:from="corridor_f1_u13" wc:to="corridor_f1_d111" wc:cost="1.65" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_d111_u14" wc:from="corridor_f1_d111" wc:to="corridor_f1_u14" wc:cost="0.35" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u14_d110" wc:from="corridor_f1_u14" wc:to="corridor_f1_d110" wc:cost="0.809091" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_d110_d109" wc:from="corridor_f1_d110" wc:to="corridor_f1_d109" wc:cost="0.7" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_d109_u15" wc:from="corridor_f1_d109" wc:to="corridor_f1_u15" wc:cost="0.490909" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u01_l01" wc:from="corridor_f1_u01" wc:to="corridor_f1_l01" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l01_l02" wc:from="corridor_f1_l01" wc:to="corridor_f1_l02" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l02_l03" wc:from="corridor_f1_l02" wc:to="corridor_f1_l03" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l03_l04" wc:from="corridor_f1_l03" wc:to="corridor_f1_l04" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l04_l05" wc:from="corridor_f1_l04" wc:to="corridor_f1_l05" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l05_l06" wc:from="corridor_f1_l05" wc:to="corridor_f1_l06" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l06_l07" wc:from="corridor_f1_l06" wc:to="corridor_f1_l07" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l07_l08" wc:from="corridor_f1_l07" wc:to="corridor_f1_l08" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l08_l09" wc:from="corridor_f1_l08" wc:to="corridor_f1_l09" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l09_l10" wc:from="corridor_f1_l09" wc:to="corridor_f1_l10" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l10_l11" wc:from="corridor_f1_l10" wc:to="corridor_f1_l11" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_l11_u11" wc:from="corridor_f1_l11" wc:to="corridor_f1_u11" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u15_v01" wc:from="corridor_f1_u15" wc:to="corridor_f1_v01" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_u15_v02" wc:from="corridor_f1_u15" wc:to="corridor_f1_v02" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_v02_v03" wc:from="corridor_f1_v02" wc:to="corridor_f1_v03" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_v03_v04" wc:from="corridor_f1_v03" wc:to="corridor_f1_v04" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_elevator" wc:from="elevator_01_f1" wc:to="corridor_f1_u09" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room126_top" wc:from="room_126" wc:to="corridor_f1_u01" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room126_bottom" wc:from="room_126" wc:to="corridor_f1_l01" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room125_top" wc:from="room_125" wc:to="corridor_f1_u02" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room124_bottom" wc:from="room_124" wc:to="corridor_f1_l02" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room123_top" wc:from="room_123" wc:to="corridor_f1_u03" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room123_bottom" wc:from="room_123" wc:to="corridor_f1_l03" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room122_top" wc:from="room_122" wc:to="corridor_f1_u04" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room122_bottom" wc:from="room_122" wc:to="corridor_f1_l04" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room121_top" wc:from="room_121" wc:to="corridor_f1_u05" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room121_bottom" wc:from="room_121" wc:to="corridor_f1_l05" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room120_top" wc:from="room_120" wc:to="corridor_f1_u06" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room120_bottom" wc:from="room_120" wc:to="corridor_f1_l06" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room119_top" wc:from="room_119" wc:to="corridor_f1_u07" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_wc_west_bottom" wc:from="restroom_f1_west" wc:to="corridor_f1_l07" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room116_top" wc:from="room_116" wc:to="corridor_f1_u08" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room116_bottom" wc:from="room_116" wc:to="corridor_f1_l08" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room115_top" wc:from="room_115" wc:to="corridor_f1_u09" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room115_bottom" wc:from="room_115" wc:to="corridor_f1_l09" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room114_left" wc:from="room_114" wc:to="corridor_f1_d114" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room113_top" wc:from="room_113" wc:to="corridor_f1_d113" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_wc_center_top" wc:from="restroom_f1_center" wc:to="corridor_f1_u13" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room111_top" wc:from="room_111" wc:to="corridor_f1_d111" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room110_top" wc:from="room_110" wc:to="corridor_f1_d110" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room109_top" wc:from="room_109" wc:to="corridor_f1_d109" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room108_left" wc:from="room_108" wc:to="corridor_f1_v01" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room107_left" wc:from="room_107" wc:to="corridor_f1_v02" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_wc_east_left" wc:from="restroom_f1_east" wc:to="corridor_f1_v03" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f1_room106_left" wc:from="room_106" wc:to="corridor_f1_v04" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="connection_elevator_f1_f2" wc:from="elevator_01_f1" wc:to="elevator_01_f2" wc:cost="10" wc:transitionType="elevator" /></core:transitionMember>

                  <!-- Floor 2 routing transitions -->
                  <core:transitionMember><core:Transition gml:id="f2_c01_c02" wc:from="corridor_f2_c01" wc:to="corridor_f2_c02" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c02_c03" wc:from="corridor_f2_c02" wc:to="corridor_f2_c03" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c03_c04" wc:from="corridor_f2_c03" wc:to="corridor_f2_c04" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c04_c05" wc:from="corridor_f2_c04" wc:to="corridor_f2_c05" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c05_c06" wc:from="corridor_f2_c05" wc:to="corridor_f2_c06" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c06_c07" wc:from="corridor_f2_c06" wc:to="corridor_f2_c07" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c07_c08" wc:from="corridor_f2_c07" wc:to="corridor_f2_c08" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c08_c09" wc:from="corridor_f2_c08" wc:to="corridor_f2_c09" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c09_c10" wc:from="corridor_f2_c09" wc:to="corridor_f2_c10" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c10_c11" wc:from="corridor_f2_c10" wc:to="corridor_f2_c11" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c11_c12" wc:from="corridor_f2_c11" wc:to="corridor_f2_c12" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c12_c13" wc:from="corridor_f2_c12" wc:to="corridor_f2_c13" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c13_c14" wc:from="corridor_f2_c13" wc:to="corridor_f2_c14" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c14_c15" wc:from="corridor_f2_c14" wc:to="corridor_f2_c15" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c15_c16" wc:from="corridor_f2_c15" wc:to="corridor_f2_c16" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c16_c17" wc:from="corridor_f2_c16" wc:to="corridor_f2_c17" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_c17_v02" wc:from="corridor_f2_c17" wc:to="corridor_f2_v02" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_v02_v03" wc:from="corridor_f2_v02" wc:to="corridor_f2_v03" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_v03_v04" wc:from="corridor_f2_v03" wc:to="corridor_f2_v04" wc:cost="2" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room230_top" wc:from="room_230" wc:to="corridor_f2_c01" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room229_top" wc:from="room_229" wc:to="corridor_f2_c02" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room228_top" wc:from="room_228" wc:to="corridor_f2_c03" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room227_top" wc:from="room_227" wc:to="corridor_f2_c04" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room226_top" wc:from="room_226" wc:to="corridor_f2_c05" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room225_top" wc:from="room_225" wc:to="corridor_f2_c06" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room224_top" wc:from="room_224" wc:to="corridor_f2_c07" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_elevator_bottom" wc:from="elevator_01_f2" wc:to="corridor_f2_c07" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room223_top" wc:from="room_223" wc:to="corridor_f2_c09" wc:cost="1" wc:doorWidth="1.09" wc:leafCount="2" wc:threshold="0" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room222_top" wc:from="room_222" wc:to="corridor_f2_c10" wc:cost="1" wc:doorWidth="0.80" wc:threshold="0.04" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room221_top" wc:from="room_221" wc:to="corridor_f2_c11" wc:cost="1" wc:doorWidth="0.80" wc:threshold="0.04" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room220_top" wc:from="room_220" wc:to="corridor_f2_c12" wc:cost="1" wc:doorWidth="0.80" wc:threshold="0.04" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room219_top" wc:from="room_219" wc:to="corridor_f2_c13" wc:cost="1" wc:doorWidth="0.80" wc:threshold="0.04" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room218_top" wc:from="room_218" wc:to="corridor_f2_c14" wc:cost="1" wc:doorWidth="0.80" wc:threshold="0.04" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room217_top" wc:from="room_217" wc:to="corridor_f2_c15" wc:cost="1" wc:doorWidth="0.80" wc:threshold="0.04" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room213_top_left" wc:from="room_213" wc:to="corridor_f2_c17" wc:cost="1" wc:leafCount="2" wc:leafWidth="0.80" wc:threshold="0" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room212_left" wc:from="room_212" wc:to="corridor_f2_v02" wc:cost="1" wc:leafCount="2" wc:leafWidth="0.76" wc:threshold="0.04" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_wc_east_left" wc:from="restroom_f2_east" wc:to="corridor_f2_v03" wc:cost="1" /></core:transitionMember>
                  <core:transitionMember><core:Transition gml:id="f2_room211_bottom_left" wc:from="room_211" wc:to="corridor_f2_v04" wc:cost="1" wc:leafCount="2" wc:leafWidth="0.90" wc:threshold="0.07" /></core:transitionMember>
                </core:Edges>
              </core:edges>
            </core:SpaceLayer>
          </core:spaceLayerMember>
        </core:SpaceLayers>
      </core:spaceLayers>
    </core:MultiLayeredGraph>
  </core:multiLayeredGraph>
</core:IndoorFeatures>
