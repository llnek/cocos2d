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
var asterix = global.ZotohLabs.Asterix;
var inv = asterix.Invaders;
var sh = asterix.Shell;
var loggr = global.ZotohLabs.logger;
var echt = global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.Invaders.MainMenu = asterix.XMainMenu.extend({
  appObj: inv
});

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
var PlayBtnCtor = asterix.XButtonFactory.define({
  animSheet: new ig.AnimationSheet(sh.imgFile('invaders','gui','play_btn.png'), 194, 58),
  size: { x: 194, y: 58 },
  clicker: function() { sh.xcfg.smac.play0(); }
});

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
sh.xcfg.game.splash = asterix.XScreenFactory.define({

  preStart: function() {
    var y = (ig.system.height - PlayBtnCtor.prototype.size.y) / 2;
    var x = (ig.system.width - PlayBtnCtor.prototype.size.x) / 2;
    this.spawnEntity(PlayBtnCtor, x, y, {});
  },

  onStart: function() {
    sh.xcfg.smac.genesis(this);
  },

  update: function() {
    this.parent();
    if (this.pressed('continue')) {
      sh.xcfg.smac.play0();
    }
  },

  init: function() {
    this.parent();
    this.start();
  },

  name: 'startscreen'

});



}).call(this);


