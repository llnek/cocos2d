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

(function (undef){ "use strict"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
ccsx= asterix.CCS2DX,
sjs= global.SkaroJS,
sh= asterix,
ttt= sh.TicTacToe,
utils= ttt.SystemUtils;



//////////////////////////////////////////////////////////////////////////////
//
ttt.ResolutionSystem = Ash.System.extend({

  constructor: function(options) {
    this.state= options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.nodeList = engine.getNodeList(ttt.BoardNode);
  },

  update: function (dt) {
    if (this.state.running) {
      for (var node = this.nodeList.head; node; node=node.next) {
        this.process(node, dt);
      }
    }
  },

  process: function(node, dt) {
    var values= node.grid.values,
    msg,
    result;

    if (_.find(this.state.players,function(p) {
      if (p) {
        var rc= this.checkWin(p,values);
        if (rc) {
          return result=[p,rc];
        }
      }
    },this)) {
      this.doWin(node, result[0],result[1]);
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
    var cells = node.view.cells,
    v2= -1,
    layer= node.view.layer;

    if (tv) {
      v2 = tv.value;
    }

    sh.fireEvent('/game/hud/score/update',
                 {color: win.color,
                  score: 1});

    //gray out the losing icons
    _.each(cells, function(z,n) {
      if (z && z[4] === v2) {
        layer.removeItem(z[0]);
        z[0] = utils.drawSymbol(node.view, z[1],z[2],z[3]+2);
      }
    }, this);

    this.doDone(node,win,null);
  },

  // flip all other icons except for the winning ones.
  showWinningIcons: function(view, combo) {
    var cells = view.cells,
    layer= view.layer;

    if (combo===null) { return; }

    _.each(cells, function(z,n) {
      if (! _.contains(combo,n)) { if (z) {
        layer.removeItem(z[0]);
        z[0] = utils.drawSymbol(view, z[1],z[2],z[3]+2);
      } }
    }, this);
  },

  doDone: function(node, pobj,combo) {

    this.showWinningIcons(node.view, combo);
    sh.fireEvent('/game/hud/timer/hide');
    sh.sfxPlay('game_end');
    sh.fireEvent('/game/hud/end');

    this.state.lastWinner = pobj ? pobj.pnum : null;
    this.state.running=false;
  },

  checkDraw: function(values) {
    return ! (0 === _.find(values,function(v) {
      return (v === sh.xcfg.csts.CV_Z);
    }));
  },

  checkWin: function(actor, game) {
    //sjs.loggr.debug('checking win for ' + actor.color);
    var combo,
    rc= _.some(this.state.GOALSPACE, function(r) {
      combo=r;
      return _.every(_.map(r, function(i) {
        return game[i];
      }), function(n) {
        return actor.value === n;
      });
    });
    return rc ? combo : null;
  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




