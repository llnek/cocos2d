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

(function(undef) { "use stricts"; var global = this ; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.protos['Boot'] = asterix.XState.extends({

  onPreload: function () {
    this.load.image('loadingBar', 'media/phaserio/game/preloader_bar.png');
    this.load.image('zLogo', 'media/main/logos/ZotohLabs_x200.png');
  },

  onCreate: function () {
    // change this number when you need to support multi-touch.
    this.input.maxPointers = 1;

    // Phaser will automatically pause if the browser tab the game is in loses focus.
    // You can disable that here:
    this.stage.disableVisibilityChange = true;

    this.scale.maxHeight = sh.xcfg.game.size.height * sh.xcfg.game.size.scale;
    this.scale.maxWidth = sh.xcfg.game.size.width * sh.xcfg.game.size.scale;
    this.scale.minHeight = sh.xcfg.game.size.height;
    this.scale.minWidth = sh.xcfg.game.size.width;
    if (this.game.device.desktop) {
      this.scale.minHeight = this.scale.maxHeight;
      this.scale.minWidth = this.scale.maxWidth;
    } else {
      this.scale.forceLandscape = sh.xcfg.game.landscape;
    }
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);
  },

  onUpdate: function() {
    this.state.start('Splash');
  }


});



}).call(this);


