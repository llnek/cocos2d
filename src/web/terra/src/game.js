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
 * @requires zotohlab/asx/xmmenus
 * @requires zotohlab/p/sysobjs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/p/hud
 * @module zotohlab/p/arena
 */
define('zotohlab/p/arena',

       ['zotohlab/asx/xscenes',
        'zotohlab/asx/xmmenus',
        'zotohlab/p/sysobjs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/p/hud'],

  function (scenes, mmenus, sobjs, sh, ccsx, huds) { "use strict";

    /** @alias module:zotohlab/p/arena */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    /**
     * @extends module:zotohlab/asx/xscenes.XGameLayer
     * @class GameLayer
     */
    GameLayer = scenes.XGameLayer.extend({

      /**
       * @method cfgInputMouse
       * @protected
       */
      cfgInputMouse() {
        cc.eventManager.addListener({
          event: cc.EventListener.MOUSE,
          onMouseMove(e) {
            if (e.getButton() === cc.EventMouse.BUTTON_LEFT) {
              e.getCurrentTarget().processEvent(e);
            }
          }
        }, this);
      },

      /**
       * @method cfgTouch
       * @protected
       */
      cfgTouch() {
        this.cfgInputTouchesAll();
      },

      /**
       * @method processEvent
       * @private
       */
      processEvent(e) {
        const ship= this.options.player;
        if (this.options.running &&
            !!ship) {
          uts.processTouch(ship, e.getDelta());
        }
      },

      /**
       * @method reset
       */
      reset(newFlag) {
        if (! sjs.isEmpty(this.atlases)) {
          //sjs.eachObj(function(z) { z.removeAllChildren(); }, this.atlases);
        } else {
          R.forEach((info) => {
            const b= this.regoAtlas(info[0]);
            if (info[1]) {
              b.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
            }
          }, [ ['op-pics', true],
               ['game-pics', false],
               ['explosions', true]]);
        }
        if (newFlag) {
          this.getHUD().resetAsNew();
        } else {
          this.getHUD().reset();
        }
      },

      /**
       * @method initBackTiles
       * @private
       */
      initBackTiles() {
        this.moveBackTiles();
        this.schedule(this.moveBackTiles, 5);
      },

      /**
       * @method moveBackTiles
       * @private
       */
      moveBackTiles() {
        let ps= sh.pools.BackTiles,
        wz= ccsx.vrect(),
        move,
        fun,
        tm = ps.get();

        if (!tm) {
          this.factory.createBackTiles();
          tm= ps.get();
        }

        tm.inflate({ x: sjs.rand(wz.width),
                     y: wz.height });

        move = cc.moveBy(sjs.rand(2) + 10,
                         cc.p(0, -wz.height - wz.height * 0.5));
        fun = cc.callFunc(() => {
          tm.deflate();
        });

        tm.sprite.runAction(cc.sequence(move,fun));
      },

      /**
       * @method operational
       * @protected
       */
      operational() {
        return this.options.running;
      },

      /**
       * @method replay
       */
      replay() {
        this.play(false);
      },

      /**
       * @method play
       */
      play(newFlag) {

        this.reset(newFlag);
        this.cleanSlate();

        this.factory=new sobjs.EntityFactory(this.engine);
        sh.factory = this.factory;
        this.options.secCount=0;
        this.options.running = true;

        R.forEach((z) => {
          this.engine.addSystem(new (z)(this.options), z.Priority);
        },
        [ sobjs.Supervisor,
          sobjs.Motions,
          sobjs.LevelManager,
          sobjs.MoveMissiles,
          sobjs.MoveBombs,
          sobjs.MoveShip,
          sobjs.Collisions,
          sobjs.Resolution,
          sobjs.Rendering ]);

        sh.sfxPlayMusic('bgMusic', {repeat: true});
        this.schedule(() => {
          // counter used to spawn enemies
          ++this.options.secCount;
        },1);
      },

      /**
       * @method spawnPlayer
       * @private
       */
      spawnPlayer() {
        uts.bornShip(this.options.player);
      },

      /**
       * @method onPlayerKilled
       * @private
       */
      onPlayerKilled(msg) {
        //sh.sfxPlay('xxx-explode');
        if ( this.getHUD().reduceLives(1)) {
          this.onDone();
        } else {
          this.spawnPlayer();
        }
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
       * @method onEarnScore
       * @private
       */
      onEarnScore(msg) {
        this.getHUD().updateScore( msg.score);
      },

      /**
       * @method onDone
       * @private
       */
      onDone() {
        this.options.running=false;
        sh.sfxCancel();
        this.reset();
        this.getHUD().enableReplay();
      },

      /**
       * @method getEnclosureBox
       * @private
       */
      getEnclosureBox() {
        const wb= ccsx.vbox();
        return {
          bottom: wb.bottom,
          left: wb.left,
          top: wb.top + 10,
          right: wb.right
        };
      },

      /**
       * @method ctor
       * @constructs
       */
      ctor(options) {
        //this._levelManager = new LevelManager(this);
        this._super(options);
      }

    });

    exports =  /** @lends exports# */{

      /**
       * @property {String} rtti
       */
      rtti : sh.ptypes.game,

      /**
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        sjs.merge(options, {hudAtlas: 'game-pics'});
        const scene = new scenes.XSceneFactory([
          GameLayer,
          huds.HUDLayer
        ]).reify(options);

        scene.onmsg('/game/players/earnscore', (topic, msg) => {
          sh.main.onEarnScore(msg);
        }).
        onmsg('/game/backtiles',(t,msg) => {
          sh.main.initBackTiles();
        }).
        onmsg('/hud/showmenu',(t,msg) => {
          mmenus.showMenu();
        }).
        onmsg('/hud/replay',(t,msg) => {
          sh.main.replay();
        }).
        onmsg('/game/players/killed', (topic, msg) => {
          sh.main.onPlayerKilled(msg);
        });

        return scene;
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

