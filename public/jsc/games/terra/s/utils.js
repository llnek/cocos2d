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

"use strict"; /**
              * @requires zotohlab/asx/asterix
              * @requires zotohlab/asx/ccsx
              * @module s/utils
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0;

//////////////////////////////////////////////////////////////////////////
/** @alias module:s/utils */
var xbox = /** @lends xbox# */{
  /**
   * @method flareEffect
   * @param {Object} flare
   * @param {Function} cb
   * @param {Object} target
   */

  flareEffect: function flareEffect(flare, cb, target) {
    flare.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    flare.stopAllActions();
    flare.attr({
      y: csts.flareY,
      x: -45,
      visible: true,
      opacity: 0,
      rotation: -120,
      scale: 0.3
    });
    var opacityAnim = cc.fadeTo(0.5, 255),
        opacDim = cc.fadeTo(1, 0),
        biggerEase = cc.scaleBy(0.7, 1.2, 1.2).easing(cc.easeSineOut()),
        easeMove = cc.moveBy(0.5, cc.p(490, 0)).easing(cc.easeSineOut()),
        rotateEase = cc.rotateBy(2.5, 90).easing(cc.easeExponentialOut()),
        bigger = cc.scaleTo(0.5, 1),
        onComplete = cc.callFunc(cb, target),
        killflare = cc.callFunc(function () {
      flare.removeFromParent();
    });

    flare.runAction(cc.sequence(opacityAnim, biggerEase, opacDim, killflare, onComplete));
    flare.runAction(easeMove);
    flare.runAction(rotateEase);
    flare.runAction(bigger);
  },

  /**
   * @method btnEffect
   */
  btnEffect: function btnEffect() {
    _asterix2.default.sfxPlay('btnEffect');
  },

  /**
   * @method fireMissiles
   * @param {Object} ship
   * @param {Number} dt
   */
  fireMissiles: function fireMissiles(ship, dt) {
    var po1 = _asterix2.default.pools.Missiles,
        pos = ship.pos(),
        sz = ship.size(),
        offy = 3 + sz.height * 0.3,
        offx = 13,
        m2 = po1.getAndSet(),
        m1 = po1.getAndSet();

    if (!m1 || !m2) {
      _asterix2.default.factory.createMissiles();
    }

    if (!m1) {
      m1 = po1.getAndSet();
    }
    if (!m2) {
      m2 = po1.getAndSet();
    }

    m2.inflate({ x: pos.x - offx, y: pos.y + offy });
    m1.inflate({ x: pos.x + offx, y: pos.y + offy });
  },

  /**
   * @method bornShip
   * @param {Object} ship
   */
  bornShip: function bornShip(ship) {
    var _this = this;

    var bsp = ship.bornSprite,
        ssp = ship.sprite,
        normal = cc.callFunc(function () {
      ship.canBeAttack = true;
      bsp.setVisible(false);
      ssp.schedule(function (dt) {
        _this.fireMissiles(ship, dt);
      }, 1 / 6);
      ship.inflate();
    });

    ship.canBeAttack = false;
    bsp.scale = 8;
    bsp.setVisible(true);
    bsp.runAction(cc.scaleTo(0.5, 1, 1));

    ssp.runAction(cc.sequence(cc.delayTime(0.5), cc.blink(3, 9), normal));
  },

  /**
   * @method processTouch
   * @param {Object} ship
   * @param {cc.Point} delta
   */
  processTouch: function processTouch(ship, delta) {
    var pos = ship.pos(),
        wz = _ccsx2.default.vrect(),
        cur = cc.pAdd(pos, delta);
    cur = cc.pClamp(cur, cc.p(0, 0), cc.p(wz.width, wz.height));
    ship.setPos(cur.x, cur.y);
    cur = null;
  }
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF