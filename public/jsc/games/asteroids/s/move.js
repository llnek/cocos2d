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
              * @requires n/gnodes
              * @module s/move
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xcfg = _asterix2.default.xcfg,
    sjs = _asterix2.default.skarojs,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
/** * @class Move */
Move = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/move~Move
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },


  /**
   * @memberof module:s/move~Move
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.shipMotions = null;
  },


  /**
   * @memberof module:s/move~Move
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.shipMotions = engine.getNodeList(_gnodes2.default.ShipMotionNode);
  },


  /**
   * @memberof module:s/move~Move
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var _this = this;

    var ships = this.shipMotions.head,
        pos = void 0,
        x = void 0,
        y = void 0;

    if (this.state.running) {

      _asterix2.default.pools.Astros3.iter(function (a) {
        if (a.status) {
          _this.moveAstros(a, dt);
        }
      });
      _asterix2.default.pools.Astros2.iter(function (a) {
        if (a.status) {
          _this.moveAstros(a, dt);
        }
      });
      _asterix2.default.pools.Astros1.iter(function (a) {
        if (a.status) {
          _this.moveAstros(a, dt);
        }
      });

      if (!!ships) {
        this.processShipMotions(ships, dt);
      }

      _asterix2.default.pools.Missiles.iter(function (m) {
        if (m.status) {
          pos = m.pos();
          y = pos.y + dt * m.vel.y * m.speed;
          x = pos.x + dt * m.vel.x * m.speed;
          m.setPos(x, y);
        }
      });

      _asterix2.default.pools.Lasers.iter(function (b) {
        if (b.status) {
          pos = b.pos();
          y = pos.y + dt * b.vel.y * b.speed;
          x = pos.x + dt * b.vel.x * b.speed;
          b.setPos(x, y);
        }
      });
    }
  },

  /**
   * @method rotateShip
   * @private
   */
  rotateShip: function rotateShip(cur, deg) {
    cur += deg;
    if (cur >= 360) {
      cur = cur - 360;
    }
    if (cur < 0) {
      cur = 360 + cur;
    }
    return cur;
  },


  /**
   * @method thrust
   * @private
   */
  thrust: function thrust(ship, angle, power) {
    var rc = _asterix2.default.calcXY(angle, power),
        accel = {
      x: rc[0],
      y: rc[1]
    };
    return accel;
  },


  /**
   * @method processShipMotions
   * @private
   */
  processShipMotions: function processShipMotions(node, dt) {
    var motion = node.motion,
        velo = node.velocity,
        tu = node.thrust,
        rot = node.rotation,
        ship = node.ship,
        sp = ship.sprite,
        pos = sp.getPosition(),
        deg = void 0,
        x = pos.x,
        y = pos.y;

    if (motion.right) {
      rot.angle = this.rotateShip(rot.angle, 3);
      ship.sprite.setRotation(rot.angle);
    }

    if (motion.left) {
      rot.angle = this.rotateShip(rot.angle, -3);
      ship.sprite.setRotation(rot.angle);
    }

    if (motion.up) {
      var acc = this.thrust(ship, rot.angle, tu.power);
      sp.setSpriteFrame(ship.frames[1]);
      velo.acc.x = acc.x;
      velo.acc.y = acc.y;
    } else {
      sp.setSpriteFrame(ship.frames[0]);
    }
    this.moveShip(node, dt);

    motion.right = false;
    motion.left = false;
    motion.up = false;
    motion.down = false;
  },


  /**
   * @method clampVelocity
   * @private
   */
  clampVelocity: function clampVelocity() {},


  /**
   * @method moveShip
   * @private
   */
  moveShip: function moveShip(snode, dt) {
    var velo = snode.velocity,
        B = this.state.world,
        ship = snode.ship,
        sp = ship.sprite,
        r = void 0,
        x = void 0,
        y = void 0,
        sz = sp.getContentSize(),
        pos = sp.getPosition();

    velo.vel.y = velo.vel.y + dt * velo.acc.y;
    velo.vel.x = velo.vel.x + dt * velo.acc.x;

    if (velo.vel.y > velo.max.y) {
      velo.vel.y = velo.max.y;
    } else if (velo.vel.y < -velo.max.y) {
      velo.vel.y = -velo.max.y;
    }
    if (velo.vel.x > velo.max.x) {
      velo.vel.x = velo.max.x;
    } else if (velo.vel.x < -velo.max.x) {
      velo.vel.x = -velo.max.x;
    }

    y = pos.y + dt * velo.vel.y;
    x = pos.x + dt * velo.vel.x;

    sp.setPosition(x, y);

    //wrap?
    r = _ccsx2.default.bbox4(sp);

    if (r.bottom > B.top) {
      if (velo.vel.y > 0) {
        y = B.bottom - sz.height;
      }
    }

    if (r.top < B.bottom) {
      if (velo.vel.y < 0) {
        y = B.top + sz.height;
      }
    }

    if (r.left > B.right) {
      if (velo.vel.x > 0) {
        x = B.left - sz.width;
      }
    }

    if (r.right < B.left) {
      if (velo.vel.x < 0) {
        x = B.right + sz.width;
      }
    }

    sp.setPosition(x, y);
    sp.setRotation(snode.rotation.angle);
  },


  /**
   * @method moveAstros
   * @private
   */
  moveAstros: function moveAstros(astro, dt) {
    var rot = astro.rotation,
        B = this.state.world,
        velo = astro.vel,
        sp = astro.sprite,
        sz = sp.getContentSize(),
        pos = sp.getPosition(),
        r = void 0,
        x = void 0,
        y = void 0;

    x = pos.x + dt * velo.x;
    y = pos.y + dt * velo.y;

    rot += 0.1;
    if (rot > 360) {
      rot -= 360;
    }

    astro.rotation = rot;
    sp.setRotation(rot);
    sp.setPosition(x, y);

    //wrap?
    r = _ccsx2.default.bbox4(sp);

    if (r.bottom > B.top) {
      if (velo.y > 0) {
        y = B.bottom - sz.height;
      }
    }

    if (r.top < B.bottom) {
      if (velo.y < 0) {
        y = B.top + sz.height;
      }
    }

    if (r.left > B.right) {
      if (velo.x > 0) {
        x = B.left - sz.width;
      }
    }

    if (r.right < B.left) {
      if (velo.x < 0) {
        x = B.right + sz.width;
      }
    }

    sp.setPosition(x, y);
  }
}, {

  /**
   * @memberof module:s/move~Move
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Move
});

/** @alias module:s/move */
var xbox = /** @lends xbox# */{

  /**
   * @property {Move} Move
   */
  Move: Move
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF