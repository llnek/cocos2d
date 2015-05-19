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
 * @requires zotohlab/p/sysobjs
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/odin
 * @module zotohlab/p/s/supervisor
 */
define("zotohlab/p/s/supervisor",

       ['zotohlab/p/sysobjs',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/odin'],

  function (sobjs, sjs, sh, ccsx, odin) { "use strict";

    /** @alias module:zotohlab/p/s/supervisor */
    var exports= {},
    evts= odin.Events,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    /**
     * @class GameSupervisor
     */
    GameSupervisor = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state= options;
        this.inited=false;
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        if (! this.inited) {
          this.onceOnly();
          this.inited=true;
        } else {
        }
        return this.state.wsock ? this.state.poked : true;
      },

      /**
       * @private
       */
      onceOnly: function() {
        var world = this.state.world,
        cw= ccsx.center(),
        ps = this.initPaddleSize(),
        bs = this.initBallSize(),
        // position of paddles
        // portrait
        p1y = Math.floor(world.top * 0.1 + bs.height + sh.hh(ps)),
        p2y = Math.floor(world.top * 0.9 - bs.height - sh.hh(ps)),
        // landscape
        p2x = Math.floor(world.right - bs.width - sh.hw(ps)),
        p1x = Math.floor(world.left + bs.width + sh.hw(ps));

        // game defaults for entities and timers.
        this.state.framespersec= cc.game.config[cc.game.CONFIG_KEY.frameRate];
        this.state.syncMillis= 3000;
        this.state.paddle= {height: Math.floor(ps.height),
                 width: Math.floor(ps.width),
                 speed: Math.floor(csts.PADDLE_SPEED)};
        this.state.ball= {height: Math.floor(bs.height),
               width: Math.floor(bs.width),
               x: Math.floor(cw.x),
               y: Math.floor(cw.y),
               speed: Math.floor(csts.BALL_SPEED) };
        if (ccsx.isPortrait()) {
          this.state.p1= {y: p1y, x: Math.floor(cw.x) };
          this.state.p2= {y: p2y, x: Math.floor(cw.x) };
        } else {
          this.state.p1= {x: p1x, y: Math.floor(cw.y) };
          this.state.p2= {x: p2x, y: Math.floor(cw.y) };
        }
        this.state.numpts= csts.NUM_POINTS;

        sh.factory.createPaddles(sh.main, this.state);
        sh.factory.createBall(sh.main, this.state);

        if (this.state.wsock) {
          // online play
          sjs.loggr.debug("reply to server: session started ok");
          var src= R.pick(['framespersec',
                          'world',
                          'syncMillis',
                          'paddle',
                          'ball',
                          'p1',
                          'p2',
                          'numpts'], this.state);
          this.state.wsock.send({
            source: sjs.jsonfy(src),
            type: evts.MSG_SESSION,
            code: evts.STARTED
          });
        }

      },

      /**
       * @private
       */
      initPaddleSize: function() {
        var id = '#red_paddle.png',
        dummy;

        if (ccsx.isPortrait()) {
        } else {
        }
        return new cc.Sprite(id).getContentSize();
      },

      /**
       * @private
       */
      initBallSize: function() {
        var dummy= new cc.Sprite('#pongball.png');
        return dummy.getContentSize();
      }

    });

    /**
     * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
     * @property {Number} Priority
     * @static
     */
    GameSupervisor.Priority = sobjs.PreUpdate;

    exports= GameSupervisor;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

