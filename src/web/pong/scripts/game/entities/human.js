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
var png = asterix.Pong;
var sh = asterix.Shell;
var echt= global.ZotohLabs.echt;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
png.EntityHuman = png.EntityPaddle.extends({

  update: function() {
    var bottom = this.sprite.y + this.sprite.height/2;
    var top = this.sprite.y - this.sprite.height/2;
    var csts= sh.xcfg.csts;
    var vy= undef;
    var kb= sh.main.input.keyboard;

    sh.main.physics.arcade.collide(this.sprite, this.screen.boundary);
    this.sprite.body.velocity.y = 0;

    if (kb.isDown(Phaser.Keyboard.DOWN) && ! kb.isDown(Phaser.Keyboard.UP)) {
      vy = this.speed;
    }
    if (kb.isDown(Phaser.Keyboard.UP) && ! kb.isDown(Phaser.Keyboard.DOWN)) {
      vy = - this.speed;
    }

    if (vy) {
      this.sprite.body.velocity.y = vy;
    }
  },

  ctor: function(x,y,options) {
    options=options || {};
    options.key = 'gamelevel1.images.paddle1';
    this.parent(x,y,options);
  }


});




}).call(this);


