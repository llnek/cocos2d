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
 * @module n/cobjs
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';


/** @alias module:n/cobjs */
let xbox= {},
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
   * @memberof module:n/cobjs~Ball
   * @constructor
   * @param {cc.Sprite} sprite
   * @param {Number} speed
   */
  constructor(sprite, speed) {
    this.ctor(sprite);
    this.speed= speed;
  }
});
/**
 * @property {Ball} Ball
 */
xbox.Ball = Ball;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Motion
 */
const Motion = sh.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Motion
   * @method constructor
   */
  constructor() {
    this.right = false;
    this.left= false;
  }
});
/**
 * @property {Motion} Motion
 */
xbox.Motion= Motion;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Paddle
 */
const Paddle = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Paddle
   * @method p1Keys
   * @return {Array}
   */
  p1Keys() {
    return ccsx.isPortrait() ?
      [cc.KEY.left, cc.KEY.right] : [cc.KEY.down, cc.KEY.up];
  },

  /**
   * @memberof module:n/cobjs~Paddle
   * @method p2Keys
   * @return {Array}
   */
  p2Keys() {
    return ccsx.isPortrait() ?
      [cc.KEY.a, cc.KEY.d] : [cc.KEY.s, cc.KEY.w];
  },

  /**
   * @memberof module:n/cobjs~Paddle
   * @method onColor
   * @param {Array} keycodes
   * @param {String} snd
   */
  onColor(keycodes, snd) {
    this.kcodes = keycodes;
    this.snd= snd;
  },

  /**
   * @memberof module:n/cobjs~Paddle
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {Number} color
   * @param {Number} speed
   */
  constructor(sprite, color, speed) {

    this.ctor(sprite);
    this.color= color;
    this.speed= speed;

    if (this.color === csts.P1_COLOR) {
      this.onColor(this.p1Keys(), 'x_hit' );
    } else {
      this.onColor(this.p2Keys(), 'o_hit');
    }
  }

});
/**
 * @property {Paddle} Paddle
 */
xbox.Paddle= Paddle;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Player
 */
const Player = sh.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Player
   * @method constructor
   * @param {Number} category
   * @param {Number} value
   * @param {Number} id
   * @param {Number} color
   */
  constructor(category,value,id,color) {
    this.color= color;
    this.pnum=id;
    this.category= category;
    this.value= value;
  }

});
/**
 * @property {Player} Player
 */
xbox.Player= Player;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Faux
 */
const Faux= sh.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Faux
   * @method constructor
   */
  constructor() {
  }

});
/**
 * @property {Faux} Faux
 */
xbox.Faux = Faux;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Position
 */
const Position = sh.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Position
   * @method constructor
   * @param {cc.Point} lp
   */
  constructor(lp) {
    this.lastDir= 0;
    this.lastP= lp;
  }

});
/**
 * @property {Position} Position
 */
xbox.Position= Position;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Velocity
 */
const Velocity = sh.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Velocity
   * @method constructor
   * @param {Number} vx
   * @param {Number} vy
   */
  constructor(vx,vy) {
    this.vel = {
      x: vx,
      y: vy
    };
  }

});
/**
 * @property {Velocity} Velocity
 */
xbox.Velocity= Velocity;



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

