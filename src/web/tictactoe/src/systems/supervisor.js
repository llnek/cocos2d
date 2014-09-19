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
ttt= sh.TicTacToe;


//////////////////////////////////////////////////////////////////////////////
//
ttt.GameSupervisor = Ash.System.extend({

  constructor: function(factory,state) {
    this.factory= factory;
    this.state= state;
    return this;
  },

  removeFromEngine: function(e) {
  },

  addToEngine: function(engine) {
    var b= this.factory.createBoard(this.state.size,
                             this.state.mode,this.state);
    this.engine.addEntity(b);
  },

  update: function (dt) {
  },

  process: function(node, dt) {




  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




