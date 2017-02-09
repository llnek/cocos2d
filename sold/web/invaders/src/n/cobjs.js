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
 * @class AlienSquad
 */
const AlienSquad = sh.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~AlienSquad
   * @method constructor
   * @param {Array} aliens
   * @param {Number} step
   */
  constructor(aliens,step) {
    this.aliens=aliens;
    this.stepx=step;
  }
});
/**
 * @property {AlienSquad} AlienSquad
 */
xbox.AlienSquad = AlienSquad;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Alien
 */
const Alien = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Alien
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {Number} value
   * @param {Number} rank
   */
  constructor(sprite,value,rank) {
    this.ctor(sprite, 1, value);
    this.rank=rank;
  }
});
/**
 * @property {Alien} Alien
 */
xbox.Alien = Alien;


//////////////////////////////////////////////////////////////////////////////
/**
 * @class Bomb
 */
const Bomb = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Bomb
   * @method constructor
   * @param {cc.Sprite}
   */
  constructor(sprite) {
    const wz= ccsx.vrect();
    this.ctor(sprite);
    this.vel={
      x: 0,
      y: -50 * wz.height / 480
    };
  }
});
/**
 * @property {Bomb} Bomb
 */
xbox.Bomb= Bomb;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Cannon
 */
const Cannon = sh.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Cannon
   * @method constructor
   * @param {Number} coolDownWindow
   */
  constructor(coolDownWindow) {
    this.coolDownWindow= coolDownWindow || 0.8;
    this.hasAmmo = true;
  }
});
/**
 * @property {Cannon} Cannon
 */
xbox.Cannon = Cannon;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Explosion
 */
const Explosion = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Explosion
   * @method constructor
   * @param {cc.Sprite}
   */
  constructor(sprite) {
    this.ctor(sprite);
    this.frameTime= 0.1;
  },

  /**
   * @protected
   */
  inflate(options) {
    const frames = [ccsx.getSprite('boom_0.png'),
                    ccsx.getSprite('boom_1.png'),
                    ccsx.getSprite('boom_2.png'),
                    ccsx.getSprite('boom_3.png') ],
    anim= new cc.Animation(frames, this.frameTime);

    this.sprite.setPosition(options.x, options.y);
    this.status=true;

    this.sprite.runAction(new cc.Sequence(new cc.Animate(anim),
      new cc.CallFunc(() => {
        sjs.loggr.debug('explosion done.!');
        this.deflate();
      }, this)
    ));
  }

});
/**
 * @property {Explosion} Explosion
 */
xbox.Explosion = Explosion;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Looper
 */
const Looper = sh.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Looper
   * @method constructor
   * @param {Number} count
   */
  constructor(count) {
    this.timers=sjs.makeArray(count,null);
  }
});
/**
 * @property {Looper} Looper
 */
xbox.Looper= Looper;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Missile
 */
const Missile = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Missile
   * @method constructor
   * @param {cc.Sprite} sprite
   */
  constructor(sprite) {
    const wz= ccsx.vrect();
    this.ctor(sprite);
    this.vel= {
      x: 0,
      y: 150 * wz.height / 480
    };
  }
});
/**
 * @property {Missile} Missile
 */
xbox.Missile= Missile;

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
    this.left = false;
  }
});
/**
 * @property {Motion} Motion
 */
xbox.Motion= Motion;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Ship
 */
const Ship = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Ship
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {Array} frames
   */
  constructor(sprite,frames) {
    this.ctor(sprite);
    this.frames=frames;
  }
});
/**
 * @property {Ship} Ship
 */
xbox.Ship = Ship;

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
      x: vx || 0,
      y: vy || 0
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

