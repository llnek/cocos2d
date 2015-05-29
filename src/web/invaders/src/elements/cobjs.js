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
define("zotohlab/p/elements",

       ['zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/elements */
    let exports= {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class AlienSquad
     */
    AlienSquad = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~AlienSquad
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
    exports.AlienSquad = AlienSquad;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Alien
     */
    Alien = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Alien
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
    exports.Alien = Alien;


    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Bomb
     */
    Bomb = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Bomb
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
    exports.Bomb= Bomb;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Cannon
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
     * @class Explosion
     */
    Explosion = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Explosion
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
        const frames = [ccsx.getSpriteFrame('boom_0.png'),
                        ccsx.getSpriteFrame('boom_1.png'),
                        ccsx.getSpriteFrame('boom_2.png'),
                        ccsx.getSpriteFrame('boom_3.png') ],
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
    exports.Explosion = Explosion;

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
    exports.Looper= Looper;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Missile
     */
    Missile = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Missile
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
    exports.Missile= Missile;

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
      }
    });
    /**
     * @property {Motion} Motion
     */
    exports.Motion= Motion;

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
       * @memberof module:zotohlab/p/elements~Velocity
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
    exports.Velocity= Velocity;

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

