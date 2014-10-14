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

define("zotohlab/p/s/turnbase", ['zotohlab/p/gnodes',
                                'cherimoia/skarojs',
                                'zotohlab/asterix',
                                'zotohlab/asx/xcfg',
                                'zotohlab/asx/ccsx',
                                'zotohlab/asx/odin',
                                'ash-js'],

  function (gnodes, sjs, sh, xcfg, ccsx, odin, Ash) { "use strict";

    var evts= odin.Events,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    //
    var TurnBaseSystem = Ash.System.extend({

      constructor: function(options) {
        this.state= options;
        this.botTimer=null;
      },

      removeFromEngine: function(engine) {
        this.nodeList=null;
      },

      addToEngine: function(engine) {
        this.nodeList = engine.getNodeList(gnodes.BoardNode);
      },

      update: function (dt) {
        var node= this.nodeList.head;
        if (this.state.running &&
            !!node) {
          this.process(node, dt);
        }
      },

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
          if (cp && (this.state.pnum === cp.pnum)) {
            this.enqueue(sel.cell,cp.value,grid);
          }

        }
        else
        if (cp.category === csts.BOT) {
          //create some small delay...
          if (!!this.botTimer) {
            if (ccsx.timerDone(this.botTimer)) {
              var bd= bot.algo.getGameBoard();
              bd.syncState(grid.values, this.state.players[this.state.actor].value);
              var rc= bd.getFirstMove();
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

      enqueue: function(pos, value, grid) {

        if ((pos >= 0 && pos < grid.values.length) &&
            csts.CV_Z === grid.values[pos]) {

          var pnum;

          sh.fireEvent('/game/hud/timer/hide');

          if (this.state.wsock) {
            this.onEnqueue(grid,this.state.actor,pos);
          } else {
            pnum = this.state.actor===1 ? 2 : 1;
            this.state.actor = pnum;
            grid.values[pos] = value;
            if (this.state.players[pnum].category === csts.HUMAN) {
              sh.fireEvent('/game/hud/timer/show');
            }
          }

        }
      },

      onEnqueue: function(grid,pnum,cell) {
        var src= {
          color: this.state.players[pnum].color,
          value: this.state.players[pnum].value,
          grid: grid.values,
          cell: cell
        },
        evt= {
          source: JSON.stringify(src),
          type: evts.SESSION_MSG,
          code: evts.C_PLAY_MOVE
        };
        this.state.wsock.send(evt);
        this.state.actor=0;
      }


    });

    return TurnBaseSystem;

});

//////////////////////////////////////////////////////////////////////////////
//EOF





