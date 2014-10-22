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

define("zotohlab/asx/ccsx", ['cherimoia/skarojs',
                            'zotohlab/asterix'],

  function (sjs,sh) { "use strict";

    var R = sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    // monkey patch stuff that we want to extend
    //////////////////////////////////////////////////////////////////////////////
/****
    cc.Director.prototype.getSceneStackLength = function() {
      return this._scenesStack.length;
    };

    cc.Director.prototype.replaceRootScene = function(scene) {
      this.popToRootScene();
      if (this._scenesStack.length !== 1) {
        throw new Error("scene stack is screwed up");
      }
      var cur = this._scenesStack.pop();
      if (cur.isRunning()) {
        cur.onExitTransitionDidStart();
        cur.onExit();
      }
      cur.cleanup();
      this._runningScene=null;
      this._nextScene = null;
      this.runScene(scene);
    };
***/
    //////////////////////////////////////////////////////////////////////////////
    //
    var ccsx = {

      pointInBox: function (box, x, y) {
        var px, py;
        if (! sjs.echt(y)) {
          px= x.x;
          py= x.y;
        } else {
          px = x;
          py= y;
        }
        return px >= box.left && px <= box.right &&
          py >= box.bottom && py <= box.top;
      },

      //test collision of 2 entities
      collide2: function(a,b) {
        if (!a || !b) { return false; }
        var pos2 = b.sprite.getPosition(),
        pos1 = a.sprite.getPosition(),
        sz2 = b.sprite.getContentSize(),
        sz1 = a.sprite.getContentSize(),
        r2 = sz2.width/2,
        dx,dy,d2,rr,
        r1 = sz1.width/2;

        if (pos1.x > pos2.x) {
          dx = pos1.x - pos2.x;
        } else {
          dx = pos2.x - pos1.x;
        }
        if (pos1.y > pos2.y) {
          dy = pos1.y - pos2.y;
        } else {
          dy = pos2.y - pos1.y;
        }
        rr= (r2 + r1) * (r2 + r1);
        d2 = dx * dx + dy * dy;

        return d2 <= rr;
      },

      //test collision of 2 entities using cc-rects
      collide: function(a,b) {
        return a && b ? cc.rectIntersectsRect(this.bbox(a.sprite),
                                              this.bbox(b.sprite)) : false;
      },

      //test collision of 2 entities using cc-rects
      collide0: function(spriteA,spriteB) {
        return spriteA && spriteB ? cc.rectIntersectsRect(this.bbox(spriteA),
                                              this.bbox(spriteB)) : false;
      },

      isPortrait: function() {
        var s=this.screen(); return s.height > s.width;
      },

      outOfBound: function(ent) {
        var bx= this.bbox4(ent.sprite),
        wz = this.screen();
        return (bx.bottom > wz.height-1 ||
                bx.top < 0 ||
                bx.right < 0 ||
                bx.left > wz.width -1);
      },

      releaseTimer: function(par, tm) {
        if (cc.sys.isNative && !!tm) {
          tm.release();
        }
        return null;
      },

      createTimer: function(par, tm) {
        var rc= par.runAction(new cc.DelayTime(tm));
        if (cc.sys.isNative) {
          rc.retain();
        }
        return rc;
      },

      timerDone: function(t) {
        return sjs.echt(t) && t.isDone();
      },

      createSpriteFrame: function(name) {
        var rc= new cc.Sprite();
        rc.initWithSpriteFrameName(name);
        return rc;
      },

      //return a 4-point rect.
      bbox4: function(sprite) {
        return {
          bottom: this.getBottom(sprite),
          top: this.getTop(sprite),
          left: this.getLeft(sprite),
          right: this.getRight(sprite)
        };
      },

      halfHW: function(sprite) {
        var z= sprite.getContentSize();
        return [z.width * 0.5, z.height * 0.5];
      },

      //return a cc-rect
      bbox: function(sprite) {
        return cc.rect( this.getLeft(sprite), this.getBottom(sprite),
                       this.getWidth(sprite), this.getHeight(sprite));
      },

      //return rect from the last frame
      bbox4b4: function(ent) {
        return {
          bottom: this.getLastBottom(ent),
          top: this.getLastTop(ent),
          left: this.getLastLeft(ent),
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
        return sjs.echt(ent.lastPos) ? ent.lastPos.x - this.getWidth(ent.sprite)/2
                                     : this.getLeft(ent);
      },

      getLastRight: function(ent) {
        return sjs.echt(ent.lastPos) ? ent.lastPos.x + this.getWidth(ent.sprite)/2
                                     : this.getRight(ent);
      },

      getLastTop: function(ent) {
        return sjs.echt(ent.lastPos) ? ent.lastPos.y + this.getHeight(ent.sprite)/2
                                     : this.getTop(ent);
      },

      getLastBottom: function(ent) {
        return sjs.echt(ent.lastPos) ? ent.lastPos.y - this.getHeight(ent.sprite)/2
                                     : this.getBottom(ent);
      },

      centerX: function() { return this.center().x; },
      centerY: function() { return this.center().y; },
      center: function() {
        var wz = this.screen();
        return cc.p(wz.width * 0.5, wz.height * 0.5);
      },

      screenHeight: function() { return this.screen().height; },
      screenWidth: function() { return this.screen().width; },

      screen: function() {
        return cc.director.getWinSize();
        /*
        return (cc.sys.isNative) ? cc.director.getWinSize()
                                 : cc.director.getWinSizeInPixels();
                                */
      },

      //tests if entity is hitting boundaries.
      //rect.x & y are center positioned.
      traceEnclosure: function(dt,bbox,rect,vel) {
        var sz= rect.height * 0.5,
        sw= rect.width * 0.5,
        vx= vel.x,
        vy= vel.y,
        y = rect.y + dt * vel.y,
        x = rect.x + dt * vel.x,
        hit=false;

        if (y + sz > bbox.top) {
          //hitting top wall
          y = bbox.top - sz;
          vy = - vy;
          hit=true;
        }
        else
        if (y - sz < bbox.bottom) {
          //hitting bottom wall
          y = bbox.bottom + sz;
          vy = - vy;
          hit=true;
        }

        if (x + sw > bbox.right) {
          //hitting right wall
          x = bbox.right - sw;
          vx = - vx;
          hit=true;
        }
        else
        if (x - sw < bbox.left) {
          //hitting left wall
          x = bbox.left + sw;
          vx = - vx;
          hit=true;
        }

        return hit ? {
            hit: true,
            x: x,
            y: y,
            vx: vx,
            vy: vy
          } : {
            hit: false,
            x: x,
            y: y
          };
      },

      getSpriteFrame: function(frameid) {
        return cc.spriteFrameCache.getSpriteFrame(frameid);
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

      resolveElastic: function(obj1,obj2) {
        var pos2 = obj2.sprite.getPosition(),
        pos1= obj1.sprite.getPosition(),
        sz2= obj2.sprite.getContentSize(),
        sz1= obj1.sprite.getContentSize(),
        hh1= sz1.height * 0.5,
        hw1= sz1.width * 0.5,
        x = pos1.x,
        y= pos1.y,
        bx2 = this.bbox4(obj2.sprite),
        bx1 = this.bbox4(obj1.sprite);

        // coming from right
        if (bx1.left < bx2.right && bx2.right < bx1.right) {
          obj1.vel.x = Math.abs(obj1.vel.x);
          obj2.vel.x = - Math.abs(obj2.vel.x);
          x= this.getRight(obj2.sprite) + hw1;
        }
        else
        // coming from left
        if (bx1.right > bx2.left && bx1.left < bx2.left) {
          obj1.vel.x = - Math.abs(obj1.vel.x);
          obj2.vel.x = Math.abs(obj2.vel.x);
          x= this.getLeft(obj2.sprite) - hw1;
        }
        else
        // coming from top
        if (bx1.bottom < bx2.top && bx1.top > bx2.top) {
          obj1.vel.y = Math.abs(obj1.vel.y);
          obj2.vel.y = - Math.abs(obj2.vel.y);
          y= this.getTop(obj2.sprite) + hh1;
        }
        else
        // coming from bottom
        if (bx1.top > bx2.bottom && bx2.bottom > bx1.bottom) {
          obj1.vel.y = - Math.abs(obj1.vel.y);
          obj2.vel.y = Math.abs(obj2.vel.y);
          y= this.getBottom(obj2.sprite) - hh1;
        }
        else {
          return;
        }
        obj1.updatePosition(x,y);
      },

      //make a text label menu button
      tmenu1: function(options) {
        var s1= new cc.LabelBMFont(options.text, options.fontPath),
        menu,
        t1= new cc.MenuItemLabel(s1, options.selector,
                                 sjs.echt(options.target) ? options.target : undef);
        t1.setScale(options.scale || 1);
        t1.setOpacity(255 * 0.9);
        t1.setTag(1);
        menu= new cc.Menu(t1);
        menu.alignItemsVertically();
        if (options.anchor) { menu.setAnchorPoint(options.anchor); }
        if (options.pos) { menu.setPosition(options.pos); }
        if (options.visible === false) { menu.setVisible(false); }
        return menu;
      },

      //make a gfx menu button
      pmenu1: function(options) {
        var btn = new cc.Sprite(options.imgPath),
        s1 = new cc.Sprite(options.imgPath),
        d1 = new cc.Sprite(options.imgPath),
        mi,
        menu;
        if (options.selPath) {
          s1= new cc.Sprite(options.selPath);
        }
        if (options.disPath) {
          d1= new cc.Sprite(options.disPath);
        }
        mi= new cc.MenuItemSprite(btn,s1,d1,options.selector,options.target);
        mi.setScale(options.scale || 1);
        mi.setTag(1);
        menu = new cc.Menu(mi);
        menu.alignItemsVertically();
        if (options.anchor) { menu.setAnchorPoint(options.anchor); }
        if (options.pos) { menu.setPosition(options.pos); }
        if (options.visible === false) { menu.setVisible(false); }
        return menu;
      },

      bmfLabel: function(options) {
        var f= new cc.LabelBMFont(options.text, options.fontPath);
        f.setScale( options.scale || 1);
        if (options.color) { f.setColor(options.color); }
        if (options.pos) { f.setPosition(options.pos); }
        if (options.anchor) { f.setAnchorPoint(options.anchor); }
        if (options.visible === false) { f.setVisible(false); }
        f.setOpacity(0.9*255);
        return f;
      }

    };

    return ccsx;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

