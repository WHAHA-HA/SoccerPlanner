import * as Draw from './draw.js';


class DrillField {
  constructor(key, name, perspectiveScale=false, width=585, height=455){
    this.key = key;
    this.name = name;
    this.imgUrl = `/imgs/graphics/fields/field_${this.key}.jpg`;
    this.perspectiveScale = perspectiveScale;
    this.width = width;
    this.height = height;
  }

  url(){
    return EditorSetup.assertSVGUrl('field_' + this.key);
  }

}

class Assert {
  constructor(type, group, scaleRatio=(.2838), width=null, height=null, perspectiveScale=false, perspectiveFields=null){
    this.type = type;
    this.group = group;
    this.width = width;
    this.height = height;
    this.perspectiveScale = perspectiveScale;
    this.scaleRatio = scaleRatio;
    this.perspectiveFields = perspectiveFields;
  }
}

class DrawCursor {
  constructor(key, name, handlerCls, order=99, defaultColorIndex=null, defaultArrowHeadIndex=0, hasArrowHead=false){
    this.key = key;
    this.name = name;
    this.handler = new handlerCls();
    this.order = order;
    this.defaultColorIndex = defaultColorIndex;
    this.hasArrowHead = hasArrowHead;
    this.defaultArrowHeadIndex = defaultArrowHeadIndex;
  }
}

class EquipIcon{
  constructor(key, x, y, width, height, scaleX=null, scaleY=null, perspectiveScale=false){
    this.key = key;
    this.left = x + 'px';
    this.top = y + 'px';
    this.width = width + 'px';
    this.height = height + 'px';
    this.scaleX = scaleX || 0.3;
    this.scaleY = scaleY || 0.3;
    this.perspectiveScale = perspectiveScale;

    this.style = {left:this.left, top:this.top, width:this.width, height:this.height};
    this.html = `<div class="hack-holder"></div><svg><use xlink:href="#spsvg_${this.key}" transform="matrix(${this.scaleX},0,0,${this.scaleY},0,0)"/></svg>`;
  }
}

export var EditorSetup = {

  fields: {
    birds_eyeview: new DrillField('birds_eyeview', 'Birds Eye View'),
    cricle: new DrillField('cricle', 'Cricle'),
    half_long_bleachers: new DrillField('half_long_bleachers', 'Half Long Bleachers', true),
    half_short_bleachers: new DrillField('half_short_bleachers', 'Half Short Bleachers', true),
    quad_box_grid: new DrillField('quad_box_grid', 'Quad Box Grid'),
    single_box_grid: new DrillField('single_box_grid', 'Single Box Grid'),
    plain: new DrillField('plain', 'Field Plain'),
    full_long_bleachers: new DrillField('full_long_bleachers', 'Full Long Bleachers', true),
    birds_eyeview_stright: new DrillField('birds_eyeview_stright', 'Birds Eyeview Stright', false, 455, 585),
  },

  cursors: {

    select: new DrawCursor('select', 'Select & Drag', Draw.SelectDrawHandler, 0),

    pen: new DrawCursor('pen','Pen', Draw.PenDrawHandler, 1, 3, 0, true),
    line: new DrawCursor('line', 'Player Path', Draw.LineDrawHandler, 2, 1, 0, true),
    curve: new DrawCursor('curve', 'Player Path', Draw.CurveDrawHandler, 3, 1, 0, true),
    dashline: new DrawCursor('dashline', 'Ball Path', Draw.DashedLineDrawHandler, 4, 3, 0, true),
    dotline: new DrawCursor('dotline', 'Dribble', Draw.DottedLineDrawHandler, 5, 2, 0, true),

    highlight: new DrawCursor('highlight', 'Highlight', Draw.HighlightDrawHandler, 6),
    assert: new DrawCursor('assert', 'Assert', Draw.AssertDrawHandler),
    stuff: new DrawCursor('assert', 'Assert', Draw.StuffDrawHandler),
    label: new DrawCursor('label', 'Label', Draw.LabelDrawHandler),
    triangle: new DrawCursor('triangle', 'Triangle', Draw.TriangleDrawHandler),
    rect: new DrawCursor('rect', 'Rectangle', Draw.RectDrawHandler),
    text: new DrawCursor('text', 'Text', Draw.LabelDrawHandler),
    circle: new DrawCursor('circle', 'Circle', Draw.CircleDrawHandler),
    shape: new DrawCursor('shape', 'Shape', Draw.ShapeDrawHandler)

  },

  colors: [
    {code: "#fff", label:"white"},
    {code: "#22ee11", label:"green"},
    {code: "#ee2211", label:"red"},
    {code: "#000", label:"black"},
  ],

  playerColors: [
    {code: "#000", label:"black"},
    {code: "#FFEB3B", label:"yellow"},
    {code: "#22ee11", label:"green"},
    {code: "#ee2211", label:"red"},
    {code: "#fff", label:"white"},
  ],

  thickness: [
    {key:'thin', width:2},
    {key:'thick', width:4},
  ],

  arrowHeads: [
    {key: 'none'},
    {key: 'head'},
    {key: 'tail'},
    {key: 'both'},
  ],

  asserts: {
    players: [
      'to_left',
      'push_left',
      'to_right',
      'catch_left',
      'walk_right',
      'face_back',
      'back_right',
      'catch_right',
      'walk_left',
      'push_right',
      'back_left',
      'fly_left',
      'face',
      'run_left',
      'fly_right'
    ],

    playerDressColor: {
      black: {shirt:'#000000', shorts:'#CCCCCC'},
      yellow: {shirt:'#FFF753', shorts:'#332DE7'},
      green: {shirt:'#6EE73E', shorts:'#CCCCCC'},
      red: {shirt:'#EB283C', shorts:'#CCCCFF'},
      white: {shirt:'#FFFFFF', shorts:'#6EE73E'},
    },

    goal: [
      'doll_face', 'doll_left', 'doll_right',
      'post_side_left', 'post_side_right',
      'post_top_top', 'post_top_bottom', 'post_top_left', 'post_top_right',
      'post_face', 'post_back'
    ],

    postGroups: [
      ['side', ['left', 'right']],
      ['top', ['bottom', 'top', 'left', 'right']],
      ['normal', ['face', 'back']]
    ],

    letters: [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z',
      'Text Box'
    ],

    equips: [
      new EquipIcon('FlagYellow', 0, 0, 31, 35, .3, .3),
      new EquipIcon('FlagRed', 22, 0, 31, 35, .3, .3),
      new EquipIcon('FlagSmallYellow', 7, 42, 25, 21, .3, .3),
      new EquipIcon('FlagSmallRed', 29, 44, 23, 21, .3, .3),
      new EquipIcon('LadderWide', 60, 10, 73, 22, .3, .3),
      new EquipIcon('LadderHigh', 55, 44, 22, 47, .3, .3),
      new EquipIcon('LadderLeft', 78, 46, 24, 30, .2, .2),
      new EquipIcon('LadderRight', 105, 45, 38, 44, .2, .2),
      new EquipIcon('HookRedUp', 140, 0, 24, 9, .2, .2),
      new EquipIcon('HookRedLeft', 140, 14, 24, 20, .2, .2),
      new EquipIcon('HookRedRight', 140, 38, 24, 20, .2, .2),
      new EquipIcon('StickBlue', 0, 100, 26, 45, .3, .3),
      new EquipIcon('StickRed', 26, 100, 26, 45, .3, .3),
      new EquipIcon('StickGreen', 52, 100, 26, 45, .3, .3),
      new EquipIcon('StickRed2', 79, 100, 26, 45, .3, .3),
      new EquipIcon('StickYellow', 105, 100, 26, 45, .3, .3),
      new EquipIcon('Ball', 170, 0, 17, 12, .3, .3),
      new EquipIcon('BallBag', 0, 157, 50, 36, .3, .3),
      new EquipIcon('HookYellowLeft', 172, 18, 19, 24, .3, .3),
      new EquipIcon('HookYellowUp', 167, 49, 34, 11, .3, .3),
      new EquipIcon('HookYellowRight', 172, 63, 19, 24, .3, .3),
      new EquipIcon('CrossOrangeUp', 144, 95, 53, 15, .3, .3),
      new EquipIcon('CrossOrangeRight', 144, 120, 53, 40, .3, .3),
      new EquipIcon('CrossOrangeLeft', 144, 162, 53, 40, .3, .3),
      new EquipIcon('CrossYellowRight', 156, 200, 43, 40, .3, .3),
      new EquipIcon('CrossYellowLeft', 110, 200, 40, 40, .3, .3),
      new EquipIcon('CrossYellowUp', 85, 165, 53, 16, .3, .3),
      new EquipIcon('doll_left', 0, 203, 39, 46, .25, .25),
      new EquipIcon('doll_face', 33, 203, 42, 46, .25, .25),
      new EquipIcon('doll_right', 70, 203, 39, 46, .25, .25),
      new EquipIcon('ConeGreeen', 205, 0, 11, 11, .25, .25),
      new EquipIcon('DiskGreeen', 205, 20, 11, 11, .25, .25),
      new EquipIcon('ConeGreeenLight', 205, 40, 11, 11, .25, .25),
      new EquipIcon('DiskGreeenLight', 205, 60, 11, 11, .25, .25),
      new EquipIcon('ConeRed', 205, 80, 11, 11, .25, .25),
      new EquipIcon('DiskRed', 205, 100, 11, 11, .25, .25),
      new EquipIcon('ConeYellow', 205, 120, 11, 11, .25, .25),
      new EquipIcon('DiskYellow', 205, 140, 11, 11, .25, .25),
      new EquipIcon('CrossBlueUp', 200, 165, 44, 11, .25, .25),
      new EquipIcon('CrossBlueLeft', 205, 215, 43, 40, .25, .25),
      new EquipIcon('CrossBlueRight', 205, 180, 43, 40, .25, .25),
      new EquipIcon('CapOrange', 223, 0, 19, 18, .25, .25),
      new EquipIcon('CapBlue', 223, 23, 19, 18, .25, .25),
      new EquipIcon('CapGreen', 223, 47, 19, 18, .25, .25),
      new EquipIcon('CapVoilet', 223, 70, 19, 18, .25, .25),
      new EquipIcon('CapRed', 223, 95, 24, 18, .25, .25),
      new EquipIcon('CapYellow', 223, 120, 19, 18, .25, .25),
    ],

    goals: [
      new EquipIcon('post_top_left_mid', 35, 15, 47, 48, 1, 1),
      new EquipIcon('post_top_top', 96, 0, 46, 28, 1, 1),
      new EquipIcon('post_top_right_mid', 157, 15, 49, 47, 1, 1),
      new EquipIcon('post_top_left', 31, 72, 28, 47, 1, 1),
      new EquipIcon('post_top_right', 181, 72, 29, 48, 1, 1),
      new EquipIcon('post_bottom_left_mid', 35, 125, 47, 49, 1, 1),
      new EquipIcon('post_bottom_right_mid', 157, 125, 47, 47, 1, 1),
      new EquipIcon('post_top_bottom', 96, 160, 47, 28, 1, 1),
      
      new EquipIcon('post_side_right', 23, 210, 39, 80, 1, 1),
      new EquipIcon('post_side_left', 69, 210, 36, 87, 1, 1),
      new EquipIcon('post_face', 120, 210, 102, 45 , 1, 1),
      new EquipIcon('post_back', 120, 264, 102, 54, 1, 1),

      
    ],

    settings: {
      player: new Assert('svg', 'player', null, null, null, true),
      post: new Assert('svg', 'post', null, null, null, true),
      letter: new Assert('label', 'letter', null),
      assert: new Assert('svg', 'assert', .2838, null, null, true, ['assert_doll_left', 'assert_doll_face', 'assert_doll_right', 'assert_LadderWide', 'assert_LadderHigh', 'assert_LadderLeft', 'assert_LadderRight', 'assert_BallBag', 'assert_FlagYellow', 'assert_FlagRed']),
    }
  },

  playerImageUrl(color, player){
    // return `/imgs/graphics/players/${color.label}_${player}.png`;
    return this.getAssertImageUrl(`player_${color.label}_${player}`);
  },

  playerSVGUrl(color, player){
    return `#sp_svg_player_${player}_${color.label}`;
  },

  getAssertImageUrl(name){
    return `/imgs/graphics/stuff/${name}.png`;
  },

  assertSVGUrl(name){
    return `#spsvg_${name}`;
  },

  cursorSVGUrl(name){
    return `#spsvg_icon_${name}`;
  },

  getAssertSettings(name){
    if(this.asserts.settings[name]){
      return this.asserts.settings[name];
    }

    var parts = name.split('_');
    var kind = parts[0];
    return this.asserts.settings[kind];
  },


  activeEditor: null,
  activeDrill: null

}

EditorSetup.fieldsOrder = [
  EditorSetup.fields.birds_eyeview,
  EditorSetup.fields.cricle,
  EditorSetup.fields.half_long_bleachers,
  EditorSetup.fields.half_short_bleachers,
  EditorSetup.fields.quad_box_grid,
  EditorSetup.fields.single_box_grid,
  EditorSetup.fields.plain,
  EditorSetup.fields.full_long_bleachers,
  EditorSetup.fields.birds_eyeview_stright,
]

EditorSetup.cursorsOrder = {
  right: [
    EditorSetup.cursors.select,
    EditorSetup.cursors.pen,
    EditorSetup.cursors.line,
    EditorSetup.cursors.curve,
    EditorSetup.cursors.dashline,
    EditorSetup.cursors.dotline,
    EditorSetup.cursors.highlight,

    EditorSetup.cursors.rect,
    EditorSetup.cursors.triangle,
    EditorSetup.cursors.circle,
    EditorSetup.cursors.shape,
  ],

  left: [
    // EditorSetup.cursors.text,

    // EditorSetup.cursors.rect,
    // EditorSetup.cursors.triangle,
    // EditorSetup.cursors.circle,
    // EditorSetup.cursors.shape,
  ]
}

