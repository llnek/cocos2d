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

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @module zotohlab/asx/ccsx
 */

import sh from 'zotohlab/asx/asterix';

//////////////////////////////////////////////////////////////////////////////
let sjs= sh.skarojs,
R = sjs.ramda,
undef;

//////////////////////////////////////////////////////////////////////////////
// monkey patch stuff that we want to extend
//////////////////////////////////////////////////////////////////////////////
/*
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
*/
//////////////////////////////////////////////////////////////////////////////
/** @alias module:zotohlab/asx/ccsx */
const xbox = /** @lends xbox# */{

  /**
   * Test if this point is inside this rectangle.
   * @method
   * @param {Object} box
   * @param {Object | Number} x
   * @param {Number} y
   * @return {Boolean}
   */
  pointInBox(box, x, y) {
    let px, py;
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
   * @property {cc.Color} white
   */
  white: cc.color(255,255,255),

  /**
   * @property {cc.Color} black
   */
  black: cc.color(0,0,0),

  /**
   * Test collision of 2 entities using cc-rects.  Each entity
   * wraps a sprite object.
   * @method
   * @param {Object} a
   * @param {Object} b
   * @return {Boolean}
   */
  collide(a,b) {
    return !!a && !!b ? this.collide0(a.sprite, b.sprite) : false;
  },


  /**
   * Test collision of 2 sprites.
   * @method
   * @param {Object} spriteA
   * @param {Object} spriteB
   * @return {Boolean}
   */
  collide0(spriteA,spriteB) {
    return !!spriteA && !!spriteB ?
      cc.rectIntersectsRect(this.bbox(spriteA), this.bbox(spriteB)) : false;
  },

  /**
   * Set device resolution, policy and orientation.
   * @method
   * @param {Boolean} landscape
   * @param {Number} w
   * @param {Number} h
   * @param {Number} pcy
   */
  setdr(landscape, w, h, pcy) {
    if (landscape) {
      cc.view.setDesignResolutionSize(w, h, pcy);
    } else {
      cc.view.setDesignResolutionSize(h, w, pcy);
    }
  },

  /**
   * Test if the screen is oriented vertically.
   * @method
   * @return {Boolean}
   */
  isPortrait() {
    const s=this.screen();
    return s.height > s.width;
  },

  /**
   * Test if this entity is out of bound.
   * @method
   * @param {Object} ent
   * @param {Object} B
   * @return {Boolean}
   */
  outOfBound(ent,B) {
    return !!ent ? sh.outOfBound(this.bbox4(ent.sprite), B || this.vbox()) : false;
  },

  /**
   * Maybe release this timer.
   * @method
   * @param {Object} par
   * @param {Object} tm
   * @return null
   */
  undoTimer(par, tm) {
    if (cc.sys.isNative && !!tm) { tm.release(); }
    return null;
  },

  /**
   * Create a timer action.
   * @method
   * @param {Object} par
   * @param {Object} tm
   * @return {Object} timer action
   */
  createTimer(par, tm) {
    const rc= par.runAction(new cc.DelayTime(tm));
    if (cc.sys.isNative) {
      rc.retain();
    }
    return rc;
  },

  /**
   * Test if this timer is done.
   * @method
   * @param {Object} t
   * @return {Boolean}
   */
  timerDone(t) {
    return sjs.echt(t) && t.isDone();
  },

  /**
   * Create a sprite from its frame name.
   * @method
   * @param {String} name
   * @return {cc.Sprite}
   */
  createSprite(name) {
    const rc= new cc.Sprite();
    rc.initWithSpriteFrameName(name);
    return rc;
  },

  /**
   * Create a 4 point rectangle from this sprite.
   * @method
   * @param {cc.Sprite} sprite
   * @return {Object} rect
   */
  bbox4(sprite) {
    return {
      bottom: this.getBottom(sprite),
      top: this.getTop(sprite),
      left: this.getLeft(sprite),
      right: this.getRight(sprite)
    };
  },
  /**
   * @method runScene
   * @param {cc.Scene}
   * @param delay
   */
  runScene(ns,delay) {
    delay= delay || 0.6;
    cc.director.runScene(new cc.TransitionCrossFade(delay, ns));
  },
  /**
   * @method isTransitioning
   * @return {Boolean}
   */
  isTransitioning() {
    return cc.director.getRunningScene() instanceof
    cc.TransitionScene;
  },
  /**
   * Find size of this sprite.
   * @method csize
   * @param {String} frame
   * @return {cc.Size}
   */
  csize(frame) {
    return this.createSprite(frame).getContentSize();
  },
  /**
   * Calculate halves of width and height of this sprite.
   * @method
   * @param {cc.Sprite} sprite
   * @return {Array} [x, y]
   */
  halfHW(sprite) {
    const z= sprite.getContentSize();
    return [z.width * 0.5, z.height * 0.5];
  },

  /**
   * Create a rectangle from this sprite.
   * @method
   * @param {cc.Sprite} sprite
   * @return {cc.rect} rect
   */
  bbox(sprite) {
    return cc.rect(this.getLeft(sprite),
                   this.getBottom(sprite),
                   this.getWidth(sprite),
                   this.getHeight(sprite));
  },

  /**
   * Create a rect from the last frame.
   * @method
   * @param {Object} ent
   * @return {Object} box
   */
  bbox4b4(ent) {
    return {
      bottom: this.getLastBottom(ent),
      top: this.getLastTop(ent),
      left: this.getLastLeft(ent),
      right: this.getLastRight(ent)
    };
  },

  /**
   * Get the scaled height.
   * @method
   * @param {cc.Sprite} sprite
   * @return {Number}
   */
  getScaledHeight(sprite) {
    return sprite.getContentSize().height * sprite.getScaleY();
  },

  /**
   * Get the height.
   * @method
   * @param {cc.Sprite} sprite
   * @return {Number}
   */
  getHeight(sprite) {
    return sprite.getContentSize().height;
  },

  /**
   * Get the scaled width.
   * @method
   * @param {cc.Sprite} sprite
   * @return {Number}
   */
  getScaledWidth(sprite) {
    return sprite.getContentSize().width * sprite.getScaleX();
  },

  /**
   * Get the width.
   * @method
   * @param {cc.Sprite} sprite
   * @return {Number}
   */
  getWidth(sprite) {
    return sprite.getContentSize().width;
  },

  /**
   * Get the left pos.
   * @method
   * @param {cc.Sprite} sprite
   * @return {Number}
   */
  getLeft(sprite) {
    return sprite.getPosition().x - this.getWidth(sprite) * 0.5;
  },

  /**
   * Get the right pos.
   * @method
   * @param {cc.Sprite} sprite
   * @return {Number}
   */
  getRight(sprite) {
    return sprite.getPosition().x + this.getWidth(sprite) * 0.5;
  },

  /**
   * Get the top pos.
   * @method
   * @param {cc.Sprite} sprite
   * @return {Number}
   */
  getTop(sprite) {
    return sprite.getPosition().y + this.getHeight(sprite) * 0.5;
  },

  /**
   * Get the bottom pos.
   * @method
   * @param {cc.Sprite} sprite
   * @return {Number}
   */
  getBottom(sprite) {
    return sprite.getPosition().y - this.getHeight(sprite) * 0.5;
  },

  /**
   * Maybe get the previous left pos.
   * @method
   * @param {Object} ent
   * @return {Number}
   */
  getLastLeft(ent) {
    if ( sjs.echt(ent.lastPos)) {
      return ent.lastPos.x - this.getWidth(ent.sprite) * 0.5;
    } else {
      return this.getLeft(ent);
    }
  },

  /**
   * Maybe get the previous right pos.
   * @method
   * @param {Object} ent
   * @return {Number}
   */
  getLastRight(ent) {
    if ( sjs.echt(ent.lastPos)) {
      return ent.lastPos.x + this.getWidth(ent.sprite) * 0.5;
    } else {
      return this.getRight(ent);
    }
  },

  /**
   * Maybe get the previous top pos.
   * @method
   * @param {Object} ent
   * @return {Number}
   */
  getLastTop(ent) {
    if ( sjs.echt(ent.lastPos)) {
      return ent.lastPos.y + this.getHeight(ent.sprite) * 0.5;
    } else {
      return this.getTop(ent);
    }
  },

  /**
   * Maybe get the previous bottom pos.
   * @method
   * @param {Object} ent
   * @return {Number}
   */
  getLastBottom(ent) {
    if ( sjs.echt(ent.lastPos)) {
      return ent.lastPos.y - this.getHeight(ent.sprite) * 0.5;
    } else {
      return this.getBottom(ent);
    }
  },

  /**
   * Get the x pos of the center of the visible screen.
   * @method
   * @return {Number}
   */
  centerX() { return this.center().x; },

  /**
   * Get the y pos of the center of the visible screen.
   * @method
   * @return {Number}
   */
  centerY() { return this.center().y; },

  /**
   * Get the center of the visible screen.
   * @method
   * @return {cc.Point}
   */
  center() {
    const rc = this.vrect();
    return cc.p( rc.x + rc.width * 0.5, rc.y + rc.height * 0.5);
  },

  /**
   * Get the screen height.
   * @method
   * @return {Number}
   */
  screenHeight() { return this.screen().height; },

  /**
   * Get the screen width.
   * @method
   * @return {Number}
   */
  screenWidth() { return this.screen().width; },

  /**
   * Get the visible screen rectangle.
   * @method
   * @return {Object} cc.rect
   */
  vrect() {
    const vr= cc.view.getViewPortRect(),
    vo = cc.view.getVisibleOrigin(),
    wz= cc.view.getVisibleSize();
    return cc.rect(vo.x, vo.y, wz.width, wz.height);
  },

  /**
   * Get the visible screen box.
   * @method
   * @return {Object} rectangle box.
   */
  vbox() {
    const vr= cc.view.getViewPortRect(),
    vo = cc.view.getVisibleOrigin(),
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
   * @method
   * @return {cc.Size}
   */
  screen() {
    return cc.sys.isNative ? cc.view.getFrameSize()
                           : cc.director.getWinSize();
  },

  /**
   * Get the actual screen center.
   * @method
   * @return {cc.Point}
   */
  scenter() {
    const sz = this.screen();
    return cc.p(sz.width * 0.5, sz.height * 0.5);
  },

  /**
   * Get the center of this box.
   * @method
   * @param {Object} box
   * @return {cc.Point}
   */
  vboxMID(box) {
    return cc.p(box.left + (box.right-box.left) * 0.5,
                box.bottom + (box.top-box.bottom) * 0.5);
  },

  /**
   * Test if this box is hitting boundaries.
   * rect.x & y are center positioned.
   *
   * If hit, the new position and velocities
   * are returned.
   * @method
   * @param {Number} dt  delta time
   * @param {Object} bbox
   * @param {Oject} rect
   * @param {Object} vel velocity for [x,y]
   * @return {Object}
   */
  traceEnclosure(dt,bbox,rect,vel) {
    let sz= rect.height * 0.5,
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
   * @method getSprite
   * @param {String} frameid
   * @return {cc.Sprite}
   */
  getSprite(frameid) {
    return cc.spriteFrameCache.getSpriteFrame(frameid);
  },

  /**
   * @method hasKeyPad
   * @return {Boolean}
   */
  hasKeyPad() {
    return !!cc.sys.capabilities['keyboard'] && !cc.sys.isNative;
  },

  /**
   * @method onKeyPolls
   */
  onKeyPolls(kb) {
    if (!this.hasKeyPad()) {return;}
    cc.eventManager.addListener({
      onKeyPressed(key, e) {
        kb[key]=true;
      },
      onKeyReleased(key, e) {
        kb[key]=false;
      },
      event: cc.EventListener.KEYBOARD
    }, sh.main);
  },

  /**
   * @method onKeys
   */
  onKeys(bus) {
    if (!this.hasKeyPad()) {return;}
    cc.eventManager.addListener({
      onKeyPressed(key, e) {
        bus.fire('/key/down', {group: 'key', key: key, event: e});
      },
      onKeyReleased(key, e) {
        bus.fire('/key/up', {group: 'key', key: key, event: e});
      },
      event: cc.EventListener.KEYBOARD
    }, sh.main);
  },

  /**
   * @method hasMouse
   * @return {Boolean}
   */
  hasMouse() {
    return !!cc.sys.capabilities['mouse'];
  },

  onMouse(bus) {
    if (!this.hasMouse()) {return;}
    cc.eventManager.addListener({
      onMouseMove(e) {
        if (e.getButton() === cc.EventMouse.BUTTON_LEFT) {
          bus.fire('/mouse/move', {group:'mouse',
                   loc: e.getLocation(),
                   delta: e.getDelta(),
                   event: e});
        }
      },
      onMouseDown(e) {
        bus.fire('/mouse/down', {group:'mouse',
                 loc: e.getLocation(),
                 event: e});
      },
      onMouseUp(e) {
        bus.fire('/mouse/up', {group:'mouse',
                 loc: e.getLocation(),
                 event: e});
      },
      event: cc.EventListener.MOUSE
    }, sh.main);
  },

  /**
   * @method hasTouch
   * @return {Boolean}
   */
  hasTouch() {
    return !!cc.sys.capabilities['touches'];
  },

  onTouchAll(bus) {
    if (!this.hasTouch()) {return;}
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ALL_AT_ONCE,
      prevTouchId: -1,
      onTouchesBegan(ts,e) { return true; },
      onTouchesEnded(ts,e) {
        bus.fire('/touch/all/end', {group:'touch',
                   event: e,
                   loc: ts[0].getLocation()});
      },
      onTouchesMoved(ts,e) {
        const id = ts[0].id;
        if (this.prevTouchId != id) {
          this.prevTouchId = id;
        } else {
          bus.fire('/touch/all/move', {group:'touch',
                   event: e,
                   delta: ts[0].getDelta()});
        }
      }
    }, sh.main);
  },

  onTouchOne(bus) {
    if (!this.hasTouch()) {return;}
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan(t,e) { return true; },
      onTouchMoved(t,e) {
        bus.fire('/touch/one/move', {group:'touch',
                 event: e,
                 delta: t.getDelta(),
                 loc: t.getLocation()});
      },
      onTouchEnded(t,e) {
        bus.fire('/touch/one/end', {group:'touch',
                 event: e,
                 loc: t.getLocation()});
      }
    }, sh.main);
  },

  /**
   * @property {Object} acs Anchor Points
   */
  acs : {
    Center: cc.p(0.5, 0.5),
    Top: cc.p(0.5, 1),
    TopRight: cc.p(1, 1),
    Right: cc.p(1, 0.5),
    BottomRight: cc.p(1, 0),
    Bottom: cc.p(0.5, 0),
    BottomLeft: cc.p(0, 0),
    Left: cc.p(0, 0.5),
    TopLeft: cc.p(0, 1)
  },

  /**
   * not used for now.
   * @private
   */
  resolveElastic(obj1,obj2) {
    let pos2 = obj2.sprite.getPosition(),
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
   * @method
   * @param {Array} items
   * @param {Number} scale
   * @return {cc.Menu}
   */
  tmenu(items,scale) {
    let menu= new cc.Menu(),
    mi,
    t=0,
    obj;

    for (let n=0; n < items.length; ++n) {
      obj= items[n];
      mi= new cc.MenuItemLabel(new cc.LabelBMFont(obj.text,
                                                  obj.fontPath),
                               obj.selector || obj.cb,
                               obj.target);
      mi.setOpacity(255 * 0.9);
      mi.setScale(scale || 1);
      mi.setTag(++t);
    }
    return menu;
  },

  /**
   * Make a text label menu containing one single button.
   * @method
   * @param {Object} options
   * @return {cc.Menu}
   */
  tmenu1(options) {
    let menu = this.tmenu(options);
    if (options.anchor) { menu.setAnchorPoint(options.anchor); }
    if (options.pos) { menu.setPosition(options.pos); }
    if (options.visible === false) { menu.setVisible(false); }
    menu.alignItemsVertically();
    return menu;
  },

  /**
   * Create a vertically aligned menu with graphic buttons.
   * @method
   * @param {Array} items
   * @param {Object} options
   * @return {cc.Menu}
   */
  vmenu(items, options) {
    const hint=options || {},
    m= this.pmenu(true,
                  items,
                  hint.scale,
                  hint.padding);
    if (!!hint.pos) {
      m.setPosition(hint.pos);
    }
    return m;
  },

  /**
   * Create a horizontally aligned menu with graphic buttons.
   * @method
   * @param {Array} items
   * @param {Object} options
   * @return {cc.Menu}
   */
  hmenu(items, options) {
    const hint= options || {},
    m= this.pmenu(false,
                  items,
                  hint.scale,
                  hint.padding);
    if (!!hint.pos) {
      m.setPosition(hint.pos);
    }
    return m;
  },

  /**
   * Create a menu with graphic buttons.
   * @method
   * @param {Boolean} vertical
   * @param {Array} items
   * @param {Number} scale
   * @param {Number} padding
   * @return {cc.Menu}
   */
  pmenu(vertical, items, scale, padding) {
    let menu = new cc.Menu(),
    obj,
    mi,
    t=0;

    for (let n=0; n < items.length; ++n) {
      obj=items[n];
      mi= new cc.MenuItemSprite(new cc.Sprite(obj.nnn),
                                new cc.Sprite(obj.sss || obj.nnn),
                                new cc.Sprite(obj.ddd || obj.nnn),
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
   * @method
   * @param {Object} options
   * @return {cc.Menu}
   */
  pmenu1(options) {
    const menu = this.pmenu(true, [options]);
    if (options.anchor) { menu.setAnchorPoint(options.anchor); }
    if (options.pos) { menu.setPosition(options.pos); }
    if (options.visible === false) { menu.setVisible(false); }
    return menu;
  },

  /**
   * Create a Label.
   * @method
   * @param {Object} options
   * @return {cc.LabelBMFont}
   */
  bmfLabel(options) {
    let f= new cc.LabelBMFont(options.text, options.fontPath);
    if (options.color) { f.setColor(options.color); }
    if (options.pos) { f.setPosition(options.pos); }
    if (options.anchor) { f.setAnchorPoint(options.anchor); }
    if (options.visible === false) { f.setVisible(false); }
    f.setScale( options.scale || 1);
    f.setOpacity(0.9*255);
    return f;
  }

};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/

//////////////////////////////////////////////////////////////////////////////
//EOF

