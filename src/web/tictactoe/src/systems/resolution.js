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
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/resolution
 */
define("zotohlab/p/s/resolution",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/resolution */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class ResolutionSystem
     */
    var ResolutionSystem = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/resolution~ResolutionSystem
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~ResolutionSystem
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
        this.board=null;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~ResolutionSystem
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
        this.board = engine.getNodeList(gnodes.BoardNode);
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~ResolutionSystem
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        var node= this.board.head;
        if (this.state.running &&
            !!node) {
          this.process(node, dt);
        }
      },

      /**
       * @private
       */
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

      /**
       * @private
       */
      doWin: function(node, winner, combo) {
        sh.fire('/hud/score/update',
                {color: winner.color,
                 score: 1});
        this.doDone(node, winner, combo);
      },

      /**
       * @private
       */
      doDraw: function(node) {
        this.doDone(node, null, []);
      },

      /**
       * @private
       */
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

        sh.fire('/hud/score/update',
                {color: win.color,
                 score: 1});

        //gray out the losing icons
        R.forEachIndexed(function(z, n) {
          if (!!z && z[4] === v2) {
            layer.removeItem(z[0]);
            z[0] = utils.drawSymbol(node.view, z[1], z[2], z[3]+2);
          }
        }.bind(this), cs);

        this.doDone(node, win, null);
      },

      /**
       * Flip all other icons except for the winning ones.
       * @private
       */
      showWinningIcons: function(view, combo) {
        var layer= view.layer,
        cs = view.cells;

        if (combo===null) { return; }

        R.forEachIndexed(function(z, n) {
          if (! R.contains(n, combo)) { if (!!z && z[3] !== csts.CV_Z) {
            layer.removeAtlasItem('markers', z[0]);
            z[0] = utils.drawSymbol(view, z[1], z[2], z[3], true);
          } }
        }.bind(this), cs);
      },

      /**
       * @private
       */
      doDone: function(node, pobj, combo) {

        var pnum = !!pobj ? pobj.pnum : 0;

        this.showWinningIcons(node.view, combo);
        sh.fire('/hud/timer/hide');
        sh.sfxPlay('game_end');
        sh.fire('/hud/end', { winner: pnum });

        this.state.lastWinner = pnum;
        this.state.running=false;
      },

      /**
       * @private
       */
      checkDraw: function(values) {
        return ! (csts.CV_Z === R.find(function(v) {
          return (v === csts.CV_Z);
        }, values));
      },

      /**
       * @private
       */
      checkWin: function(actor, game) {
        //sjs.loggr.debug('checking win for ' + actor.color);
        var combo, rc= R.any(function(r) {
          combo=r;
          return R.all(function(n) {
            return actor.value === n;
          },
          R.map(function(i) { return game[i]; }, r));
        },
        this.state.GOALSPACE);

        return rc ? combo : null;
      }

    });

    /**
     * @memberof module:zotohlab/p/s/resolution~ResolutionSystem
     * @property {Number} Priority
     * @static
     */
    ResolutionSystem.Priority= pss.Resolve;

    exports= ResolutionSystem;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

