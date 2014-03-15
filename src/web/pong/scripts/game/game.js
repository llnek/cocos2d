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
var png= asterix.Pong;
var sh= asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

sh.protos['Game'] = asterix.XGame.extends({

  preStart: function() {

    this.screens[ 'Splash' ] = new (asterix.StartScreen.extends({
      onplay: function() {
        sh.xcfg.smac.play0();
      }
    }))();

    this.screens[ 'MMenu' ] = new (asterix.MainMenu.extends({
    }))();

    this.screens[ 'Arena' ] = new png.GameArena();

    return this.screens['Splash'];

  }


});




}).call(this);


