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
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/odin
 * @requires zotohlab/p/hud
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/sysobjs
 * @module zotohlab/p/arena
 */
define("zotohlab/p/arena",

       ['zotohlab/asx/xscenes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/odin',
        'zotohlab/p/hud',
        'zotohlab/p/elements',
        'zotohlab/p/sysobjs'],

  function (scenes, sh, ccsx,
            odin, huds, cobjs, sobjs) { "use strict";

    /** @alias module:zotohlab/p/arena */
    let exports = {},
    evts= odin.Events,
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XLayer
     * @class BackLayer
     */
    BackLayer = scenes.XLayer.extend({
      /**
       * @method setup
       * @protected
       */
      setup() {
        this.centerImage(sh.getImagePath('game.bg'));
      },
      /**
       * @method rtti
       */
      rtti() { return 'BackLayer'; }
    }),
    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XGameLayer
     * @class GameLayer
     */
    GameLayer = scenes.XGameLayer.extend({
      /**
       * @method onStop
       * @private
       */
      onStop(evt) { this.options.netQ.push(evt); },
      /**
       * @method replay
       */
      replay() {
        if (sjs.isObject(this.options.wsock)) {
          // request server to restart a new game
          this.options.wsock.send({
            type: evts.MSG_SESSION,
            code: evts.REPLAY
          });
        } else {
          this.play(false);
        }
      },
      /**
       * @method play
       */
      play(newFlag) {

        csts.CELLS = this.options.size*this.options.size;
        csts.GRID_SIZE= this.options.size;

        // sort out names of players
        let p1ids, p2ids;
        sjs.eachObj((v,k) => {
          if (v[0] === 1) {
            p1ids= [k, v[1] ];
          } else {
            p2ids= [k, v[1] ];
          }
        }, this.options.ppids);

        // clean slate
        this.reset(newFlag);
        this.cleanSlate();

        sh.factory= new sobjs.Factory(this.engine);
        this.options.running=true;
        this.initPlayers();

        this.options.selQ = [];
        this.options.netQ = [];
        this.options.msgQ = [];

        R.forEach((z) => {
          this.engine.addSystem(new (z)(this.options), z.Priority);
        },
        [sobjs.GameSupervisor,
         sobjs.SelectionSystem,
         sobjs.NetworkSystem,
         sobjs.TurnBaseSystem,
         sobjs.ResolutionSystem,
         sobjs.RenderSystem
        ]);

        if (this.options.wsock) {
          this.options.wsock.unsubscribeAll();
          this.options.wsock.subscribeAll(this.onevent,this);
        }

        this.getHUD().regoPlayers(csts.P1_COLOR, p1ids,
                                  csts.P2_COLOR, p2ids);
      },
      /**
       * @method onNewGame
       * @private
       */
      onNewGame(mode) {
        //sh.sfxPlay('start_game');
        this.setGameMode(mode);
        this.play(true);
      },
      /**
       * @method reset
       */
      reset(newFlag) {
        if (!sjs.isEmpty(this.atlases)) {
          sjs.eachObj((v) => { v.removeAllChildren(); }, this.atlases);
        } else {
          this.regoAtlas('game-pics');
          this.regoAtlas('lang-pics');
        }
        if (newFlag) {
          this.getHUD().resetAsNew();
        } else {
          this.getHUD().reset();
        }
      },
      /**
       * @method onclicked
       * @protected
       */
      onclicked(mx,my) {
        if (this.options.running &&
            this.options.selQ.length === 0) {
          //sjs.loggr.debug("selection made at pos = " + mx + "," + my);
          this.options.selQ.push({ x: mx, y: my, cell: -1 });
        }
      },
      /**
       * @method updateHUD
       * @private
       */
      updateHUD() {
        if (this.options.running) {
          this.getHUD().drawStatus(this.actor);
        } else {
          this.getHUD().drawResult(this.lastWinner);
        }
      },
      /**
       * @method playTimeExpired
       * @private
       */
      playTimeExpired(msg) {
        this.options.msgQ.push("forfeit");
      },
      /**
       * @method setGameMode
       * @protected
       */
      setGameMode(mode) {
        this._super(mode);
        this.getHUD().setGameMode(mode);
      },
      /**
       * @method initPlayers
       * @private
       */
      initPlayers() {
        let p2cat, p1cat,
        p2, p1;

        switch (this.options.mode) {
          case sh.gtypes.ONLINE_GAME:
            p2cat = csts.NETP;
            p1cat = csts.NETP;
          break;
          case sh.gtypes.P1_GAME:
            p1cat= csts.HUMAN;
            p2cat= csts.BOT;
          break;
          case sh.gtypes.P2_GAME:
            p2cat= csts.HUMAN;
            p1cat= csts.HUMAN;
          break;
        }
        p1= new cobjs.Player(p1cat, csts.CV_X, 1, csts.P1_COLOR);
        p2= new cobjs.Player(p2cat, csts.CV_O, 2, csts.P2_COLOR);
        this.options.players = [null,p1,p2];
        this.options.colors={};
        this.options.colors[csts.P1_COLOR] = p1;
        this.options.colors[csts.P2_COLOR] = p2;
      },
      /**
       * @method onevent
       * @private
       */
      onevent(topic, evt) {
        //sjs.loggr.debug(evt);
        switch (evt.type) {
          case evts.MSG_NETWORK:
            this.onNetworkEvent(evt);
          break;
          case evts.MSG_SESSION:
            this.onSessionEvent(evt);
          break;
        }
      },
      /**
       * @method onNetworkEvent
       * @private
       */
      onNetworkEvent(evt) {
        switch (evt.code) {
          case evts.RESTART:
            sjs.loggr.debug("restarting a new game...");
            this.getHUD().killTimer();
            this.play(false);
          break;
          case evts.STOP:
            sjs.loggr.debug("game will stop");
            this.getHUD().killTimer();
            this.onStop(evt);
          break;
          default:
            //TODO: fix this hack
            this.onSessionEvent(evt);
          break;
        }
      },

      /**
       * @method onSessionEvent
       * @private
       */
      onSessionEvent(evt) {
        this.options.netQ.push(evt);
        /*
        if (_.isNumber(evt.source.pnum) &&
            _.isObject(evt.source.cmd) &&
            _.isNumber(evt.source.cmd.cell)) {
          sjs.loggr.debug("action from server " + JSON.stringify(cmd));
          this.options.netQ.push(evt);
        }
        switch (evt.code) {
          case evts.POKE_MOVE:
          case evts.POKE_WAIT:
          break;
        }

    */
      }

    });

    exports = /** @lends exports# */{

      /**
       * @property {String} rtti
       */
      rtti: sh.ptypes.game,

      /**
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        const scene = new scenes.XSceneFactory([
          BackLayer,
          GameLayer,
          huds.HUDLayer
        ]).reify(options);

        scene.onmsg('/hud/showmenu',(t,msg) => {
          scenes.showMenu();
        }).
        onmsg('/hud/replay',(t,msg) => {
          sh.main.replay();
        }).
        onmsg('/hud/timer/show',(t,msg) => {
          sh.main.getHUD().showTimer();
        }).
        onmsg('/hud/timer/hide', (t,msg) => {
          sh.main.getHUD().killTimer();
        }).
        onmsg('/hud/score/update', (t,msg) => {
          sh.main.getHUD().updateScore(msg.color, msg.score);
        }).
        onmsg('/hud/end', (t,msg) => {
          sh.main.getHUD().endGame(msg.winner);
        }).
        onmsg('/hud/update', (t,msg) => {
          sh.main.getHUD().update(msg.running, msg.pnum);
        }).
        onmsg('/player/timer/expired', (t,msg) => {
          sh.main.playTimeExpired(msg);
        });

        return scene;
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

