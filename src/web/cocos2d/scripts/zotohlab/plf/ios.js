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

(function (undef) { "use strict"; var global = this; _ = global._ ,
asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

  //TODO need to have this load up iPhone specific plugin and
  // inject logic to draw controls in the game instead of as divs

sh.setGameSize('default');

if (! sh.xcfg.sound.open) {
}

if (iPhone) {
  sh.setGameSize('iphone');
}
else if (iPad) {
  sh.setGameSize('ipad');
}



}).call(this);



