
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

//////////////////////////////////////////////////////////////////////////////
//
bks.GameSupervisor = Ash.System.extend({

  constructor: function(options) {
    this.factory = options.factory;
    this.state = options;
    this.inited=false;
    return this;
  },

  removeFromEngine: function(engine) {
    //this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.engine=engine;
  },

  update: function (dt) {
    if (! this.inited) {
      this.onceOnly();
      this.inited=true;
    } else {
      this.process();
    }
  },

  process: function() {
    var some_condition = true,
    ent;

    if (some_condition) {
      ent= this.factory.createShape(this.state);
      this.engine.addEntity(ent);
    }

  },

  spawn: function() {
    var info = this.state.nextShapeInfo,
    n= sjs.rand( EntityList.length),
    proto, png, formID,
    wz = ccsx.screen(),
    csts= sh.xcfg.csts,
    c= 5;
    if (info) {
      formID = info.formID;
      png = info.png;
      proto= info.model;
    } else {
      proto = EntityList[n];
    }
    this.curShape= new (proto)(  c * csts.TILE, wz.height - csts.FIELD_TOP * csts.TILE, {
      formID: formID,
      png: png
    });
    this.curShape.create(this);
    this.dropSpeed=1000;
    this.initDropper();
    this.getHUD().showNext();
  },

  onceOnly: function () {
    this.state.collisionMap= this.fakeTileMap();
    this.state.blocks = this.initBlockMap();
  },

  initBlockMap: function() {
    var data= this.state.collisionMap,
    grid=[],
    rc,
    r;

    for (r= 0; r < this.collisionMap.length; ++r) {
      rc= sjs.makeArray(this.collisionMap[r].length, undef);
      grid.push(rc);
    }

    return grid;
  },

  //create our own collision map using cells
  fakeTileMap: function() {
    var csts= sh.xcfg.csts,
    map=[],
    r,
    rc,
    hlen = csts.GRID_H,
    wlen = csts.GRID_W;

    for (r = 0; r < hlen; ++r) {
      if (r === 0 || r === hlen-1) {
        rc = sjs.makeArray(wlen, 1);
      } else {
        rc = sjs.makeArray(wlen, 0);
        rc[0] = 1;
        rc[csts.FIELD_W + 1] = 1;
      }
      map[r] = rc;
    }
    return map;
  }



});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF


