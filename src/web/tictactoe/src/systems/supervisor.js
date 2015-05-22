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
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/odin
 * @module zotohlab/p/s/supervisor
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

    /** @alias module:zotohlab/p/s/supervisor */
    let exports = {       },
    evts= odin.Events,
    xcfg=sh.xcfg,
    csts= xcfg.csts,
    R=sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class GameSupervisor
     */
    const GameSupervisor = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
        this.inited=false;
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.board=null;
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        engine.addEntity(sh.factory.reifyBoard(sh.main,
                                               this.state));
        this.board= engine.getNodeList(gnodes.BoardNode);
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const node= this.board.head;
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
      showGrid(node) {
        let mgs = utils.mapGridPos(),
        cs=node.view.cells,
        pos=0,
        sp;

        R.forEach((mp) => {
          sp= ccsx.createSpriteFrame('z.png');
          sp.setPosition(ccsx.vboxMID(mp));
          sh.main.addAtlasItem('game-pics',sp);
          cs[pos++]=[sp, sp.getPositionX(), sp.getPositionY(), csts.CV_Z];
        }, mgs);
      },

      /**
       * @private
       */
      onceOnly(node,dt) {

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
          let pnum = sjs.randSign() > 0 ? 1 : 2;
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
      process(node,dt) {

        let active = this.state.running,
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
     * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
     * @property {Number} Priority
     */
    GameSupervisor.Priority= pss.PreUpdate;

    exports= GameSupervisor;
    return exports;
});


//////////////////////////////////////////////////////////////////////////////
//EOF





