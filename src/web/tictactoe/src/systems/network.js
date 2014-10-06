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

function moduleFactory(sjs, sh, xcfg, odin, gnodes, Ash) { "use strict";
var evts= odin.Events,
undef;

//////////////////////////////////////////////////////////////////////////////
//
var NetworkSystem = Ash.System.extend({

  constructor: function(options) {
    this.events = options.netQ;
    this.state= options;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.nodeList = engine.getNodeList(gnodes.NetPlayNode);
  },

  update: function (dt) {
    if (this.events.length > 0) {
      var evt = this.events.shift();
      for (var node = this.nodeList.head; node; node=node.next) {
        this.maybeUpdateActions(node, evt);
        this.process(node, evt);
      }
    }
  },

  process: function(node, evt) {
    var pnum= sjs.isNumber(evt.source.pnum) ? evt.source.pnum : -1;
    if (pnum === 1 || pnum === 2) {} else { return; }
    switch (evt.code) {
      case evts.C_POKE_MOVE:
        sjs.loggr.debug("player " + pnum + ": my turn to move");
        sh.fireEvent('/game/hud/timer/show');
        this.state.actor= pnum;
      break;
      case evts.C_POKE_WAIT:
        sjs.loggr.debug("player " + pnum + ": my turn to wait");
        sh.fireEvent('/game/hud/timer/hide');
        // toggle color
        this.state.actor= pnum===1 ? 2 : 1;
      break;
    }
  },

  maybeUpdateActions: function(node, evt) {
    var cmd= evt.source.cmd,
    grid= node.grid,
    vs= grid.values;

    if (sjs.isObject(cmd) && sjs.isNumber(cmd.cell) &&
        cmd.cell >= 0 && cmd.cell < vs.length) {
      vs[cmd.cell] = cmd.value;
    }
  }


});


return NetworkSystem;
}

//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("zotohlab/p/s/network",
            ['cherimoia/skarojs',
             'zotohlab/asterix',
             'zotohlab/asx/xcfg',
             'zotohlab/asx/odin',
             'zotohlab/p/gnodes',
             'ash-js'],
            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




