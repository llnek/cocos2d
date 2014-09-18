

(function(undef) { "use strict"; var global = this, _ = global._ ;


//////////////////////////////////////////////////////////////////////////////
//

var SelectionSystem = Ash.System.extend({

  constructor: function (grid,cells) {
    this.cellCount=cells;
    this.grid= grid;
    return this;
  },

  nodeList: null,
  grid: null,

  addToEngine: function (engine) {
    this.nodeList = engine.getNodeList(SelectionNode);
  },

  removeFromEngine: function (engine) {
    this.nodeList = null;
  },

  update: function (dt) {
    if (this.nodeList) {
      for (var node = this.nodeList.head; node; node = node.next) {
        this.updateNode(node, dt);
      }
    }
  },

  updateNode: function (node, dt) {
    var pos = node.selection,
    n,
    gg;

    for (n=0; n < this.cellCount; ++n) {
      gg = this.grid[n];
      if (pos.x >= gg[0] &&
          pos.x <= gg[2] &&
          pos.y >= gg[3] &&
          pos.y <= gg[1]) {
        pos.cell= n;
        break;
      }
    }
  }

});




}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

