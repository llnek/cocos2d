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

define("zotohlab/p/s/supervisor", ['zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx',
                                  'zotohlab/asx/odin'],

  function (gnodes, sjs, sh, ccsx, odin) { "use strict";

    var evts= odin.Events,
    xcfg=sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    var GameSupervisor = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
        this.inited=false;
      },

      removeFromEngine: function(engine) {
        this.board=null;
      },

      addToEngine: function(engine) {
        engine.addEntity(sh.factory.createBoard(sh.main,
                                                this.state));
        this.board= engine.getNodeList(gnodes.BoardNode);
      },

      update: function (dt) {
        var node= this.board.head;
        if (this.state.running &&
            !!node) {
          if (! this.inited) {
            this.onceOnly(node, dt);
            this.inited=true;
          } else {
            this.process(node,dt);
          }
        }
      },

      onceOnly: function(node,dt) {

        if (this.state.wsock) {
          // online play
          sjs.loggr.debug("reply to server: session started ok");
          this.state.wsock.send({
            type: evts.SESSION_MSG,
            code: evts.C_STARTED
          });
          this.state.actor= 0;
        } else {
          //randomly pick a player to start the game.
          var pnum = sjs.randSign() > 0 ? 1 : 2;
          this.state.actor=pnum;
          if (this.state.players[pnum].category === csts.HUMAN) {
            sh.fireEvent('/game/hud/timer/show');
          }
          else
          if (this.state.players[pnum].category === csts.BOT) {
          }
        }
      },

      process: function(node,dt) {

        var active = this.state.running,
        actor = this.state.actor;

        if (!active) {
          actor= this.state.lastWinner;
        }

        sh.fireEvent('/game/hud/update', {
          running: active,
          pnum: actor
        });
      }

    });

    return GameSupervisor;

});


//////////////////////////////////////////////////////////////////////////////
//EOF





