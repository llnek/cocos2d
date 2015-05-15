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
 * @requires zotohlab/tictactoe/priorities
 * @requires zotohlab/tictactoe/utils
 * @requires zotohlab/tictactoe/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/odin
 * @module zotohlab/tictactoe/supervisor
 */
define("zotohlab/p/s/supervisor",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/odin'],

  function (pss, utils, gnodes, sjs, sh, ccsx, odin) { "use strict";

    /** @alias module:zotohlab/tictactoe/supervisor */
    var exports = {       },
    evts= odin.Events,
    xcfg=sh.xcfg,
    csts= xcfg.csts,
    R=sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class GameSupervisor
     */
    var GameSupervisor = sh.Ashley.sysDef({

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/tictactoe/supervisor~GameSupervisor
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state= options;
        this.inited=false;
      },

      /**
       * @memberof module:zotohlab/tictactoe/supervisor~GameSupervisor
       * @method removeFromEngine
       * @param {Engine} engine
       */
      removeFromEngine: function(engine) {
        this.board=null;
      },

      /**
       * @memberof module:zotohlab/tictactoe/supervisor~GameSupervisor
       * @method addToEngine
       * @param {Engine} engine
       */
      addToEngine: function(engine) {
        engine.addEntity(sh.factory.createBoard(sh.main,
                                                this.state));
        this.board= engine.getNodeList(gnodes.BoardNode);
      },

      /**
       * @memberof module:zotohlab/tictactoe/supervisor~GameSupervisor
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        var node= this.board.head;
        if (this.state.running &&
            !!node) {
          if (! this.inited) {
            this.onceOnly(node, dt);
            this.inited=true;
          } else {
            this.process(node,dt);
          }
        }
      },

      /**
       * @private
       */
      showGrid: function(node) {
        var mgs = utils.mapGridPos(),
        cs=node.view.cells,
        pos=0,
        sp;

        R.forEach(function(mp) {
          sp= ccsx.createSpriteFrame('z.png');
          sp.setPosition(ccsx.vboxMID(mp));
          sh.main.addAtlasItem('game-pics',sp);
          cs[pos++]=[sp, sp.getPositionX(), sp.getPositionY(), csts.CV_Z];
        }, mgs);
      },

      /**
       * @private
       */
      onceOnly: function(node,dt) {

        this.showGrid(node);

        if (this.state.wsock) {
          // online play
          sjs.loggr.debug("reply to server: session started ok");
          this.state.wsock.send({
            type: evts.MSG_SESSION,
            code: evts.STARTED
          });
          this.state.actor= 0;
        } else {
          //randomly pick a player to start the game.
          var pnum = sjs.randSign() > 0 ? 1 : 2;
          this.state.actor=pnum;
          if (this.state.players[pnum].category === csts.HUMAN) {
            sh.fire('/hud/timer/show');
          }
          else
          if (this.state.players[pnum].category === csts.BOT) {
          }
        }
      },

      /**
       * @private
       */
      process: function(node,dt) {

        var active = this.state.running,
        actor = this.state.actor;

        if (!active) {
          actor= this.state.lastWinner;
        }

        sh.fire('/hud/update', {
          running: active,
          pnum: actor
        });
      }

    });

    /**
     * @memberof module:zotohlab/tictactoe/supervisor~GameSupervisor
     * @property {Number} Priority
     * @final
     */
    GameSupervisor.Priority= pss.PreUpdate;

    /**
     * @property {GameSupervisor.Class} GameSupervisor
     * @final
     */
    exports.GameSupervisor = GameSupervisor;
    return exports;
});


//////////////////////////////////////////////////////////////////////////////
//EOF





