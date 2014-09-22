// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef){ "use strict"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
ccsx= asterix.CCS2DX,
sjs= global.SkaroJS,
sh= asterix,
ttt= sh.TicTacToe;


//////////////////////////////////////////////////////////////////////////////
//
ttt.SelectionSystem = Ash.System.extend({

  constructor: function(options) {
    this.events= options.selQ;
    this.state= options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.nodeList = engine.getNodeList(ttt.GUINode);
  },

  update: function (dt) {
    if (this.events.length > 0) {
      var evt = this.events.shift();
      for (var node = this.nodeList.head; node; node=node.next) {
        this.process(node, evt);
      }
    }
    this.events.length=0;
  },

  process: function(node, evt) {
    var sel = node.selection,
    map = node.view.gridMap,
    n,rect,
    sz= map.length;

    //set the mouse/touch position
    sel.px = evt.x;
    sel.py = evt.y;
    sel.cell= -1;

    //which cell did he click on?
    for (n=0; n < sz; ++n) {
      rect = map[n];
      if (sel.px >= rect[0] && sel.px <= rect[2] &&
          sel.py >= rect[3] && sel.py <= rect[1]) {
        sel.cell= n;
        break;
      }
    }
  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




