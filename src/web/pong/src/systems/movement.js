// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define("zotohlab/p/s/movements", ['zotohlab/p/gnodes',
                                 'cherimoia/skarojs',
                                 'zotohlab/asterix',
                                 'zotohlab/asx/ccsx',
                                 'zotohlab/asx/odin'],

  function (gnodes, sjs, sh, ccsx, odin) { "use strict";

    var evts= odin.Events,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    MovementSystem = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state = options;
      },

      removeFromEngine: function(engine) {
        this.fauxpads= null;
        this.paddles=null;
        this.balls= null;
      },

      addToEngine: function(engine) {
        this.fauxs= engine.getNodeList(gnodes.FauxPaddleNode);
        this.paddles= engine.getNodeList(gnodes.PaddleNode);
        this.balls= engine.getNodeList(gnodes.BallNode);
      },

      update: function (dt) {
        var bnode= this.balls.head,
        node;

        if (this.state.running &&
            !!bnode) {

          for (node= this.paddles.head; node; node=node.next) {
            this.process(node, dt);
          }

          for (node= this.fauxs.head; node; node=node.next) {
            if (node.player.category === csts.BOT) {
              this.moveRobot(node, bnode, dt);
            }
            else
            if (node.player.category === csts.NETP) {
              this.simuMove(node, bnode, dt);
            }
          }

          this.processBall(bnode, dt);
        }
      },

      simuMove: function(node, bnode, dt) {
        var hw2 = ccsx.halfHW(node.paddle.sprite),
        pos = node.paddle.sprite.getPosition(),
        world= this.state.world,
        lastpos= node.lastpos,
        x= undef,
        y= undef,
        delta= dt * this.state.paddle.speed;

        if (lastpos.lastDir > 0) {
          if (ccsx.isPortrait()) {
            x = pos.x + delta;
          } else {
            y = pos.y + delta;
          }
        }
        else
        if (lastpos.lastDir < 0) {
          if (ccsx.isPortrait()) {
            x = pos.x - delta;
          } else {
            y = pos.y - delta;
          }
        }

        if (sjs.echt(x)) {
          node.paddle.sprite.setPosition(x,pos.y);
          this.clamp(node.paddle.sprite);
        }
        if (sjs.echt(y)) {
          node.paddle.sprite.setPosition(pos.x,y);
          this.clamp(node.paddle.sprite);
        }
      },

      //TODO: better AI please
      moveRobot: function(node, bnode, dt) {
        var bp= bnode.ball.sprite.getPosition(),
        pos = node.paddle.sprite.getPosition(),
        speed= this.state.paddle.speed,
        velo = bnode.velocity,
        y= undef,
        x= undef;

        if (ccsx.isPortrait()) {

          if (bp.x > pos.x) {
            if (velo.vel.x > 0) {
              x = pos.x + dt * speed;
            }
          } else {
            if (velo.vel.x < 0) {
              x = pos.x - dt * speed;
            }
          }

        } else {

          if (bp.y > pos.y) {
            if (velo.vel.y > 0) {
              y = pos.y + dt * speed;
            }
          } else {
            if (velo.vel.y < 0) {
              y = pos.y - dt * speed;
            }
          }

        }

        if (sjs.echt(x)) {
          node.paddle.sprite.setPosition(x,pos.y);
          this.clamp(node.paddle.sprite);
        }

        if (sjs.echt(y)) {
          node.paddle.sprite.setPosition(pos.x,y);
          this.clamp(node.paddle.sprite);
        }
      },

      processBall: function(node, dt) {
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
        b.sprite.setPosition(rc.x, rc.y);
      },

      process: function(node, dt) {
        var p= node.paddle,
        s= p.speed * dt,
        m= node.motion,
        nv, x,y,
        ld = node.lastpos.lastDir,
        lp = node.lastpos.lastP,
        pos= p.sprite.getPosition();

        if (m.right) {
          if (ccsx.isPortrait()) {
            x = pos.x + s;
            y = pos.y;
          } else {
            y = pos.y + s;
            x= pos.x;
          }
          p.sprite.setPosition(x,y);
        }

        if (m.left) {
          if (ccsx.isPortrait()) {
            x = pos.x - s;
            y = pos.y;
          } else {
            y = pos.y - s;
            x= pos.x;
          }
          p.sprite.setPosition(x,y);
        }

        m.right = false;
        m.left= false;

        this.clamp(p.sprite);

        // below is really for wsock stuff

        if (ccsx.isPortrait()) {
          nv = p.sprite.getPosition().x;
        } else {
          nv = p.sprite.getPosition().y;
        }

        var delta= Math.abs(nv - lp),
        dir=0;
        if (delta >= 1) {
          if (nv > lp) {
            dir=1;
            // moving up or right
          } else if (nv < lp) {
            dir= -1;
          }
        }
        node.lastpos.lastP=nv;
        if (ld !== dir) {
          if(this.state.wsock) { this.notifyServer(node,dir); }
          node.lastpos.lastDir=dir;
        }
      },

      // inform the server that paddle has changed direction: up , down or stopped.
      notifyServer: function(node, direction) {
        var vv = direction * this.state.paddle.speed,
        pos = node.paddle.sprite.getPosition(),
        pnum= this.state.pnum,
        src,
        cmd = {
          x: Math.floor(pos.x),
          y: Math.floor(pos.y),
          dir: direction,
          pv: vv
        };
        if (pnum === 2) {
          src = { p2: cmd };
        } else {
          src = { p1: cmd };
        }
        this.state.wsock.send({
          source: JSON.stringify(src),
          type: evts.SESSION_MSG,
          code: evts.C_PLAY_MOVE
        });
      },

      clamp: function(sprite) {
        var pos= sprite.getPosition(),
        world= this.state.world,
        x= undef,
        y= undef,
        hw2= ccsx.halfHW(sprite),
        bb4= ccsx.bbox4(sprite);

        if (ccsx.isPortrait()) {
          if (bb4.right > world.right) {
            x = world.right - hw2[0];
          }
          if (bb4.left < world.left) {
            x = world.left + hw2[0];
          }
        } else {
          if (bb4.top > world.top) {
            y = world.top - hw2[1];
          }
          if (bb4.bottom < world.bottom) {
            y = world.bottom + hw2[1];
          }
        }

        if (sjs.echt(x)) {
          sprite.setPosition(x, pos.y);
        }

        if (sjs.echt(y)) {
          sprite.setPosition(pos.x, y);
        }
      }

    });

    return MovementSystem;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

