import {EditorSetup} from './setup.js';

var cursorMapper = {
  'line': EditorSetup.cursors.line,
  'dribble': EditorSetup.cursors.dotline,
  'ballpath': EditorSetup.cursors.dashline
}


var playersMapping = {

  'blackman3': 'player_black_to_left',
  'referee3': 'player_black_push_left',
  'blackman13': 'player_black_to_right',
  'blackman2': 'player_black_catch_left',
  'blackman5': 'player_black_walk_right',
  'referee1': 'player_black_face_back',
  'referee5': 'player_black_back_right',
  'blackman12': 'player_black_catch_right',
  'blackman4': 'player_black_walk_left',
  'referee4': 'player_black_push_right',
  'blackman20': 'player_black_back_left',
  'blackman1': 'player_black_fly_left',
  'referee2': 'player_black_face',
  'blackman7': 'player_black_run_left',
  'blackman11': 'player_black_fly_right',

  'redman1': 'player_red_to_left',
  'redman9': 'player_red_push_left',
  'redman5': 'player_red_to_right',
  'redlightblueBlock_L': 'player_red_catch_left',
  'redman2': 'player_red_walk_right',
  'redman10': 'player_red_face_back',
  'redman6': 'player_red_back_right',
  'redlightblueBlock_R': 'player_red_catch_right',
  'redman3': 'player_red_walk_left',
  'redman8': 'player_red_push_right',
  'redman7': 'player_red_back_left',
  'RedLightBlueDive_L': 'player_red_fly_left',
  'redman4': 'player_red_face',
  'redman7a': 'player_red_run_left',
  'RedLightBlueDive_R': 'player_red_fly_right',

  'yellowman3': 'player_yellow_to_left',
  'yellowman9': 'player_yellow_push_left',
  'yellowman5': 'player_yellow_to_right',
  'YellowlightblueBlock_L': 'player_yellow_catch_left',
  'yellowman2': 'player_yellow_walk_right',
  'yellowman10': 'player_yellow_face_back',
  'yellowman6': 'player_yellow_back_right',
  'YellowlightblueBlock_R': 'player_yellow_catch_right',
  'yellowman1': 'player_yellow_walk_left',
  'yellowman8': 'player_yellow_push_right',
  'yellowman7': 'player_yellow_back_left',
  'YellowLightBlueDive_L': 'player_yellow_fly_left',
  'yellowman4': 'player_yellow_face',
  'yellowman7a': 'player_yellow_run_left',
  'YellowLightBlueDive_R': 'player_yellow_fly_right',

  'greengoalie1': 'player_green_to_left',
  'greengoalie3': 'player_green_push_left',
  'greengoalie2': 'player_green_to_right',
  'greenman2': 'player_green_catch_left',
  'greenman5': 'player_green_walk_right',
  'greengoalie6': 'player_green_face_back',
  'greenman10': 'player_green_back_right',
  'greenman12': 'player_green_catch_right',
  'greenman4': 'player_green_walk_left',
  'greengoalie4': 'player_green_push_right',
  'greenman20': 'player_green_back_left',
  'greenman1': 'player_green_fly_left',
  'greengoalie5': 'player_green_face',
  'greenman7': 'player_green_run_left',
  'greenman11': 'player_green_fly_right',

  'whitegoalie1': 'player_white_to_left',
  'whitegoalie3': 'player_white_push_left',
  'whitegoalie2': 'player_white_to_right',
  'whiteman2': 'player_white_catch_left',
  'whiteman5': 'player_white_walk_right',
  'whitegoalie6': 'player_white_face_back',
  'whiteman10': 'player_white_back_right',
  'whiteman12': 'player_white_catch_right',
  'whiteman4': 'player_white_walk_left',
  'whitegoalie4': 'player_white_push_right',
  'whiteman20': 'player_white_back_left',
  'whiteman1': 'player_white_fly_left',
  'whitegoalie5': 'player_white_face',
  'whiteman7': 'player_white_run_left',
  'whiteman11': 'player_white_fly_right',
}


var colors = {
  "16777215" : {code: "#fff", label:"white"},
  "65280" : {code: "#22ee11", label:"green"},
  "16711680" : {code: "#ee2211", label:"red"},
  "0" : {code: "#000", label:"black"},
}

var posts = {
  'goal3dl2': 'post_side_right',
  'goal3dr2': 'post_side_left',
  'topgoal3': 'post_top_top',
  'topgoal4': 'post_top_bottom',
  'topgoal2': 'post_top_left',
  'topgoal1': 'post_top_right',
  'goakfront': 'post_face',
  'goalback': 'post_back',
}

var asserts = {

  'flagtall':'FlagYellow',
  'mcTallFlagOrange':'FlagRed',
  'flagshort':'FlagSmallYellow',
  'mcFlagShortOrange':'FlagSmallRed',
  'ladderH':'LadderWide',
  'vertladder':'LadderHigh',
  'mcLadderLeft':'LadderLeft',
  'mcLadderRight':'LadderRight',
  'mcHurdleOrange1':'HookRedUp',
  'mcHurdleOrange2':'HookRedLeft',
  'mcHurdleOrange3':'HookRedRight',
  'mc_PoleBlue':'StickBlue',
  'mc_PoleOrange':'StickRed',
  'mc_PoleLime':'StickGreen',
  'mc_PoleRed':'StickRed2',
  'mc_PoleYellow':'StickYellow',
  'soccerball':'Ball',
  'mcBallBag':'BallBag',
  'hurdle3':'HookYellowLeft',
  'hurdle1':'HookYellowUp',
  'hurdle2':'HookYellowRight',
  'mcHurdleConeBlueS':'CrossOrangeUp',
  'mcHurdleConeBlueL':'CrossOrangeRight',
  'mcHurdleConeBlueR':'CrossOrangeLeft',
  'mcHurdleConeYellowR':'CrossYellowRight',
  'mcHurdleConeYellowL':'CrossYellowLeft',
  'mcHurdleConeYellowS':'CrossYellowUp',
  'manikin2':'doll_left',
  'manikin3':'doll_face',
  'manikin1':'doll_right',
  'mcConeLowGreen':'ConeGreeen',
  'mcConeTopGreen':'DiskGreeen',
  'mcConeLowLime':'ConeGreeenLight',
  'mcConeTopLime':'DiskGreeenLight',
  'mcConeLowRed':'ConeRed',
  'mcConeTopRed':'DiskRed',
  'mcConeLowYellow':'ConeYellow',
  'mcConeTopYellow':'DiskYellow',
  'mcHurdleConeOrangeS':'CrossBlueUp',
  'mcHurdleConeOrangeL':'CrossBlueLeft',
  'mcHurdleConeOrangeR':'CrossBlueRight',
  'cone':'CapOrange',
  'mcConeBlue':'CapBlue',
  'mcConeGreen':'CapGreen',
  'mcConePurple':'CapVoilet',
  'mcConeRed':'CapRed',
  'mcConeYellow':'CapYellow',
}


var labels = {
  'zero': '0',
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',

  'letA': 'A',
  'LetB': 'B',
  'letC': 'C',
  'letD': 'D',
  'letE': 'E',
  'letF': 'F',
  'letG': 'G',
  'letH': 'H',
  'letI': 'I',
  'letJ': 'J',
  'letK': 'K',
  'letL': 'L',
  'letM': 'M',
  'letN': 'N',
  'letO': 'O',
  'letP': 'P',
  'letQ': 'Q',
  'letR': 'R',
  'letS': 'S',
  'letT': 'T',
  'letU': 'U',
  'letV': 'V',
  'letW': 'W',
  'letX': 'X',
  'letY': 'Y',
  'letZ': 'Z',
  'draggableTextbox': true
}


var ClientLabels = ['one', 'two', 'five', 'three', 'letA', 'LetB', 'letY'];
var ClientAsserts = ['mcConeYellow', 'mcConeLowRed', 'goakfront', 'mcConeTopRed', 'topgoal4', 'topgoal3']

var fieldMapping = {
  '1': 'birds_eyeview',
  '2': 'half_short_bleachers',
  '3': 'half_long_bleachers',
  '4': 'plain',
  '5': 'single_box_grid',
  '6': 'quad_box_grid',
  '7': 'cricle'
}

function importDatas(editor) {
  var ld = '<drill id="1439462775217" label="3v3 with Designated Zone Defender"><fieldData><highestID>34</highestID><backgroundFrame>5</backgroundFrame><messageString><setup>3%20teams%20of%203%20players%20on%2025%20yd%20long%2C%2030%20yd%20wide%20field%2E%20%205%20yd%20zone%20at%20each%20end%20of%20field%2E%20%202%20teams%20on%2C%201%20team%20off%2E%20%20Supply%20of%20balls%20with%20coach%2E%20%20Game%20re%2Dstarted%20each%20time%20with%20ball%20into%20defender%20in%20zone%2E</setup><instructions>Teams%20play%20for%20time%20or%20goal%20scored%2C%20then%20new%20team%20on%2E%20%20Defender%20plays%20un%2Dopposed%20in%20zone%2Dno%20other%20players%20allowed%20in%20zone%2E%20%20Red%20defender%20CANNOT%20defend%20shot%20from%20behind%20line%20from%20Green%20attacker%20%28vice%20versa%29</instructions><coach>Progression%3A%20Red%20defender%20can%20defend%20shot%20from%20behind%20line%20from%20Green%20attacker%20%28vice%20versa%29</coach></messageString><allPlayers><player text="" highlighter="false" width="44.6" height="28.85" xscale="100" yscale="100" y="396.4" x="355.4" uniqueID="0" typeID="topgoal4" /><player text="" highlighter="false" width="44.6" height="28.85" xscale="100" yscale="100" y="395.4" x="626.4" uniqueID="1" typeID="topgoal4" /><player text="" highlighter="false" width="44.75" height="26.95" xscale="100" yscale="100" y="63.05" x="381.7" uniqueID="2" typeID="topgoal3" /><player text="" highlighter="false" width="44.75" height="26.95" xscale="100" yscale="100" y="65.05" x="589.7" uniqueID="3" typeID="topgoal3" /><player SSy4="50.3" SSx4="-3" SSy3="51.3" SSx3="343.2" SSy2="-1" SSx2="333.9" SSy1="0" SSx1="0" text="" highlighter="false" width="357.65" height="63.2" xscale="100" yscale="100" y="89.75" x="342.1" uniqueID="4" typeID="shadedSquare" /><player SSy4="80.3" SSx4="0" SSy3="80.3" SSx3="403.2" SSy2="25" SSx2="393.9" SSy1="27" SSx1="5" text="" highlighter="false" width="414.65" height="66.2" xscale="100" yscale="100" y="308.75" x="311.1" uniqueID="6" typeID="shadedSquare" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="331.35" x="488.1" uniqueID="7" typeID="greenman10" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="237.35" x="385.1" uniqueID="13" typeID="greenman10" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="226.1" x="595.75" uniqueID="14" typeID="greenman20" /><player text="" highlighter="false" width="25.4" height="33.35" xscale="100" yscale="100" y="98.75" x="533.95" uniqueID="15" typeID="redman1" /><player text="" highlighter="false" width="27.7" height="33.25" xscale="100" yscale="100" y="184.35" x="622.85" uniqueID="19" typeID="redman3" /><player text="" highlighter="false" width="28.6" height="32.25" xscale="100" yscale="100" y="195.05" x="395.1" uniqueID="20" typeID="redman5" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="118.95" x="521.15" uniqueID="21" typeID="soccerball" /><player text="" highlighter="true" width="29.6" height="35.8" xscale="100" yscale="100" y="163.7" x="688.05" uniqueID="22" typeID="referee3" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="194.95" x="692.15" uniqueID="23" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="194.95" x="707.15" uniqueID="24" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="204.95" x="698.15" uniqueID="25" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="200.95" x="720.15" uniqueID="26" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="209.95" x="710.15" uniqueID="27" typeID="soccerball" /><player text="" highlighter="false" width="31.6" height="35.95" xscale="100" yscale="100" y="172.55" x="283.3" uniqueID="28" typeID="yellowman8" /><player text="" highlighter="false" width="31.6" height="35.95" xscale="100" yscale="100" y="195.55" x="286.3" uniqueID="29" typeID="yellowman8" /><player text="" highlighter="false" width="31.6" height="35.95" xscale="100" yscale="100" y="193.55" x="270.3" uniqueID="30" typeID="yellowman8" /></allPlayers><allLines><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="65280" uniqueID="10" typeID="line"><locs><loc y="404" x="768" /><loc y="220" x="746" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="16711680" uniqueID="12" typeID="line"><locs><loc y="189" x="762" /><loc y="342" x="781" /></locs></line><line y="-81" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="16777215" uniqueID="16" typeID="dribble"><locs><loc y="228" x="377" /><loc y="229" x="722" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="16777215" uniqueID="18" typeID="dribble"><locs><loc y="410" x="357" /><loc y="409" x="743" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="0" uniqueID="33" typeID="ballpath"><locs><loc y="224" x="549" /><loc y="277" x="475" /></locs></line></allLines></fieldData></drill>';
  // var ld = '<drill id="1447249687294" label="Erik Imler 1"><fieldData><highestID>42</highestID><backgroundFrame>5</backgroundFrame><messageString><setup>15X15%20yard%20grid%2E%20Split%20your%20group%20into%20four%20teams%2E%20Each%20team%20starts%20in%20the%20corners%20of%20the%20playing%20area%20and%20all%20the%20balls%20are%20placed%20in%20the%20middle%20as%20shown%2E</setup><instructions>On%20%22go%22%20first%20player%20in%20each%20group%20must%20sprint%20to%20the%20middle%20of%20the%20grid%2C%20grab%20a%20ball%20with%20his%2Fher%20hands%20and%20return%20to%20their%20teams%20corner%2E%20Next%20player%20runs%20and%20grabs%20a%20ball%20from%20the%20middle%20or%20from%20any%20other%20corner%2E%20Players%20must%20return%20the%20ball%20to%20their%20own%20corner%20and%20players%20cannot%20guard%20the%20balls%2E%20Play%20for%2090%20seconds%2C%20the%20team%20that%20finishes%20with%20the%20most%20balls%20in%20their%20corner%20wins%20the%20game%2E</instructions><coach>Vision%20and%20communication%2E%20Progression%3A%20must%20use%20feet%20only%2C%20must%20use%20non%20dominant%20foot%20only%2E</coach></messageString><allPlayers><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="81.3" x="334.15" uniqueID="0" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="383.3" x="301.15" uniqueID="1" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="384.3" x="705.15" uniqueID="2" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="80.3" x="671.15" uniqueID="3" typeID="mcConeYellow" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="48.15" x="297.55" uniqueID="4" typeID="whitegoalie2" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="80.15" x="295.55" uniqueID="5" typeID="whitegoalie2" /><player text="" highlighter="false" width="28.2" height="35.35" xscale="100" yscale="100" y="54.5" x="337.75" uniqueID="6" typeID="whiteman5" /><player text="" highlighter="false" width="36.9" height="36.65" xscale="100" yscale="100" y="365.05" x="263" uniqueID="7" typeID="redman6" /><player text="" highlighter="false" width="36.9" height="36.65" xscale="100" yscale="100" y="394.05" x="258" uniqueID="9" typeID="redman6" /><player text="" highlighter="false" width="36.9" height="36.65" xscale="100" yscale="100" y="387.05" x="283" uniqueID="10" typeID="redman6" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="386.1" x="674.75" uniqueID="11" typeID="greenman20" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="385.1" x="698.75" uniqueID="12" typeID="greenman20" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="363.1" x="714.75" uniqueID="13" typeID="greenman20" /><player text="" highlighter="false" width="25.4" height="32.35" xscale="100" yscale="100" y="79.25" x="688.95" uniqueID="14" typeID="yellowman1" /><player text="" highlighter="false" width="25.4" height="32.35" xscale="100" yscale="100" y="45.25" x="675.95" uniqueID="15" typeID="yellowman1" /><player text="" highlighter="false" width="25.4" height="32.35" xscale="100" yscale="100" y="51.25" x="658.95" uniqueID="16" typeID="yellowman1" /><player text="" highlighter="false" width="10.05" height="8.6" xscale="100" yscale="100" y="199.05" x="468.35" uniqueID="17" typeID="mcConeLowRed" /><player text="" highlighter="false" width="10.05" height="8.6" xscale="100" yscale="100" y="270.05" x="468.35" uniqueID="18" typeID="mcConeLowRed" /><player text="" highlighter="false" width="10.05" height="8.6" xscale="100" yscale="100" y="271.05" x="557.35" uniqueID="19" typeID="mcConeLowRed" /><player text="" highlighter="false" width="10.05" height="8.6" xscale="100" yscale="100" y="200.05" x="554.35" uniqueID="20" typeID="mcConeLowRed" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="233.95" x="485.15" uniqueID="21" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="216.95" x="490.15" uniqueID="22" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="248.95" x="507.15" uniqueID="23" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="227.95" x="509.15" uniqueID="24" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="251.95" x="485.15" uniqueID="25" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="262.95" x="500.15" uniqueID="26" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="260.95" x="522.15" uniqueID="27" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="210.95" x="474.15" uniqueID="28" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="251.95" x="541.15" uniqueID="29" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="237.95" x="525.15" uniqueID="30" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="232.95" x="541.15" uniqueID="31" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="202.95" x="499.15" uniqueID="32" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="212.95" x="541.15" uniqueID="33" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="216.95" x="520.15" uniqueID="34" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="201.95" x="523.15" uniqueID="35" typeID="soccerball" /><player text="" highlighter="false" width="29.95" height="21.65" xscale="100" yscale="100" y="211.55" x="276.05" uniqueID="36" typeID="one" /><player text="" highlighter="false" width="30.3" height="23" xscale="100" yscale="100" y="210.6" x="285.95" uniqueID="37" typeID="five" /><player text="" highlighter="false" width="28.9" height="22.75" xscale="100" yscale="100" y="211.05" x="302.25" uniqueID="38" typeID="letY" /><player text="" highlighter="false" width="29.95" height="21.65" xscale="100" yscale="100" y="53.55" x="497.05" uniqueID="39" typeID="one" /><player text="" highlighter="false" width="30.3" height="23" xscale="100" yscale="100" y="52.6" x="506.95" uniqueID="40" typeID="five" /><player text="" highlighter="false" width="28.9" height="22.75" xscale="100" yscale="100" y="52.05" x="521.25" uniqueID="41" typeID="letY" /></allPlayers><allLines /></fieldData></drill>';
  // var ld = '<drill id="1439461573148" label="Lay Off and Shoot 1"><fieldData><highestID>45</highestID><backgroundFrame>5</backgroundFrame><messageString><setup>Split%20group%20evenly%20at%20each%20cone%2E%20%20Supply%20of%20balls%20at%20line%20A%2E</setup><instructions>Red%20player%20A%20passes%20ball%20to%20Red%20player%20B%2E%20%20Red%20B%20lays%20ball%20back%20over%20shooting%20line%20for%20Red%20player%20A%20to%20run%20on%20to%20and%20shoot%2E%20%20%20Repeat%20other%20side%20with%20yellow%20players%2E</instructions><coach>Player%20B%20must%20retrieve%20shot%20and%20move%20to%20line%20A%20with%20ball%2E%20%20Player%20A%20moves%20to%20line%20B%2E%20Rotate%20GK%20every%20round%2E%20%20Make%20it%20a%20competition%20between%20teams%2E%20%20Progression%3A%20competition%20between%20shooters%20and%20GK%2Dwho%20can%20make%20more%20saves%20vs%2E%20who%20can%20score%20more%20goals%3F%0D</coach></messageString><allPlayers><player text="" highlighter="false" width="76.25" height="39.65" xscale="100" yscale="100" y="52.25" x="472.05" uniqueID="0" typeID="goakfront" /><player text="" highlighter="false" width="9.6" height="18.75" xscale="100" yscale="100" y="388.5" x="613.4" uniqueID="1" typeID="mcConeTopRed" /><player text="" highlighter="false" width="9.6" height="18.75" xscale="100" yscale="100" y="389.5" x="402.4" uniqueID="2" typeID="mcConeTopRed" /><player text="" highlighter="false" width="9.6" height="18.75" xscale="100" yscale="100" y="83.5" x="413.4" uniqueID="3" typeID="mcConeTopRed" /><player text="" highlighter="false" width="9.6" height="18.75" xscale="100" yscale="100" y="84.5" x="598.4" uniqueID="4" typeID="mcConeTopRed" /><player text="" highlighter="false" width="35.75" height="36.65" xscale="100" yscale="100" y="350.05" x="375.6" uniqueID="5" typeID="yellowman6" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="69.8" x="391.45" uniqueID="6" typeID="yellowman5" /><player text="" highlighter="false" width="28.8" height="33.45" xscale="100" yscale="100" y="79.45" x="503.1" uniqueID="7" typeID="whitegoalie5" /><player text="" highlighter="false" width="39.5" height="36.6" xscale="100" yscale="100" y="382.3" x="347.3" uniqueID="8" typeID="yellowman10" /><player text="" highlighter="false" width="39.5" height="36.6" xscale="100" yscale="100" y="396.3" x="357.3" uniqueID="9" typeID="yellowman10" /><player text="" highlighter="false" width="28.8" height="33.25" xscale="100" yscale="100" y="48.55" x="384.85" uniqueID="10" typeID="yellowman4" /><player text="" highlighter="false" width="28.8" height="33.25" xscale="100" yscale="100" y="53.55" x="601.75" uniqueID="12" typeID="redman4" /><player text="" highlighter="false" width="32.9" height="36.1" xscale="100" yscale="100" y="194.05" x="541.65" uniqueID="14" typeID="redman7" /><player text="" highlighter="false" width="36.1" height="36.25" xscale="100" yscale="100" y="379.5" x="617.7" uniqueID="15" typeID="redman10" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="359.95" x="407.15" uniqueID="18" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="405.95" x="407.15" uniqueID="19" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="396.95" x="418.15" uniqueID="20" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="409.95" x="420.15" uniqueID="21" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="365.95" x="639.15" uniqueID="22" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="395.95" x="593.15" uniqueID="23" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="402.95" x="601.15" uniqueID="24" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="403.95" x="617.15" uniqueID="25" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="414.95" x="610.15" uniqueID="26" typeID="soccerball" /><player text="" highlighter="false" width="25.4" height="33.35" xscale="100" yscale="100" y="102.75" x="609.95" uniqueID="29" typeID="redman1" /><player text="" highlighter="false" width="29.95" height="21.65" xscale="100" yscale="100" y="233.55" x="640.05" uniqueID="33" typeID="one" /><player text="" highlighter="false" width="30.2" height="21.4" xscale="100" yscale="100" y="155.8" x="597.5" uniqueID="34" typeID="two" /><player text="" highlighter="false" width="31.3" height="22.9" xscale="100" yscale="100" y="133" x="535.4" uniqueID="36" typeID="three" /><player text="" highlighter="false" width="30.6" height="21.65" xscale="100" yscale="100" y="404.55" x="666" uniqueID="37" typeID="letA" /><player text="" highlighter="false" width="29.7" height="22.75" xscale="100" yscale="100" y="63.6" x="645.95" uniqueID="38" typeID="LetB" /><player text="" highlighter="false" width="30.6" height="21.65" xscale="100" yscale="100" y="402.55" x="332" uniqueID="39" typeID="letA" /><player text="" highlighter="false" width="29.7" height="22.75" xscale="100" yscale="100" y="64.6" x="356.95" uniqueID="40" typeID="LetB" /><player SSy4="99.3" SSx4="-14" SSy3="99.3" SSx3="345.2" SSy2="-1" SSx2="334.9" SSy1="0" SSx1="0" text="" highlighter="false" width="370.65" height="111.2" xscale="100" yscale="100" y="85.75" x="337.1" uniqueID="41" typeID="shadedSquare" /><player text="" highlighter="false" width="30.2" height="21.4" xscale="100" yscale="100" y="175.8" x="706.5" uniqueID="42" typeID="two" /><player text="" highlighter="false" width="30.3" height="23" xscale="100" yscale="100" y="174.6" x="715.95" uniqueID="43" typeID="five" /><player text="" highlighter="false" width="28.9" height="22.75" xscale="100" yscale="100" y="175.05" x="732.25" uniqueID="44" typeID="letY" /></allPlayers><allLines><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="16777215" uniqueID="17" typeID="dribble"><locs><loc y="263" x="372" /><loc y="263" x="725" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="0" uniqueID="28" typeID="ballpath"><locs><loc y="424" x="681" /><loc y="213" x="669" /></locs></line><line y="-69" x="-25" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="65280" uniqueID="30" typeID="line"><locs><loc y="164" x="663" /><loc y="182" x="665" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="0" uniqueID="31" typeID="ballpath"><locs><loc y="213" x="651" /><loc y="271" x="615" /></locs></line><line y="-69" x="-53" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="65280" uniqueID="32" typeID="line"><locs><loc y="422" x="666" /><loc y="308" x="627" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="true" color="0" uniqueID="35" typeID="ballpath"><locs><loc y="266" x="595" /><loc y="186" x="537" /></locs></line></allLines></fieldData></drill>';
  // var ld = '<drill id="1439403533668" label="Rondo"><fieldData><highestID>106</highestID><backgroundFrame>4</backgroundFrame><messageString><setup>4V1%20and%208V1%20possession%2E%20Plenty%20of%20balls%20on%20perimeter%2E</setup><instructions>Progression%3A%20limit%20touches%0DProgression%3A%20add%20another%20defender</instructions><coach>10%20passes%2Ddefender%20stays%20in%20middle%0DNutmegs%2Ddefender%20stays%20in%20middle</coach></messageString><allPlayers><player SSy4="143.3" SSx4="3" SSy3="144.3" SSx3="162.2" SSy2="0" SSx2="160.9" SSy1="0" SSx1="0" text="" highlighter="false" width="173.65" height="155.2" xscale="100" yscale="100" y="58.75" x="302.1" uniqueID="4" typeID="shadedSquare" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="52.3" x="300.15" uniqueID="5" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="195.3" x="303.15" uniqueID="6" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="195.3" x="461.15" uniqueID="7" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="51.3" x="460.15" uniqueID="8" typeID="mcConeYellow" /><player SSy4="138.3" SSx4="1" SSy3="141.3" SSx3="156.2" SSy2="0" SSx2="157.9" SSy1="0" SSx1="0" text="" highlighter="false" width="169.35" height="152.2" xscale="100" yscale="100" y="63.75" x="526.1" uniqueID="9" typeID="shadedSquare" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="199.3" x="521.15" uniqueID="10" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="199.3" x="676.15" uniqueID="11" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="52.3" x="519.15" uniqueID="12" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="52.3" x="675.15" uniqueID="13" typeID="mcConeYellow" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="33.15" x="355.55" uniqueID="14" typeID="greengoalie2" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="179.35" x="365.1" uniqueID="15" typeID="greenman10" /><player text="" highlighter="false" width="25.35" height="32.15" xscale="100" yscale="100" y="104.1" x="454.65" uniqueID="16" typeID="greengoalie1" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="108.1" x="286.55" uniqueID="17" typeID="greengoalie2" /><player text="" highlighter="false" width="36.9" height="36.65" xscale="100" yscale="100" y="97.05" x="358" uniqueID="18" typeID="redman6" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="55.95" x="379.15" uniqueID="19" typeID="soccerball" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="34.15" x="574.55" uniqueID="20" typeID="greengoalie2" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="180.35" x="573.1" uniqueID="21" typeID="greenman10" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="105.1" x="506.55" uniqueID="22" typeID="greengoalie2" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="98.1" x="664.75" uniqueID="23" typeID="greenman20" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="131.95" x="526.15" uniqueID="24" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="220.95" x="511.15" uniqueID="25" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="223.95" x="519.15" uniqueID="26" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="214.95" x="520.15" uniqueID="27" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="222.95" x="526.15" uniqueID="28" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="214.95" x="511.15" uniqueID="29" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="210.95" x="318.15" uniqueID="30" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="209.95" x="306.15" uniqueID="31" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="218.95" x="306.15" uniqueID="32" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="217.95" x="314.15" uniqueID="33" typeID="soccerball" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="225.95" x="326.15" uniqueID="34" typeID="soccerball" /><player text="" highlighter="false" width="29.6" height="35.65" xscale="100" yscale="100" y="102.8" x="573.6" uniqueID="35" typeID="redman9" /><player SSy4="158.3" SSx4="2" SSy3="158.3" SSx3="230.2" SSy2="2" SSx2="229.9" SSy1="0" SSx1="0" text="" highlighter="false" width="241.65" height="169.2" xscale="100" yscale="100" y="256.75" x="388.1" uniqueID="38" typeID="shadedSquare" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="251.3" x="384.15" uniqueID="39" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="407.3" x="390.15" uniqueID="40" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="251.3" x="613.15" uniqueID="41" typeID="mcConeYellow" /><player text="" highlighter="false" width="13.75" height="15.45" xscale="100" yscale="100" y="409.3" x="616.15" uniqueID="42" typeID="mcConeYellow" /><player text="" highlighter="false" width="30.6" height="21.65" xscale="100" yscale="100" y="412.55" x="332" uniqueID="43" typeID="letA" /><player text="" highlighter="false" width="29.7" height="22.75" xscale="100" yscale="100" y="200.6" x="280.95" uniqueID="44" typeID="LetB" /><player text="" highlighter="false" width="29.7" height="22.75" xscale="100" yscale="100" y="207.6" x="697.9" uniqueID="45" typeID="LetB" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="236.15" x="424.55" uniqueID="46" typeID="greengoalie2" /><player text="" highlighter="false" width="25.35" height="32.15" xscale="100" yscale="100" y="233.15" x="540.65" uniqueID="47" typeID="greengoalie1" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="385.35" x="425.1" uniqueID="48" typeID="greenman10" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="381.1" x="534.75" uniqueID="49" typeID="greenman20" /><player text="" highlighter="false" width="28.9" height="32" xscale="100" yscale="100" y="284.15" x="371.55" uniqueID="50" typeID="greengoalie2" /><player text="" highlighter="false" width="38.8" height="38" xscale="100" yscale="100" y="342.35" x="366.1" uniqueID="51" typeID="greenman10" /><player text="" highlighter="false" width="32.9" height="36.75" xscale="100" yscale="100" y="276.25" x="603.75" uniqueID="52" typeID="greengoalie3" /><player text="" highlighter="false" width="36.45" height="38" xscale="100" yscale="100" y="344.1" x="596.75" uniqueID="53" typeID="greenman20" /><player text="" highlighter="false" width="28.6" height="32.25" xscale="100" yscale="100" y="345.05" x="493.1" uniqueID="54" typeID="redman5" /><player text="" highlighter="false" width="13.15" height="13.15" xscale="100" yscale="100" y="399.95" x="536.15" uniqueID="55" typeID="soccerball" /></allPlayers><allLines /></fieldData></drill>';
  // var ld = '<drill id="1453460193425" label="Lines and text"><fieldData><highestID>12</highestID><backgroundFrame>1</backgroundFrame><messageString><setup>Type%20Setup%20Here%2E%2E%2E</setup><instructions>Type%20Instructions%20Here%2E%2E%2E</instructions><coach>Type%20Coaching%20Points%20Here%2E%2E%2E</coach></messageString><allPlayers><player text="" highlighter="false" width="29.95" height="21.65" xscale="100" yscale="100" y="226.55" x="430.05" uniqueID="5" typeID="one" /><player text="" highlighter="false" width="30.2" height="21.4" xscale="100" yscale="100" y="129.8" x="439.5" uniqueID="6" typeID="two" /><player text="" highlighter="false" width="31.3" height="22.9" xscale="100" yscale="100" y="158" x="692.4" uniqueID="7" typeID="three" /><player text="" highlighter="false" width="30.3" height="21.8" xscale="100" yscale="100" y="203.45" x="368.75" uniqueID="8" typeID="four" /><player text="" highlighter="false" width="30.3" height="23" xscale="100" yscale="100" y="343.6" x="572.95" uniqueID="9" typeID="five" /><player text="Text box of data then new Line" highlighter="false" width="144.35" height="96.3" xscale="100" yscale="100" y="81.45" x="524.85" uniqueID="11" typeID="draggableTextbox" /></allPlayers><allLines><line y="-72" x="-37" thickness="2" gDrawStart="undefined" gDoubleArrowHead="false" arrowHeads="false" color="0" uniqueID="0" typeID="pen"><locs><loc y="258" x="528" /><loc y="262" x="517" /><loc y="267" x="506" /><loc y="281" x="492" /><loc y="291" x="478" /><loc y="304" x="468" /><loc y="318" x="464" /><loc y="328" x="462" /><loc y="340" x="461" /><loc y="352" x="461" /><loc y="376" x="462" /><loc y="390" x="474" /><loc y="405" x="507" /><loc y="408" x="518" /><loc y="410" x="531" /><loc y="413" x="545" /><loc y="415" x="555" /><loc y="414" x="569" /><loc y="413" x="581" /><loc y="408" x="594" /><loc y="403" x="604" /><loc y="395" x="614" /><loc y="381" x="625" /><loc y="366" x="629" /><loc y="355" x="630" /><loc y="337" x="632" /><loc y="310" x="633" /><loc y="292" x="633" /><loc y="278" x="624" /><loc y="268" x="617" /><loc y="261" x="604" /><loc y="260" x="592" /><loc y="260" x="580" /><loc y="260" x="570" /><loc y="257" x="558" /><loc y="255" x="548" /><loc y="255" x="536" /><loc y="259" x="526" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="65280" uniqueID="1" typeID="line"><locs><loc y="226" x="432" /><loc y="226" x="665" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="65280" uniqueID="2" typeID="curve"><locs><loc y="225" x="666" /><loc y="460" x="773" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="0" uniqueID="3" typeID="ballpath"><locs><loc y="226" x="431" /><loc y="461" x="430" /></locs></line><line y="-72" x="-37" thickness="2" gDrawStart="false" gDoubleArrowHead="false" arrowHeads="false" color="16711680" uniqueID="4" typeID="dribble"><locs><loc y="440" x="428" /><loc y="440" x="778" /></locs></line></allLines></fieldData></drill>';

  return importDrill(editor, ld);
}

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function processLineElements(editor, line){
  var arrowHeads = $(line).attr('arrowHeads');
  var thickness = $(line).attr('thickness');

  var color = colors[$(line).attr('color')]
  if(!color){
    color = colors["0"];
  }
  if(parseInt(thickness) > 3){
    editor.activeDrawThickness = {'width': 4}
  }
  else{
    editor.activeDrawThickness = {'width': 2}
  }
  
  var pt = $($($(line).children()[0]).children()[0]);
  var x1 = parseFloat(pt.attr('x'))- 261;
  var y1 = parseFloat(pt.attr('y'))- 93;

  var pt = $($($(line).children()[0]).children()[1]);
  var x2 = (parseFloat(pt.attr('x')) - 261) - x1;
  var y2 = (parseFloat(pt.attr('y')) - 93) - y1;


  var points = [ [x2, y2] ];
  if($(line).attr('typeID') == 'line'){
    editor.setActiveCursor(EditorSetup.cursors.line);
  }
  else if($(line).attr('typeID') == 'dribble'){
    editor.setActiveCursor(EditorSetup.cursors.dotline);
  }
  else if($(line).attr('typeID') == 'ballpath'){
    editor.setActiveCursor(EditorSetup.cursors.dashline);
  }
  else if($(line).attr('typeID') == 'curve'){
    editor.setActiveCursor(EditorSetup.cursors.curve);
  }
  else if($(line).attr('typeID') == 'pen'){
    //Not Tested
    var childrens = $($(line).children()[0]).children()
    for (var i = 2; i < childrens.length; i++) {
      var pt = childrens[i]
      var x = (parseFloat($(pt).attr('x')) - 261 - x1);
      var y = (parseFloat($(pt).attr('y')) - 93 - y1);
      points.push([x, y]);
    };
    editor.setActiveCursor(EditorSetup.cursors.pen);
  }
  else{
    console.log("Line Missing");
  }

  if(arrowHeads == 'true'){
    editor.activeArrowHead = 'head';
  }
  else{
    editor.activeArrowHead = 'none';
  }

  editor.activeDrawColor = color;
  editor.activeCursor.handler.draw(editor, editor.s, x1, y1, points);
}


function processPlayerElement(editor, player){
    
  if($(player).attr('typeID') == 'shadedSquare'){
    var x = parseFloat($(player).attr('x')) - 224;
    var y = parseFloat($(player).attr('y')) - 22 + 10;
    var x1 = parseFloat($(player).attr('SSx1'));
    var y1 = parseFloat($(player).attr('SSy1'));
    var x2 = parseFloat($(player).attr('SSx2'));
    var y2 = parseFloat($(player).attr('SSy2'));
    var x3 = parseFloat($(player).attr('SSx3'));
    var y3 = parseFloat($(player).attr('SSy3'));
    var x4 = parseFloat($(player).attr('SSx4'));
    var y4 = parseFloat($(player).attr('SSy4'));
    editor.setActiveCursor(EditorSetup.cursors.shape);
    var ele = editor.activeCursor.handler.draw(editor, editor.s, x, y,
    [ [x3, y3]]
    );
    editor.activeCursor.handler.activeMainElement.attr('points', `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`);
  } 
  else if(labels[$(player).attr('typeID')]){
    var x = parseFloat($(player).attr('x')) - 224 + 5;
    var y = parseFloat($(player).attr('y'));
    if($(player).attr('typeID') == 'draggableTextbox'){
      var letter = $(player).attr('text');
      editor.chooseLabelHandler('letter_Text Box', letter);
    }
    else{
      var letter = labels[$(player).attr('typeID')];
      editor.chooseLabelHandler('letter_' + letter, letter);
    }
    editor.activeCursor.handler.draw(editor, editor.s, x, y);
  }
  else if(posts[$(player).attr('typeID')]){
    var x = parseFloat($(player).attr('x')) - 224;
    var y = parseFloat($(player).attr('y')) - 22;
    var cursorKey = posts[$(player).attr('typeID')]
    
    if(cursorKey == 'post_face' || cursorKey == 'post_back'){
      y -= 5;
    }
    editor.chooseAssertHandler('post_' + cursorKey);
    editor.activeCursor.handler.draw(editor, editor.s, x, y);
  }
  else if(asserts[$(player).attr('typeID')]){
    var width = parseFloat($(player).attr('width'));
    var height = parseFloat($(player).attr('height'));
    var x = parseFloat($(player).attr('x')) - 224;
    var y = parseFloat($(player).attr('y')) - 22;
    if($(player).attr('typeID') == 'soccerball'){
      y += 5;
    }
    
    var cursorKey = asserts[$(player).attr('typeID')]
    editor.chooseAssertHandler('assert_' + cursorKey);
    editor.activeCursor.handler.draw(editor, editor.s, x, y);
  }
  else{
    var x = parseFloat($(player).attr('x')) - 224 + 12 + 10;
    var y = parseFloat($(player).attr('y')) - 22 + 17 + 10;

    var x = parseFloat($(player).attr('x')) - 224 + 12 -2;
    var y = parseFloat($(player).attr('y')) - 22 + 17 - 8;

    var x = parseFloat($(player).attr('x')) - 224 + 20 - 5;
    var y = parseFloat($(player).attr('y')) - 22 + 20 - 5;

    // y = y - (y*(10/450));
    y = y + y*(12/450);


    var cursorKey = playersMapping[$(player).attr('typeID')]
    if(!cursorKey){
      console.log("Player Missing", $(player).attr('typeID'));
    }
    editor.chooseAssertHandler(cursorKey);
    editor.onClick({clientX: x, clientY: y});


    if($(player).attr('highlighter') && $(player).attr('highlighter') == "true"){
      editor.activeCursor.handler.disableAnimation = true
      editor.activeCursor.handler.createHighligher(editor, editor.s, editor.activeCursor.handler.activeElement, 30, 35);
      editor.activeCursor.handler.disableAnimation = false;
    }
  }
}

function importDrill(editor, drillData) {

  var elements = [];

  var drill = {};

  var ld = $(drillData);
  drill.name = ld.attr('label');
  
  if(ld.find('setup').length > 0){
    drill.setupText = decodeURIComponent(ld.find('setup').html())
  }
  if(ld.find('instructions').length > 0){
    drill.instructText = decodeURIComponent(ld.find('instructions').html())
  }
  if(ld.find('coach').length > 0){
    drill.coachText = decodeURIComponent(ld.find('coach').html())
  }
  var backgroundFrame = ld.find('backgroundFrame').html();
  if(!fieldMapping[backgroundFrame]){
    console.log("Field Miss Matching");
  }

  editor.activeField = editor.fields[fieldMapping[backgroundFrame] || 'birds_eyeview'];
  // editor.updateField();
  editor.clear();
  

  var players = ld.find('player');
  for (var ij = players.length - 1; ij >= 0; ij--) {
    var player = players[ij];
    var uniqueID = 0;
    if($(player).attr('uniqueID') != 'undefined'){
      var uniqueID = parseInt($(player).attr('uniqueID'))
    }

    if($(player).attr('typeID') != 'undefined'){
      elements.push({"type": "player", "uniqueID": uniqueID, "ele": player});
    }
    
  };

  var linesData = ld.find('line');
  for (var jk = linesData.length - 1; jk >= 0; jk--) {
    var line = linesData[jk];
    var uniqueID = 0;
    if($(line).attr('uniqueID') != 'undefined'){
      var uniqueID = parseInt($(line).attr('uniqueID'))
    }
    if($(line).attr('typeID') != 'undefined'){
      elements.push({"type": "line", "uniqueID": uniqueID, "ele": line});
    }
  };

  elements.sort(function(a, b){
   return b.uniqueID-a.uniqueID
  })

  for (var i = elements.length - 1; i >= 0; i--) {
    var item = elements[i];
    if(item.type == 'player'){
      processPlayerElement(editor, item.ele);
      // item.eleObj = editor.activeCursor.handler.activeElement;
    }else if(item.type == 'line'){
      processLineElements(editor, item.ele);
    }
  };

  return drill;
}

function importSession(sessionData){
  var sessionObj = $(sessionData);

  var session = {};
  session.name = sessionObj.attr('label');
  session.drills = [];
  var drills = sessionObj.find('drill');
  for (var i = 0; i < drills.length; i++) {
    var drill = drills[i];
    session.drills.push($(drill).attr('filename'));
  }

  return session;
}


export var importDatas;
export var importDrill;
export var importSession;

