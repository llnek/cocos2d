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
 * @requires zotohlab/asx/ccsx
 * @module nodes/cobjs
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';


/** @alias module:nodes/cobjs */
let xbox = {},
sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Ball
 */
const Ball = sh.Ashley.compDef({

  /**
   * @memberof module:nodes/cobjs~Ball
   * @method constructor
   * @param {cc.Sprite}
   */
  constructor(sprite) {
    this.ctor(sprite);
  }
});
/**
 * @property {Ball} Ball
 */
xbox.Ball= Ball;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class BrickFence
 */
const BrickFence = sh.Ashley.casDef({

  /**
   * @memberof module:nodes/cobjs~BrickFence
   * @method constructor
   * @param {Array} bricks
   */
  constructor(bricks) {
    this.bricks=bricks;
  }
});
/**
 * @property {BrickFence} BrickFence
 */
xbox.BrickFence = BrickFence;

/**
 * @class Brick
 */
const Brick = sh.Ashley.compDef({

  /**
   * @memberof module:nodes/cobjs~Brick
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {Number} value
   * @param {Number} color
   */
  constructor(sprite,value,color) {
    this.ctor(sprite, 1, value);
    this.color=color;
  }

});
/**
 * @property {Brick} Brick
 */
xbox.Brick = Brick;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Motion
 */
const Motion = sh.Ashley.casDef({

  /**
   * @memberof module:nodes/cobjs~Motion
   * @method constructor
   */
  constructor() {
    this.right = false;
    this.left = false;
  }
});
/**
 * @property {Motion} Motion
 */
xbox.Motion = Motion;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Paddle
 */
const Paddle = sh.Ashley.compDef({

  /**
   * @memberof module:nodes/cobjs~Paddle
   * @method constructor
   * @param {cc.Sprite}
   */
  constructor(sprite) {
    this.ctor(sprite);
  }
});
/**
 * @property {Paddle} Paddle
 */
xbox.Paddle = Paddle;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Velocity
 */
const Velocity = sh.Ashley.casDef({

  /**
   * @memberof module:nodes/cobjs~Velocity
   * @method constructor
   * @param {Number} vx
   * @param {Number} vy
   */
  constructor(vx,vy) {
    this.vel = {
      x: vx || 0,
      y: vy || 0
    };
  }

});
/**
 * @property {Velocity} Velocity
 */
xbox.Velocity = Velocity;


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

