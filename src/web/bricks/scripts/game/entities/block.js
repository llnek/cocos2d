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

(function (undef) { "use strict"; var global= this; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var br= asterix.Bricks;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

asterix.Bricks.EntityBlock= asterix.XEntity.extend({

  collides: ig.Entity.COLLIDES.PASSIVE,
  type: ig.Entity.TYPE.A,
  checkAgainst: ig.Entity.TYPE.NONE,

  blink: function() {
    this.currentAnim= this.anims.blink;
  },

  update: function() {
    this.parent();
  },

  draw: function() {
    this.parent();
  },

  init: function(x,y,settings) {
    this.parent(x,y,settings);
    this.animSheet= new ig.AnimationSheet( 'media/bricks/game/'+this.animID+ '.png', 16, 16 );
    this.addAnim( 'blink', 0.1, [1,0]);
    this.addAnim( 'show', 1, [0]);
    this.currentAnim= this.anims.show;
  }

});


}).call(this);


