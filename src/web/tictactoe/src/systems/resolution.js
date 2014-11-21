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

define("zotohlab/p/s/resolution", ['zotohlab/p/s/utils',
                                  'zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx'],

  function (utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    var ResolutionSystem = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.board=null;
      },

      addToEngine: function(engine) {
        this.board = engine.getNodeList(gnodes.BoardNode);
      },

      update: function (dt) {
        var node= this.board.head;
        if (this.state.running &&
            !!node) {
          this.process(node, dt);
        }
      },

      process: function(node, dt) {
        var values= node.grid.values,
        msg,
        rc,
        result;

        if (R.find(function(p) {
            if (p) {
              rc= this.checkWin(p,values);
              if (rc) {
                return result=[p, rc];
              }
            }
          }.bind(this), this.state.players)) {

          this.doWin(node, result[0], result[1]);
        }
        else
        if (this.checkDraw(values)) {
          this.doDraw(node);
        }
        else
        if (this.state.msgQ.length > 0) {
          msg = this.state.msgQ.shift();
          if ("forfeit" === msg) {
            this.doForfeit(node);
          }
        }
      },

      doWin: function(node, winner, combo) {
        sh.fireEvent('/game/hud/score/update',
                     {color: winner.color,
                      score: 1});
        this.doDone(node, winner, combo);
      },

      doDraw: function(node) {
        this.doDone(node, null, []);
      },

      doForfeit: function(node) {
        var other = this.state.actor===1 ? 2 : this.state.actor===2 ? 1 : 0;
        var tv = this.state.players[this.state.actor];
        var win= this.state.players[other];
        var cs = node.view.cells,
        v2= -1,
        layer= node.view.layer;

        if (tv) {
          v2 = tv.value;
        }

        sh.fireEvent('/game/hud/score/update',
                     {color: win.color,
                      score: 1});

        //gray out the losing icons
        R.forEach.idx(function(z, n) {
          if (!!z && z[4] === v2) {
            layer.removeItem(z[0]);
            z[0] = utils.drawSymbol(node.view, z[1], z[2], z[3]+2);
          }
        }.bind(this), cs);

        this.doDone(node, win, null);
      },

      // flip all other icons except for the winning ones.
      showWinningIcons: function(view, combo) {
        var layer= view.layer,
        cs = view.cells;

        if (combo===null) { return; }

        R.forEach.idx(function(z, n) {
          if (! R.contains(n, combo)) { if (z && z[3] !== csts.CV_Z) {
            layer.removeAtlasItem('markers', z[0]);
            z[0] = utils.drawSymbol(view, z[1], z[2], z[3], true);
          } }
        }.bind(this), cs);
      },

      doDone: function(node, pobj, combo) {

        var pnum = !!pobj ? pobj.pnum : 0;

        this.showWinningIcons(node.view, combo);
        sh.fireEvent('/game/hud/timer/hide');
        sh.sfxPlay('game_end');
        sh.fireEvent('/game/hud/end', { winner: pnum });

        this.state.lastWinner = pnum;
        this.state.running=false;
      },

      checkDraw: function(values) {
        return ! (csts.CV_Z === R.find(function(v) {
          return (v === csts.CV_Z);
        }, values));
      },

      checkWin: function(actor, game) {
        //sjs.loggr.debug('checking win for ' + actor.color);
        var combo, rc= R.some(function(r) {
          combo=r;
          return R.every(function(n) {
            return actor.value === n;
          },
          R.map(function(i) { return game[i]; }, r));
        },
        this.state.GOALSPACE);

        return rc ? combo : null;
      }

    });

    return ResolutionSystem;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

