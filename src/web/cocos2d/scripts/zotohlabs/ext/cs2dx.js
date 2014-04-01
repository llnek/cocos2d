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

  bbox2: function(sprite) {
    return {
      top: this.getTop(sprite),
      left: this.getLeft(sprite),
      bottom: this.getBottom(sprite),
      right: this.getRight(sprite)
    };
  },

  bbox: function(sprite) {
    return new cc.Rect( this.getLeft(sprite), this.getBottom(sprite), this.getWidth(sprite),
    this.getHeight(sprite));
  },

  bboxb4: function(ent) {
    return {
      top: this.getLastTop(ent),
      left: this.getLastLeft(ent),
      bottom: this.getLastBottom(ent),
      right: this.getLastRight(ent)
    };
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

  getLastLeft: function(ent) {
    return ent.lastPos.x - this.getWidth(ent.sprite)/2;
  },

  getLastRight: function(ent) {
    return ent.lastPos.x + this.getWidth(ent.sprite)/2;
  },

  getLastTop: function(ent) {
    return ent.lastPos.y + this.getHeight(ent.sprite)/2;
  },

  getLastBottom: function(ent) {
    return ent.lastPos.y - this.getHeight(ent.sprite)/2;
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

  checkPair: function(dt,a,b) {
    this.solveCollision(dt, a, b );
  },

  solveCollision: function(dt,a,b) {
    // Did they already overlap on the X-axis in the last frame? If so,
    // this must be a vertical collision!
    var az = this.bboxb4(a),
    weak=null,
    bz = this.bboxb4(b);
    if (az.right > bz.left && az.left < bz.right) {
      // Which one is on top?
      if ( az.top > bz.top) {
        this.seperateOnYAxis(dt, a, b, weak );
      } else {
        this.seperateOnYAxis(dt, b, a, weak );
      }
      //a.collideWith( b, 'y' );
      //b.collideWith( a, 'y' );
    }
    // Horizontal collision
    else if( az.bottom < bz.top && az.top > bz.bottom) {
      // Which one is on the left?
      if( az.left < bz.left) { 
        this.seperateOnXAxis(dt, a, b, weak );
      } else {
        this.seperateOnXAxis(dt, b, a, weak );
      }
      //a.collideWith( b, 'x' );
      //b.collideWith( a, 'x' );
    }
  },

  seperateOnYAxis: function(dt,top, bottom, weak) {
    var tx = this.bbox2(top.sprite),
    bx = this.bbox2(bottom.sprite),
    nudge = - (tx.bottom - bx.top),
    tp= top.sprite.getPosition(),
    bp= bottom.sprite.getPosition();

    // We have a weak entity, so just move this one
    if( weak ) {
    }
    // Normal collision - both move
    else {
      var v2 = (top.vel.y - bottom.vel.y)/2;
      top.vel.y = -v2;
      bottom.vel.y = v2;
      var nudgeX = bottom.vel.x * dt;
      top.updatePosition( tp.x + nudgeX, tp.y - nudge/2);
      bottom.updatePosition(bp.x, bp.y + nudge/2);
    }
  },

  seperateOnXAxis: function( dt,left,right,weak) {
    var lx = this.bbox2(left.sprite),
    rx = this.bbox2(right,sprite),
    nudge = lx.right - rx.left,
    lp= left.sprite.getPosition(),
    rp= right.sprite.getPosition();

    // We have a weak entity, so just move this one
    if( weak ) {
    }
    // Normal collision - both move
    else {
      var v2 = (left.vel.x - right.vel.x)/2;
      left.vel.x = -v2;
      right.vel.x = v2;
      left.updatePosition( Math.floor( lp.x - nudge/2), lp.y);
      right.updatePosition(Math.ceil(rp.x + nudge/2), rp.y);
    }
  },


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


