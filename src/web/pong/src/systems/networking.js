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

define("zotohlab/p/s/networking", ['zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    NetworkSystem = sh.Ashley.sysDef({

      constructor: function(options) {
        this.netQ= options.netQ;
        this.state = options;
      },

      removeFromEngine: function(engine) {
        this.paddles= null;
        this.balls= null;
        this.fauxs= null;
      },

      addToEngine: function(engine) {
        this.paddles= engine.getNodeList(gnodes.PaddleNode);
        this.balls= engine.getNodeList(gnodes.BallNode);
        this.fauxs= engine.getNodeList(gnodes.FauxPaddleNode);
      },

      update: function (dt) {
        if (this.netQ.length > 0) {
          return this.onEvent(this.netQ.shift());
        }
      },

      syncScores: function(scores) {
        var actors= this.state.players,
        rc= {};
        rc[actors[2].color] = scores.p2;
        rc[actors[1].color] = scores.p1;
        sh.fireEvent('/game/hud/score/sync', { points: rc});
      },

      onEvent: function(evt) {

        sjs.loggr.debug("onEvent: => " + JSON.stringify(evt.source));

        var actors= this.state.players,
        win,
        node,
        ok= true;

        if (sjs.isObject(evt.source.winner)) {
          win= actors[evt.source.winner.pnum];
          sjs.loggr.debug("server sent us new winner ==> " + win.color);
          this.syncScores(evt.source.winner.scores);
          sh.fireEvent('/game/hud/end', { winner: win.color });
        }

        if (sjs.isObject(evt.source.scores)) {
          sjs.loggr.debug("server sent us new scores !!!!");
          this.syncScores(evt.source.scores);
          // once we get a new score, we reposition the entities
          // and pause the game (no moves) until the server
          // tells us to begin a new point.
          this.reposEntities();
          ok=false;
          //this.state.poked=false;
        }

        if (sjs.isObject(evt.source.ball)) {
          sjs.loggr.debug("server says: Ball got SYNC'ED !!!");
          var c = evt.source.ball;
          node= this.balls.head;
          if (!!node) {
            node.ball.sprite.setPosition(c.x, c.y);
            node.velocity.vel.y= c.vy;
            node.velocity.vel.x= c.vx;
          }
        }

        this.syncPaddles(this.paddles, evt);
        this.syncPaddles(this.fauxs, evt);

        return ok;
      },

      // reset back to default position, no movements
      reposPaddles: function(nl) {
        for (var node=nl.head; node; node=node.next) {
          if (node.player.pnum ===2) {
            node.paddle.sprite.setPosition(
              this.state.p2.x,
              this.state.p2.y
            )
            node.lastpos.lastDir=0;
          }
          if (node.player.pnum ===1) {
            node.paddle.sprite.setPosition(
              this.state.p1.x,
              this.state.p1.y
            )
            node.lastpos.lastDir=0;
          }
        }
      },

      reposEntities: function() {
        var node=this.balls.head;

        this.reposPaddles(this.paddles);
        this.reposPaddles(this.fauxs);

        if (!!node) {
          node.ball.sprite.setPosition(
            this.state.ball.x,
            this.state.ball.y
          )
          node.velocity.vel.y=0;
          node.velocity.vel.x=0;
        }
      },

      syncPaddles: function(nl, evt) {

        for (var node = nl.head; node; node=node.next) {

          if (sjs.isObject(evt.source.p2) &&
              node.player.pnum===2) {
            sjs.loggr.debug("server says: P2 got SYNC'ED !!!");
            this.syncOnePaddle(node, evt.source.p2);
          }

          if (sjs.isObject(evt.source.p1) &&
              node.player.pnum===1) {
            sjs.loggr.debug("server says: P1 got SYNC'ED !!!");
            this.syncOnePaddle(node, evt.source.p1);
          }
        }
      },

      syncOnePaddle: function(node, c) {
        var dir=0;
        node.paddle.sprite.setPosition(c.x, c.y);
        if (c.pv > 0) { dir = 1;}
        if (c.pv < 0) { dir = -1;}
        node.lastpos.lastDir = dir;
      }

    });

    return NetworkSystem;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

