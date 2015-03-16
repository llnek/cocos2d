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

define("zotohlab/p/s/resolution", ['zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    Resolution = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state = options;
      },

      removeFromEngine: function(engine) {
        this.nodeList=null;
        this.fauxs=null;
        this.balls=null;
      },

      addToEngine: function(engine) {
        this.fauxs= engine.getNodeList(gnodes.FauxPaddleNode);
        this.nodeList= engine.getNodeList(gnodes.PaddleNode);
        this.balls= engine.getNodeList(gnodes.BallNode);
        this.engine=engine;
      },

      update: function (dt) {
        var bnode = this.balls.head,
        rc;

        if (this.state.mode === sh.ONLINE_GAME) {
          return;
        }

        if (this.state.running &&
           !!bnode) {

          rc=this.checkNodes(this.nodeList, bnode);
          if (rc !== false) {
            rc=this.checkNodes(this.fauxs, bnode);
          }
        }

        return rc;
      },

      checkNodes: function(nl, bnode) {
        for (var node=nl.head; node; node=node.next) {
          var winner =this.check(node,bnode);
          if (winner) {
            this.onWin(winner);
            return false;
          }
        }
      },

      onWin: function(winner) {
        var bnode= this.balls.head;
        //sjs.loggr.debug("winner ====== " + winner);
        bnode.ball.sprite.setPosition(
          this.state.ball.x,
          this.state.ball.y);
        bnode.velocity.vel.x = this.state.ball.speed * sjs.randSign();
        bnode.velocity.vel.y = this.state.ball.speed * sjs.randSign();
        sh.fireEvent('/game/hud/score/update', { score: 1, color: winner });
      },

      //check win
      check: function(node,bnode) {
        var b= bnode.ball,
        pd= node.paddle,
        pc= pd.color,
        bp= b.sprite.getPosition();

        if (ccsx.isPortrait()) {

          if (pc === csts.P1_COLOR) {
            return bp.y < ccsx.getBottom(pd.sprite) ?
              csts.P2_COLOR : undef;
          } else {
            return bp.y > ccsx.getTop(pd.sprite) ?
              csts.P1_COLOR : undef;
          }

        } else {

          if (pc === csts.P1_COLOR) {
            return bp.x < ccsx.getLeft(pd.sprite) ?
              csts.P2_COLOR : undef;
          } else {
            return bp.x > ccsx.getRight(pd.sprite) ?
              csts.P1_COLOR : undef;
          }

        }

      }

    });

    return Resolution;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

