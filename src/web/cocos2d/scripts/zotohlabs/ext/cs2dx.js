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
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.COCOS2DX = {

  bbox: function(sprite) {
    return cc.Rect( this.leftPos(sprite), this.bottomPos(sprite), this.realWidth(sprite),
    this.realHeight(sprite));
  },

  realHeight: function(sprite) {
    return sprite.getContentSize().height * sprite.getScaleY();
  },

  realWidth: function(sprite) {
    return sprite.getContentSize().width * sprite.getScaleX();
  },

  leftPos: function(sprite) {
    return sprite.getPosition().x - this.realWidth(sprite)/2;
  },

  rightPos: function(sprite) {
    return sprite.getPosition().x + this.realWidth(sprite)/2;
  },

  topPos: function(sprite) {
    return sprite.getPosition().y + this.realHeight(sprite)/2;
  },

  bottomPos: function(sprite) {
    return sprite.getPosition().y - this.realHeight(sprite)/2;
  },

  center: function() {
    var winSize = this.screen();
    return cc.p(winSize.width / 2, winSize.height / 2);
  },

  screen: function() {
    return cc.Director.getInstance().getWinSize();
  }

};



}).call(this);


