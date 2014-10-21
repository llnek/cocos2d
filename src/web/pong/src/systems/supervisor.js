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

define("zotohlab/p/s/supervisor", ['cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx',
                                  'zotohlab/asx/odin'],

  function (sjs, sh, ccsx, odin) { "use strict";

    var evts= odin.Events,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    GameSupervisor = sh.Ashley.sysDef({

      constructor: function(options) {
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
        } else {
        }
        return this.state.wsock ? this.state.poked : true;
      },

      onceOnly: function() {
        var world = this.state.world,
        cw= ccsx.center(),
        wz= ccsx.screen(),
        ps = this.initPaddleSize(),
        bs = this.initBallSize(),
        // position of paddles
        // portrait
        p1y = Math.floor(world.bottom + bs.height + sh.hh(ps)),
        p2y = Math.floor(world.top - bs.height - sh.hh(ps)),
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
            source: JSON.stringify(src),
            type: evts.SESSION_MSG,
            code: evts.C_STARTED
          });
        }

      },

      initPaddleSize: function() {
        var dummy, id;
        if (ccsx.isPortrait()) {
          id='gamelevel1.images.p.paddle1';
        } else {
          id='gamelevel1.images.l.paddle1';
        }
        return new cc.Sprite(sh.getImagePath(id)).getContentSize();
      },

      initBallSize: function() {
        var dummy= new cc.Sprite(sh.getImagePath('gamelevel1.images.ball'));
        return dummy.getContentSize();
      }

    });

    return GameSupervisor;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

