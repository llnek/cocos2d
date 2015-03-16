// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define('zotohlab/p/s/moveball', ['zotohlab/p/gnodes',
                                'cherimoia/skarojs',
                                'zotohlab/asterix',
                                'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    MovementBall = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.ballMotions = undef;
      },

      addToEngine: function(engine) {
        this.ballMotions = engine.getNodeList( gnodes.BallMotionNode)
      },

      update: function (dt) {
        var node=this.ballMotions.head;

        if (this.state.running &&
           !!node) {
          this.processBallMotions(node, dt);
        }
      },

      processBallMotions: function(node, dt) {
        var v = node.velocity,
        b= node.ball,
        rc,
        pos= b.sprite.getPosition(),
        rect= ccsx.bbox(b.sprite);

        rect.x = pos.x;
        rect.y = pos.y;

        rc=ccsx.traceEnclosure(dt,this.state.world,
                               rect,
                               v.vel);
        if (rc.hit) {
          v.vel.x = rc.vx;
          v.vel.y = rc.vy;
        } else {
        }
        b.sprite.setPosition(rc.x,rc.y);
      }

    });

    return MovementBall;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

