
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
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    engine.addEntity(this.factory.createArena(this.state));
    this.nodeList= engine.getNodeList(bks.ArenaNode);
  },

  update: function (dt) {
    if (! this.inited) {
      this.onceOnly();
      this.inited=true;
    } else {
    }
  },

  onceOnly: function () {
    var node = this.nodeList.head,
    tiles= this.fakeTileMap();

    node.blocks.grid = this.initBlockMap(tiles);
    node.collision.tiles = tiles;

    sjs.loggr.info("collision tiles and blocks init'ed.");
  },

  initBlockMap: function(tiles) {
    var grid=[],
    rc,
    r;

    for (r= 0; r < tiles.length; ++r) {
      rc= sjs.makeArray(tiles[r].length, undef);
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


