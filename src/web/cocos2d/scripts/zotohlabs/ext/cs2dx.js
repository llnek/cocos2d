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

(function(undef) { "use strict"; var global = this, _ = global._ ,
asterix= global.ZotohLabs.Asterix,
sh= asterix.Shell,
echt= global.ZotohLabs.echt,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.COCOS2DX = {

  checkCollide: function(a,b) {
    return a && b ? cc.rectIntersectsRect( this.bbox(a), this.bbox(b)) : false;
  },

  createTimer: function(par, tm) {
    return par.runAction(cc.DelayTime.create(tm));
  },

  timerDone: function(t) {
    return echt(t) && t.isDone();
  },

  bbox: function(sprite) {
    return new cc.Rect( this.getLeft(sprite), this.getBottom(sprite), this.getWidth(sprite),
    this.getHeight(sprite));
  },

  getScaledHeight: function(sprite) {
    return sprite.getContentSize().height * sprite.getScaleY();
  },

  getHeight: function(sprite) {
    return sprite.getContentSize().height;
  },

  getScaledWidth: function(sprite) {
    return sprite.getContentSize().width * sprite.getScaleX();
  },

  getWidth: function(sprite) {
    return sprite.getContentSize().width;
  },

  getLeft: function(sprite) {
    return sprite.getPosition().x - this.getWidth(sprite)/2;
  },

  getRight: function(sprite) {
    return sprite.getPosition().x + this.getWidth(sprite)/2;
  },

  getTop: function(sprite) {
    return sprite.getPosition().y + this.getHeight(sprite)/2;
  },

  getBottom: function(sprite) {
    return sprite.getPosition().y - this.getHeight(sprite)/2;
  },

  center: function() {
    var winSize = this.screen();
    return cc.p(winSize.width / 2, winSize.height / 2);
  },

  screen: function() {
    return cc.Director.getInstance().getWinSize();
  },

  AnchorPointCenter: new cc.Point(0.5, 0.5),
  AnchorPointTop: new cc.Point(0.5, 1),
  AnchorPointTopRight: new cc.Point(1, 1),
  AnchorPointRight: new cc.Point(1, 0.5),
  AnchorPointBottomRight: new cc.Point(1, 0),
  AnchorPointBottom: new cc.Point(0.5, 0),
  AnchorPointBottomLeft: new cc.Point(0, 0),
  AnchorPointLeft: new cc.Point(0, 0.5),
  AnchorPointTopLeft: new cc.Point(0, 1)

};



}).call(this);


