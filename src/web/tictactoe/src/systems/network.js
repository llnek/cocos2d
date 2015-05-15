// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/odin
 * @module zotohlab/tictactoe/network
 */
define("zotohlab/p/s/network",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/odin'],

  function (pss, gnodes, sjs, sh, odin) { "use strict";

    /** @alias module:zotohlab/tictactoe/network */
    var exports = {  /* empty */ },
    evts= odin.Events,
    xcfg= sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class NetworkSystem
     */
    var NetworkSystem = sh.Ashley.sysDef({

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/tictactoe/network~NetworkSystem
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.events = options.netQ;
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/tictactoe/network~NetworkSystem
       * @method removeFromEngine
       * @param {Object} engine
       */
      removeFromEngine: function(engine) {
        this.netplay=null;
      },

      /**
       * @memberof module:zotohlab/tictactoe/network~NetworkSystem
       * @method addToEngine
       * @param {Object} engine
       */
      addToEngine: function(engine) {
        this.netplay = engine.getNodeList(gnodes.NetPlayNode);
      },

      /**
       * @memberof module:zotohlab/tictactoe/network~NetworkSystem
       * @method update
       * @param {Number} dt
       */
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

      /**
       * @memberof module:zotohlab/tictactoe/network~NetworkSystem
       * @method process
       * @param {Node} node
       * @param {Event} evt
       */
      process: function(node, evt) {
        var pnum= sjs.isNumber(evt.source.pnum) ? evt.source.pnum : -1;
        if (pnum === 1 || pnum === 2) {} else { return; }
        switch (evt.code) {
          case evts.POKE_MOVE:
            sjs.loggr.debug("player " + pnum + ": my turn to move");
            sh.fire('/hud/timer/show');
            this.state.actor= pnum;
          break;
          case evts.POKE_WAIT:
            sjs.loggr.debug("player " + pnum + ": my turn to wait");
            sh.fire('/hud/timer/hide');
            // toggle color
            this.state.actor= pnum===1 ? 2 : 1;
          break;
        }
      },

      /**
       * If the action from the server is valid, update the
       * state of the cell in the grid.
       * @private
       */
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

    /**
     * @property {Number} Priority
     * @final
     */
    NetworkSystem.Priority= pss.Movement;

    /**
     * @property {NetworkSystem.Class} NetworkSystem
     * @final
     */
    exports.NetworkSystem = NetworkSystem;

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

