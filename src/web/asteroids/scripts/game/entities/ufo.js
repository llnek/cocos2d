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

(function(undef) { "use strict"; var global = this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var sh = asterix.Shell;
var ao = asterix.Asteroids;
var loggr = global.ZotohLabs.logger;
var echt = global.ZotohLabs.echt;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.Asteroids.EntityUfo = asterix.XEntity.extend({

  animSheet: new ig.AnimationSheet('media/asteroids/game/ufo.png', 36, 15),
  collides: ig.Entity.COLLIDES.ACTIVE,
  checkAgainst: ig.Entity.TYPE.BOTH,
  type: ig.Entity.TYPE.B,
  size: { x: 36, y: 15 },

  init: function(x,y,settings) {
    this.addAnim('show', 1, [0]);
    this.parent(x,y,settings);
  }

});



}).call(this);





