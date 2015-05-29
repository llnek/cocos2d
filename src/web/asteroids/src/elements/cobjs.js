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
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/elements
 */
define('zotohlab/p/elements',

       ['zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/elements */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    ast= {};

    //////////////////////////////////////////////////////////////////////////////
    Asteroid = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Asteroid
       * @method constructor
       * @param {cc.Sprite}
       * @param {Number} value
       * @param {Number} rank
       * @param {Number} degA
       * @param {Number} vx
       * @param {Number} vy
       */
      constructor(sprite,value,rank, deg, vx, vy) {
        this.ctor(sprite, 1, value);
        this.rotation= deg;
        this.rank=rank;
        this.vel = {
          x: vx,
          y: vy
        }
      }

    });
    /**
     * @property {Asteroid} Asteroid
     */
    exports.Asteroid = Asteroid;


    //////////////////////////////////////////////////////////////////////////////
    /**
     * @Cannon
     */
    Cannon = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Cannon
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
    exports.Cannon = Cannon;


    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Looper
     */
    Looper = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Looper
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
    exports.Looper = Looper;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Missile
     */
    Missile = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Missile
       * @method constructor
       * @param {cc.Sprite} sprite
       * @param {Number} speed
       */
      constructor(sprite,speed) {
        this.speed=speed || 20;
        this.ctor(sprite);
        this.vel= {
          x: 0,
          y: 0
        };
      }

    });
    /**
     * @property {Missile} Missile
     */
    exports.Missile = Missile;



    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Motion
     */
    Motion = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Motion
       * @method constructor
       */
      constructor() {
        this.right = false;
        this.left = false;
        this.up=false;
        this.down=false;
      }

    });
    /**
     * @property {Motion} Motion
     */
    exports.Motion = Motion;


    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Ship
     */
    Ship = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Ship
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
    exports.Ship = Ship;


    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Velocity
     */
    Velocity = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elments~Velocity
       * @method constructor
       * @param {Number} vx
       * @param {Number} vy
       * @param {Number} mx
       * @param {Number} my
       */
      constructor(vx,vy,mx,my) {
        this.vel = {
          x: vx || 0,
          y: vy || 0
        };
        this.max = {
          x: mx || 0,
          y: my || 0
        };
        this.acc = {
          x: 0,
          y: 0
        };
      }

    });
    /**
     * @property {Velocity} Velocity
     */
    exports.Velocity = Velocity;


    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Rotation
     */
    Rotation = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Rotation
       * @param {Number} deg
       */
      constructor(deg) {
        this.angle = deg;
      }

    });
    /**
     * @property {Rotation} Rotation
     */
    exports.Rotation = Rotation;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Thrust
     */
    Thrust = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Thrust
       * @method constructor
       */
      constructor(t) {
        this.power = t;
      }

    });
    /**
     * @property {Thrust} Thrust
     */
    exports.Thrust = Thrust;


    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

