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
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/odin
 * @module zotohlab/p/s/turnbase
 */
define("zotohlab/p/s/turnbase",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/odin'],

  function (pss, gnodes, sjs, sh, ccsx, odin) { "use strict";

    /** @alias module:zotohlab/p/s/turnbase */
    var exports = {          },
    evts= odin.Events,
    xcfg= sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class TurnBaseSystem
     */
    var TurnBaseSystem = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/turnbase~TurnBaseSystem
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state= options;
        this.botTimer=null;
      },

      /**
       * @memberof module:zotohlab/p/s/turnbase~TurnBaseSystem
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
        this.board=null;
      },

      /**
       * @memberof module:zotohlab/p/s/turnbase~TurnBaseSystem
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
        this.board = engine.getNodeList(gnodes.BoardNode);
      },

      /**
       * @memberof module:zotohlab/p/s/turnbase~TurnBaseSystem
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
      process: function(node, evt) {
        var ps= this.state.players,
        cp= ps[this.state.actor],
        board= node.board,
        grid= node.grid,
        bot= node.robot,
        sel= node.selection;

        //handle online play
        if (this.state.wsock) {
          //if the mouse click is from the valid user, handle it
          if (!!cp && (this.state.pnum === cp.pnum)) {
            this.enqueue(sel.cell,cp.value,grid);
          }
        }
        else
        if (cp.category === csts.BOT) {
          // for the bot, create some small delay...
          if (!!this.botTimer) {
            if (ccsx.timerDone(this.botTimer)) {
              var bd= bot.algo.getGameBoard(),
              rc;
              bd.syncState(grid.values, this.state.players[this.state.actor].value);
              rc= bd.getFirstMove();
              if (!sjs.echt(rc)) { rc = bot.algo.eval(); }
              this.enqueue(rc,cp.value,grid);
              this.botTimer=ccsx.releaseTimer(this.botTimer);
            }
          } else {
            this.botTimer = ccsx.createTimer(sh.main, 0.6);
          }
        }
        else
        if (sel.cell >= 0) {
          //possibly a valid click ? handle it
          this.enqueue(sel.cell,cp.value,grid);
        }

        sel.cell= -1;
      },

      /**
       * @private
       */
      enqueue: function(pos, value, grid) {

        if ((pos >= 0 && pos < grid.values.length) &&
            csts.CV_Z === grid.values[pos]) {

          var snd, pnum;

          sh.fire('/hud/timer/hide');

          if (this.state.wsock) {
            this.onEnqueue(grid,this.state.actor,pos);
          } else {
            if (this.state.actor === 1) {
              snd= 'x_pick';
              pnum = 2;
            } else {
              snd= 'o_pick';
              pnum = 1;
            }
            grid.values[pos] = value;
            this.state.actor = pnum;
            sh.sfxPlay(snd);
            if (this.state.players[pnum].category === csts.HUMAN) {
              sh.fire('/hud/timer/show');
            }
          }

        }
      },

      /**
       * @private
       */
      onEnqueue: function(grid,pnum,cell) {
        var src= {
          color: this.state.players[pnum].color,
          value: this.state.players[pnum].value,
          grid: grid.values,
          cell: cell
        },
        snd = pnum===1 ? 'x_pick' : 'o_pick',
        evt= {
          source: sjs.jsonfy(src),
          type: evts.MSG_SESSION,
          code: evts.PLAY_MOVE
        };
        this.state.wsock.send(evt);
        this.state.actor=0;
        sh.sfxPlay(snd);
      }


    });

    /**
     * @memberof module:zotohlab/p/s/turnbase~TurnBaseSystem
     * @property {Number} Priority
     * @static
     */
    TurnBaseSystem.Priority = pss.TurnBase;

    exports= TurnBaseSystem;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

