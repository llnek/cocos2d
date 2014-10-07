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

function moduleFactory(gnodes, sjs, sh, xcfg, ccsx, odin, Ash){ "use strict";
var evts= odin.Events,
undef;

//////////////////////////////////////////////////////////////////////////////
//
var GameSupervisor = Ash.System.extend({

  constructor: function(options) {
    this.factory= options.factory;
    this.state= options;
    this.inited=false;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    var b= this.factory.createBoard(sh.main, this.state);
    engine.addEntity(b);
    this.nodeList= engine.getNodeList(gnodes.BoardNode);
  },

  update: function (dt) {
    var node= this.nodeList.head;
    if (!!node) {
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
      if (this.state.players[pnum].category === sh.xcfg.csts.HUMAN) {
        sh.fireEvent('/game/hud/timer/show');
      }
      else
      if (this.state.players[pnum].category === sh.xcfg.csts.BOT) {
      }
    }

    this.state.running=true;
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
}

//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("zotohlab/p/s/supervisor",

            ['zotohlab/p/gnodes',
             'cherimoia/skarojs',
             'zotohlab/asterix',
             'zotohlab/asx/xcfg',
             'zotohlab/asx/ccsx',
             'zotohlab/asx/odin',
             'ash-js'],

            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF





