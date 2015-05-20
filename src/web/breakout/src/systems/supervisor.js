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
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/supervisor
 */
define('zotohlab/p/s/supervisor',

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/supervisor */
    var exports= {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
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
        }
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method initBrickSize
       */
      initBrickSize: function() {
        this.state.candySize= ccsx.createSpriteFrame('red_candy.png').getContentSize();
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method initBallSize
       */
      initBallSize: function() {
        this.state.ballSize= ccsx.createSpriteFrame('ball.png').getContentSize();
      },

      /**
       * @private
       */
      onceOnly: function() {
        this.initBrickSize();
        this.initBallSize();
        sh.factory.createBricks();
        sh.factory.createPaddle();
        sh.factory.createBall();
      }

    });

    exports= GameSupervisor;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

