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

(function(undef) { "use strict"; var global=this; var _ = global._ ;

var asterix = global.ZotohLabs.Asterix;
var sh = asterix.Shell;
var ao = asterix.Asteroids;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.Asteroids.EntityAster = asterix.XEntity.extend({

  collides: ig.Entity.COLLIDES.ACTIVE,
  //collides: ig.Entity.COLLIDES.PASSIVE,
  checkAgainst: ig.Entity.TYPE.A,
  type: ig.Entity.TYPE.B,
  bounciness: 1,

  initVel: function(v) {
    this.vel.y= asterix.fns.randomSign() * v;
    this.vel.x= asterix.fns.randomSign() * v;
  },

  update: function() {
    this.parent();
    this.maybeWrapOOB();
    this.maybeRotate();
  },

  maybeRotate: function() {
    this.currentAnim.angle = asterix.fns.degToRad(this.angle);
    this.angle += 0.05;
    if (this.angle > 360) { this.angle -= 360; }
  },

  init: function(x,y,settings) {
    this.parent(x,y,settings);
    this.angle = asterix.fns.rand(360);
  }


});




}).call(this);



