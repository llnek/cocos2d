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

  collide: function(a,b) {
    return a && b ? cc.rectIntersectsRect( this.bbox(a.sprite), this.bbox(b.sprite)) : false;
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

  AnchorCenter: cc.p(0.5, 0.5),
  AnchorTop: cc.p(0.5, 1),
  AnchorTopRight: cc.p(1, 1),
  AnchorRight: cc.p(1, 0.5),
  AnchorBottomRight: cc.p(1, 0),
  AnchorBottom: cc.p(0.5, 0),
  AnchorBottomLeft: cc.p(0, 0),
  AnchorLeft: cc.p(0, 0.5),
  AnchorTopLeft: cc.p(0, 1),

  tmenu1: function(options) {
    var s1= cc.LabelBMFont.create(options.text, options.fontPath),
    menu,
    t1= cc.MenuItemLabel.create(s1, options.selector, echt(options.target) ? options.target : undef);
    t1.setOpacity(255 * 0.9);
    t1.setScale(options.scale || 1);
    t1.setTag(1);
    menu= cc.Menu.create(t1);
    menu.alignItemsVertically();
    if (options.anchor) { menu.setAnchorPoint(options.anchor); }
    if (options.pos) { menu.setPosition(options.pos); }
    if (options.visible === false) { menu.setVisible(false); }
    return menu;
  },

  pmenu1: function(options) {
    var btn = cc.Sprite.create(options.imgPath),
    menu,
    mi= cc.MenuItemSprite.create(btn, null, null, options.selector, echt(options.target) ? options.target : undef);
    mi.setScale(options.scale || 1);
    mi.setTag(1);
    menu = cc.Menu.create(mi);
    menu.alignItemsVertically();
    if (options.anchor) { menu.setAnchorPoint(options.anchor); }
    if (options.pos) { menu.setPosition(options.pos); }
    if (options.visible === false) { menu.setVisible(false); }
    return menu;
  },

  bmfLabel: function(options) {
    var f= cc.LabelBMFont.create(options.text, options.fontPath);
    f.setScale( options.scale || 1);
    if (options.color) { f.setColor(options.color); }
    if (options.pos) { f.setPosition(options.pos); }
    if (options.anchor) { f.setAnchorPoint(options.anchor); }
    if (options.visible === false) { f.setVisible(false); }
    f.setOpacity(0.9*255);
    return f;
  }

};



}).call(this);


