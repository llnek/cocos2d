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

define('zotohlab/p/s/supervisor', ['cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/xcfg',
                                  'zotohlab/asx/ccsx',
                                  'ash-js'],

  function (sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    GameSupervisor = Ash.System.extend({

      constructor: function(options) {
        this.factory= options.factory;
        this.state= options;
        this.inited=false;
      },

      removeFromEngine: function(engine) {
      },

      addToEngine: function(engine) {
      },

      update: function (dt) {
        if (! this.inited) {
          this.onceOnly();
          this.inited=true;
        }
      },

      initBrickSize: function() {
        var s= new cc.Sprite();
        s.initWithSpriteFrameName('red_candy.png');
        this.state.candySize= s.getContentSize();
      },

      initBallSize: function() {
        var s= new cc.Sprite();
        s.initWithSpriteFrameName('ball.png');
        this.state.ballSize= s.getContentSize();
      },

      onceOnly: function() {
        this.initBrickSize();
        this.initBallSize();
        this.factory.createBricks(sh.main,this.state);
        this.factory.createPaddle(sh.main,this.state);
        this.factory.createBall(sh.main,this.state);
      }

    });

    return GameSupervisor;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

