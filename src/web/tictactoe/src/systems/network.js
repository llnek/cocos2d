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

define("zotohlab/p/s/network",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/odin'],

  function (pss, gnodes, sjs, sh, odin) { "use strict";

    var evts= odin.Events,
    xcfg= sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    var NetworkSystem = sh.Ashley.sysDef({

      constructor: function(options) {
        this.events = options.netQ;
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.netplay=null;
      },

      addToEngine: function(engine) {
        this.netplay = engine.getNodeList(gnodes.NetPlayNode);
      },

      update: function (dt) {
        if (this.events.length > 0) {
          var evt = this.events.shift(),
          node= this.netplay.head;
          if (this.state.running &&
              !!node) {
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
        snd,
        grid=node.grid,
        vs=grid.values;

        if (sjs.isObject(cmd) &&
            sjs.isNumber(cmd.cell) &&
            cmd.cell >= 0 &&
            cmd.cell < vs.length) {

          if (this.state.players[1].value === cmd.value) {
            snd= 'x_pick';
          } else {
            snd= 'o_pick';
          }
          vs[cmd.cell] = cmd.value;
          sh.sfxPlay(snd);
        }
      }

    });

    NetworkSystem.Priority= pss.Movement;
    return NetworkSystem;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

