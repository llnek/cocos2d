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
var sh= asterix.Shell;
var bo= asterix.BreakOut;
var echt= global.ZotohLabs.echt;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.BreakOut.EntityBrick = asterix.XEntity.extend({

  animSheet: new ig.AnimationSheet('media/breakout/game/bricks.png', 32,16),
  collides: ig.Entity.COLLIDES.FIXED,
  type: ig.Entity.TYPE.B,
  size: { x: 32, y: 16 },

  update: function() {
    this.parent();
  },

  collideWith: function(other, axis) {
    this.kill();
  },

  init: function(x, y, options) {
    this.parent(x, y, options);
    this.status=false;
    this.addAnim('show', 1, [ this.color]);
  }


});




}).call(this);



