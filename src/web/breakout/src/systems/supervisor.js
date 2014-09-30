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
bko= sh.BreakOut;


//////////////////////////////////////////////////////////////////////////////
//

bko.GameSupervisor = Ash.System.extend({

  constructor: function(options) {
    this.factory= options.factory;
    this.state= options;
    this.inited=false;
    return this;
  },

  removeFromEngine: function(engine) {
  },

  addToEngine: function(engine) {
  },

  update: function (dt) {
    if (! this.inited) {
      this.onceOnly();
      this.inited=true;
    } else {
      this.process();
    }
  },

  initBrickSize: function() {
    var s= new cc.Sprite();
    s.initWithSpriteFrameName('red_candy.png');
    this.state.candySize= s.getContentSize();
  },

  initBallSize: function() {
    var s= new cc.Sprite();
    s.initWithSpriteFrameName('ball.png');
    this.state.ballSize= s.getContentSize();
  },

  nceOnly: function() {
    this.initBrickSize();
    this.initBallSize();
    this.factory.createBricks();
    this.state.running=true;
  },

  process: function(node,dt) {

  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




