// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @module zotohlab/asx/ccsx
 */
define("zotohlab/asx/ccsx",

       ['cherimoia/skarojs',
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
    /** @alias module:zotohlab/asx/ccsx */
    var exports = {

      /**
       * Test if this point is inside this rectangle.
       *
       * @method pointInBox
       * @param {Object} box
       * @param {Object | Number} x
       * @param {Number} y
       * @return {Boolean}
       */
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

      /**
       * Test collision of 2 entities using cc-rects.  Each entity
       * wraps a sprite object.
       *
       * @method collide
       * @param {Object} a
       * @param {Object} b
       * @return {Boolean}
       */
      collide: function(a,b) {
        return a && b ? this.collide0(a.sprite, b.sprite) : false;
      },


      /**
       * Test collision of 2 sprites.
       *
       * @method collide
       * @param {Object} spriteA
       * @param {Object} spriteB
       * @return {Boolean}
       */
      collide0: function(spriteA,spriteB) {
        return spriteA && spriteB ? cc.rectIntersectsRect(this.bbox(spriteA),
                                              this.bbox(spriteB)) : false;
      },

      /**
       * Test if the screen is oriented vertically.
       *
       * @method isPortrait
       * @return {Boolean}
       */
      isPortrait: function() {
        var s=this.screen(); return s.height > s.width;
      },

      /**
       * Test if this entity is out of bound.
       *
       * @method outOfBound
       * @param {Object} ent
       * @param {Object} B
       * @return {Boolean}
       */
      outOfBound: function(ent,B) {
        return !!ent ? sh.outOfBound(this.bbox4(ent.sprite),
                                     B || this.vbox())
                                     : false;
      },

      /**
       * Maybe release this timer.
       *
       * @method releaseTimer
       * @param {Object} par
       * @param {Object} tm
       * @return null
       */
      releaseTimer: function(par, tm) {
        if (cc.sys.isNative && !!tm) {
          tm.release();
        }
        return null;
      },

      /**
       * Create a timer action.
       *
       * @method createTimer
       * @param {Object} par
       * @param {Object} tm
       * @return {Object} timer action.
       */
      createTimer: function(par, tm) {
        var rc= par.runAction(new cc.DelayTime(tm));
        if (cc.sys.isNative) {
          rc.retain();
        }
        return rc;
      },

      /**
       * Test if this timer is done.
       *
       * @method timerDone
       * @param {Object} t
       * @return {Boolean}
       */
      timerDone: function(t) {
        return sjs.echt(t) && t.isDone();
      },

      /**
       * Create a sprite from its frame name.
       *
       * @method createSpriteFrame
       * @param {String} name
       * @return {cc.Sprite}
       */
      createSpriteFrame: function(name) {
        var rc= new cc.Sprite();
        rc.initWithSpriteFrameName(name);
        return rc;
      },

      /**
       * Create a 4 point rectangle from this sprite.
       *
       * @method bbox4
       * @param {cc.Sprite} sprite
       * @return {Object} rect
       */
      bbox4: function(sprite) {
        return {
          bottom: this.getBottom(sprite),
          top: this.getTop(sprite),
          left: this.getLeft(sprite),
          right: this.getRight(sprite)
        };
      },

      /**
       * Calculate halves of width and height of this sprite.
       *
       * @method halfHW
       * @param {cc.Sprite} sprite
       * @return {Array} [x, y]
       */
      halfHW: function(sprite) {
        var z= sprite.getContentSize();
        return [z.width * 0.5, z.height * 0.5];
      },

      /**
       * Create a rectangle from this sprite.
       *
       * @method bbox
       * @param {cc.Sprite} sprite
       * @return {cc.rect} rect
       */
      bbox: function(sprite) {
        return cc.rect(this.getLeft(sprite),
                       this.getBottom(sprite),
                       this.getWidth(sprite),
                       this.getHeight(sprite));
      },

      /**
       * Create a rect from the last frame.
       *
       * @method bbox4b4
       * @param {Object} ent
       * @return {Object} box
       */
      bbox4b4: function(ent) {
        return {
          bottom: this.getLastBottom(ent),
          top: this.getLastTop(ent),
          left: this.getLastLeft(ent),
          right: this.getLastRight(ent)
        };
      },

      /**
       * Get the scaled height.
       *
       * @method getScaledHeight
       * @param {cc.Sprite} sprite
       * @return {Number}
       */
      getScaledHeight: function(sprite) {
        return sprite.getContentSize().height * sprite.getScaleY();
      },

      /**
       * Get the height.
       *
       * @method getHeight
       * @param {cc.Sprite} sprite
       * @return {Number}
       */
      getHeight: function(sprite) {
        return sprite.getContentSize().height;
      },

      /**
       * Get the scaled width.
       *
       * @method getScaledWidth
       * @param {cc.Sprite} sprite
       * @return {Number}
       */
      getScaledWidth: function(sprite) {
        return sprite.getContentSize().width * sprite.getScaleX();
      },

      /**
       * Get the width.
       *
       * @method getWidth
       * @param {cc.Sprite} sprite
       * @return {Number}
       */
      getWidth: function(sprite) {
        return sprite.getContentSize().width;
      },

      /**
       * Get the left pos.
       *
       * @method getLeft
       * @param {cc.Sprite} sprite
       * @return {Number}
       */
      getLeft: function(sprite) {
        return sprite.getPosition().x - this.getWidth(sprite)/2;
      },

      /**
       * Get the right pos.
       *
       * @method getRight
       * @param {cc.Sprite} sprite
       * @return {Number}
       */
      getRight: function(sprite) {
        return sprite.getPosition().x + this.getWidth(sprite)/2;
      },

      /**
       * Get the top pos.
       *
       * @method getTop
       * @param {cc.Sprite} sprite
       * @return {Number}
       */
      getTop: function(sprite) {
        return sprite.getPosition().y + this.getHeight(sprite)/2;
      },

      /**
       * Get the bottom pos.
       *
       * @method getBottom
       * @param {cc.Sprite} sprite
       * @return {Number}
       */
      getBottom: function(sprite) {
        return sprite.getPosition().y - this.getHeight(sprite)/2;
      },

      /**
       * Maybe get the previous left pos.
       *
       * @method getLastLeft
       * @param {Object} ent
       * @return {Number}
       */
      getLastLeft: function(ent) {
        return sjs.echt(ent.lastPos) ? ent.lastPos.x - this.getWidth(ent.sprite)/2
                                     : this.getLeft(ent);
      },

      /**
       * Maybe get the previous right pos.
       *
       * @method getLastRight
       * @param {Object} ent
       * @return {Number}
       */
      getLastRight: function(ent) {
        return sjs.echt(ent.lastPos) ? ent.lastPos.x + this.getWidth(ent.sprite)/2
                                     : this.getRight(ent);
      },

      /**
       * Maybe get the previous top pos.
       *
       * @method getLastTop
       * @param {Object} ent
       * @return {Number}
       */
      getLastTop: function(ent) {
        return sjs.echt(ent.lastPos) ? ent.lastPos.y + this.getHeight(ent.sprite)/2
                                     : this.getTop(ent);
      },

      /**
       * Maybe get the previous bottom pos.
       *
       * @method getLastBottom
       * @param {Object} ent
       * @return {Number}
       */
      getLastBottom: function(ent) {
        return sjs.echt(ent.lastPos) ? ent.lastPos.y - this.getHeight(ent.sprite)/2
                                     : this.getBottom(ent);
      },

      /**
       * Get the x pos of the center of the visible screen.
       *
       * @method centerX
       * @return {Number}
       */
      centerX: function() { return this.center().x; },

      /**
       * Get the y pos of the center of the visible screen.
       *
       * @method centerY
       * @return {Number}
       */
      centerY: function() { return this.center().y; },

      /**
       * Get the center of the visible screen.
       *
       * @method center
       * @return {cc.Point}
       */
      center: function() {
        var rc = this.vrect();
        return cc.p( rc.x + rc.width * 0.5, rc.y + rc.height * 0.5);
      },

      /**
       * Get the screen height.
       *
       * @method screenHeight
       * @return {Number}
       */
      screenHeight: function() { return this.screen().height; },

      /**
       * Get the screen width.
       *
       * @method screenWidth
       * @return {Number}
       */
      screenWidth: function() { return this.screen().width; },

      /**
       * Get the visible screen rectangle.
       *
       * @method vrect
       * @return {Object} cc.rect
       */
      vrect: function() {
        var vo = cc.view.getVisibleOrigin(),
        wz= cc.view.getVisibleSize();
        return cc.rect(vo.x, vo.y, wz.width, wz.height);
      },

      /**
       * Get the visible screen box.
       *
       * @method vbox
       * @return {Object} rectangle box.
       */
      vbox: function() {
        var vo = cc.view.getVisibleOrigin(),
        wz= cc.view.getVisibleSize();
        return {
          bottom: vo.y,
          left: vo.x,
          right: vo.x + wz.width,
          top: vo.y + wz.height
        };
      },

      /**
       * Get the actual window/frame size.
       *
       * @method screen
       * @return {cc.Size}
       */
      screen: function() {
        return cc.sys.isNative ? cc.view.getFrameSize()
                               : cc.director.getWinSize();
      },


      /**
       * Get the actual screen center.
       *
       * @method scenter
       * @return {cc.Point}
       */
      scenter: function() {
        var sz = this.screen();
        return cc.p(sz.width * 0.5, sz.height * 0.5);
      },

      /**
       * Get the center of this box.
       *
       * @method vboxMID
       * @param {Object} box
       * @return {cc.Point}
       */
      vboxMID: function(box) {
        return cc.p(box.left + (box.right-box.left) * 0.5,
                    box.bottom + (box.top-box.bottom) * 0.5);
      },

      /**
       * Test if this box is hitting boundaries.
       * rect.x & y are center positioned.
       *
       * If hit, the new position and velocities
       * are returned.
       *
       * @method traceEnclosure
       * @param {Number} dt  delta time
       * @param {Object} bbox
       * @param {Oject} rect
       * @param {Object} vel velocity for [x,y]
       * @return {Object}
       */
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

      /**
       * Get the sprite from the frame cache using
       * its id (e.g. #ship).
       *
       * @method getSpriteFrame
       * @param {String} frameid
       * @return {cc.Sprite}
       */
      getSpriteFrame: function(frameid) {
        return cc.spriteFrameCache.getSpriteFrame(frameid);
      },

      /**
       * @property AnchorCenter
       * @final
       * @type cc.Point
       */
      AnchorCenter: cc.p(0.5, 0.5),
      /**
       * @property AnchorTop
       * @final
       * @type cc.Point
       */
      AnchorTop: cc.p(0.5, 1),
      /**
       * @property AnchorTopRight
       * @final
       * @type cc.Point
       */
      AnchorTopRight: cc.p(1, 1),
      /**
       * @property AnchorRight
       * @final
       * @type cc.Point
       */
      AnchorRight: cc.p(1, 0.5),
      /**
       * @property AnchorBottomRight
       * @final
       * @type cc.Point
       */
      AnchorBottomRight: cc.p(1, 0),
      /**
       * @property AnchorBottom
       * @final
       * @type cc.Point
       */
      AnchorBottom: cc.p(0.5, 0),
      /**
       * @property AnchorBottomLeft
       * @final
       * @type cc.Point
       */
      AnchorBottomLeft: cc.p(0, 0),
      /**
       * @property AnchorLeft
       * @final
       * @type cc.Point
       */
      AnchorLeft: cc.p(0, 0.5),
      /**
       * @property AnchorTopLeft
       * @final
       * @type cc.Point
       */
      AnchorTopLeft: cc.p(0, 1),

      /**
       * not used for now.
       * @private
       */
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

      /**
       * Create a text menu containing this set of items.
       *
       * Each item has the form {:text
       * :fontPath
       * :cb
       * :target}
       *
       * @method tmenu
       * @param {Array} items
       * @param {Number} scale
       * @return {cc.Menu}
       */
      tmenu: function(items,scale) {
        var menu= new cc.Menu(),
        mi,
        t=0,
        obj, n;

        scale = scale || 1;

        for (n=0; n < items.length; ++n) {
          obj= items[n];
          mi= new cc.MenuItemLabel(new cc.LabelBMFont(obj.text,
                                                      obj.fontPath),
                                   obj.selector || obj.cb,
                                   obj.target);
          mi.setOpacity(255 * 0.9);
          mi.setScale(scale);
          mi.setTag(++t);
        }
        return menu;
      },

      /**
       * Make a text label menu containing one single button.
       *
       * @method tmenu1
       * @param {Object} options
       * @return {cc.Menu}
       */
      tmenu1: function(options) {
        var menu = this.tmenu(options);
        menu.alignItemsVertically();
        if (options.anchor) { menu.setAnchorPoint(options.anchor); }
        if (options.pos) { menu.setPosition(options.pos); }
        if (options.visible === false) { menu.setVisible(false); }
        return menu;
      },

      /**
       * Create a vertically aligned menu with graphic buttons.
       *
       * @method vmenu
       * @param {Array} items
       * @param {Number} scale
       * @param {Number} padding
       * @return {cc.Menu}
       */
      vmenu: function(items, scale, padding) {
        return this.pmenu(true, items, scale, padding);
      },

      /**
       * Create a horizontally aligned menu with graphic buttons.
       *
       * @method hmenu
       * @param {Array} items
       * @param {Number} scale
       * @param {Number} padding
       * @return {cc.Menu}
       */
      hmenu: function(items, scale, padding) {
        return this.pmenu(false, items, scale, padding);
      },

      /**
       * Create a menu with graphic buttons.
       *
       * @method pmenu
       * @param {Boolean} vertical
       * @param {Array} items
       * @param {Number} scale
       * @param {Number} padding
       * @return {cc.Menu}
       */
      pmenu: function(vertical, items, scale, padding) {
        var menu = new cc.Menu(),
        obj, n,
        mi,
        t=0;

        for (n=0; n < items.length; ++n) {
          obj=items[n];
          mi= new cc.MenuItemSprite(new cc.Sprite(obj.imgPath),
                                    new cc.Sprite(obj.imgPath),
                                    new cc.Sprite(obj.imgPath),
                                    obj.selector || obj.cb,
                                    obj.target);
          if (!!obj.color) { mi.setColor(obj.color); }
          if (!!scale) { mi.setScale(scale); }
          mi.setTag(++t);
          menu.addChild(mi);
        }

        padding = padding || 10;
        if (!vertical) {
          menu.alignItemsHorizontallyWithPadding(padding);
        } else {
          menu.alignItemsVerticallyWithPadding(padding);
        }

        return menu;
      },

      /**
       * Create a single button menu.
       *
       * @method pmenu1
       * @param {Object} options
       * @return {cc.Menu}
       */
      pmenu1: function(options) {
        var menu = this.pmenu(true, [options]);
        if (options.anchor) { menu.setAnchorPoint(options.anchor); }
        if (options.pos) { menu.setPosition(options.pos); }
        if (options.visible === false) { menu.setVisible(false); }
        return menu;
      },

      /**
       * Create a Label.
       *
       * @method bmfLabel
       * @param {Object} options
       * @return {cc.LabelBMFont}
       */
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

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

