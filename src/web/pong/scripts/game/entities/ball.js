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

(function(undef) { "use strict"; var global = this; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var png= asterix.Pong;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
png.EntityBall = png.EntityXXX.extends({

  update: function() {
    //sh.main.physics.arcade.collide(this.sprite, this.screen.boundary);
  },

  create: function(screen) {
    this.parent(screen);
    this.sprite.body.velocity.x = 100 * asterix.fns.randomSign();
    this.sprite.body.velocity.y = 100 * asterix.fns.randomSign();
    this.sprite.body.bounce.setTo(1, 1);
  },

  ctor: function(x,y,options) {
    options=options || {};
    options.key = 'gamelevel1.images.ball';
    this.parent(x,y,options);
  }

});




}).call(this);


