// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Cherimoia, LLC. All rights reserved.

(function (undef){ "use strict"; var global = this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.XHUDLives = ig.Class.extend({

  totalLives: 0,
  curLives: 0,
  icon: null,
  font: null,

  x: 0,
  y: 0,

  direction: 1,

  reduceLives: function(howmany) {
    this.curLives = Math.max( 0, this.curLives - howmany);
  },

  getLives: function() {
    return this.curLives;
  },

  isDead: function() {
    return this.curLives <= 0;
  },

  reset:function() {
    this.curLives = this.totalLives;
  },

  update: function() {
  },

  moveTo: function(newx, newy) {
    this.x= newx;
    this.y= newy;
  },

  getPos: function() {
    return [this.x, this.y];
  },

  draw: function() {
    var x,n, gap = 2;
    x= this.x;
    for (n = 0; n < this.curLives; ++n) {
      this.icon.draw(x, this.y);
      if (this.direction > 0) {
        x += this.icon.width + gap;
      } else {
        x -= this.icon.width - gap;
      }
    }
  },

  init: function(lives) {
    if (echt(lives) && lives > 0) {
      this.totalLives= lives;
    }
    this.reset();
  }

});

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.XHUDLivesFactory = {

  create: function(conf) {
    var p= this.define(conf);
    return new (p)();
  },

  define: function(conf) {
    return asterix.XHUDLives.extend(conf);
  }

};





}).call(this);


