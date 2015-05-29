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
 * @requires zotohlab/p/hud
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/sysobjs
 * @module zotohlab/p/arena
 */
define("zotohlab/p/arena",

       ['zotohlab/asx/xscenes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/p/hud',
        'zotohlab/p/elements',
        'zotohlab/p/sysobjs'],

  function(scenes, sh, ccsx,
           huds, cobjs, sobjs) { "use strict";

    /** @alias module:zotohlab/p/arena */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XLayer
     * @class BackLayer
     */
    BackLayer = scenes.XLayer.extend({
      /**
       * @method rtti
       */
      rtti() { return 'BackLayer'; },
      /**
       * @method setup
       * @protected
       */
      setup() {
        this.centerImage(sh.getImagePath('game.bg'));
      }
    }),
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XGameLayer
     * @class GameLayer
     */
    GameLayer = scenes.XGameLayer.extend({
      /**
       * @method reset
       * @protected
       */
      reset(newFlag) {
        if (!sjs.isEmpty(this.atlases)) {
          sjs.eachObj((v) => {
            v.removeAllChildren();
          }, this.atlases);
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
       * @method ctor
       * @constructs
       */
      ctor(options) {
        this._super(options);
        this.collisionMap= [];
        this.ops = {};
      },
      /**
       * @method operational
       * @protected
       */
      operational() {
        return this.options.running;
      },
      /**
       * @method onclicked
       * @protected
       */
      onclicked(mx,my) {
        if (this.options.running &&
            this.options.selQ.length === 0) {
          sjs.loggr.debug("selection made at pos = " + mx + "," + my);
          this.options.selQ.push({ x: mx, y: my, cell: -1 });
        }
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

        sh.factory = new sobjs.Factory(this.engine);
        this.options.running=true;
        this.options.selQ=[];

        R.forEach((z) => {
          this.engine.addSystem(new (z)(this.options), z.Priority);
        },
        [sobjs.Supervisor,
         sobjs.RowClearance,
         sobjs.Generator,
         sobjs.Movements,
         sobjs.MotionControl,
         sobjs.Rendering,
         sobjs.Resolution ]);
      },
      /**
       * @method endGame
       * @private
       */
      endGame() {
        this.options.running=false;
        this.getHUD().endGame();
      },
      /**
       * @method onNewGame
       * @private
       */
      onNewGame(mode) {
        //sh.xcfg.sfxPlay('start_game');
        this.setGameMode(mode);
        this.play(true);
      }

    });

    exports = /** @lends exports# */{
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
        const scene = new scenes.XSceneFactory([
          BackLayer,
          GameLayer,
          huds.HUDLayer ]).reify(options);

        scene.onmsg('/hud/end', (topic, msg) => {
          sh.main.endGame();
        }).
        onmsg('/hud/score/update', (topic, msg) => {
          sh.main.getHUD().updateScore(msg.score);
        }).
        onmsg('/hud/showmenu', (t,msg) => {
          scenes.showMenu();
        }).
        onmsg('/hud/replay', (t,msg) => {
          sh.main.replay();
        });

        return scene;
      }

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

