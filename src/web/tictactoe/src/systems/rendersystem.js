
(function (undef) { "use strict"; var global = this, _ = global._ ;


var RenderSystem = Ash.System.extend({

  constructor: function () {
    return this;
  },

  nodeList: null,

  addToEngine: function (engine) {
    this.nodeList = engine.getNodeList(RenderNode);
  },

  removeFromEngine: function (engine) {
    this.nodeList = null;
  },

  update: function (dt) {
    if (this.nodeList) {
      for (var node = this.nodeList.head; node; node = node.next) {
      }
    }
  }

});


}).call(this);
