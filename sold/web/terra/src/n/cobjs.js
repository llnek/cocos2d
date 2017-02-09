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
let xbox = {},
sjs=sh.skarojs,
xcfg= sh.xcfg,
csts= xcfg.csts,
undef;

//////////////////////////////////////////////////////////////////////////
/**
 * @class Missile
 */
xbox.Missile = sh.Ashley.compDef({

  /**
   * @method constructor
   * @param {cc.Sprite}
   * @param {Number} attackMode
   */
  constructor(sprite, attackMode) {
    this.attackMode = attackMode || csts.ENEMY_ATTACK.NORMAL;
    this.rego('Missile');
    this.ctor(sprite);
    this.vel= {
      x: 0,
      y: csts.MISSILE_SPEED
    };
  }

});

//////////////////////////////////////////////////////////////////////////
/**
 * @class Bomb
 */
xbox.Bomb = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Bomb
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {Number} attackNode
   */
  constructor(sprite, attackMode) {
    this.attackMode = attackMode || csts.ENEMY_ATTACK.NORMAL;
    this.rego('Bomb');
    this.ctor(sprite);
    this.vel= {
      x: 0,
      y: -csts.BOMB_SPEED
    };
  }

});


//////////////////////////////////////////////////////////////////////////
/**
 * @class Enemy
 */
xbox.Enemy = sh.Ashley.compDef({

  /**
   * memberof module:n/cobjs~Enemy
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {Object} arg
   */
  constructor(sprite, arg) {

    this.ctor(sprite, arg.HP, arg.scoreValue);
    this.delayTime= 1 + 1.2 * Math.random();
    this.rego('Enemy');
    this.speed= arg.speed || 200;
    this.moveType = arg.moveType;
    this.attackMode = arg.attackMode;
    this.enemyType = arg.type;

  }

});

//////////////////////////////////////////////////////////////////////////
/**
 * @class Ship
 */
xbox.Ship = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Ship
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {cc.Sprite} spriteX
   */
  constructor(sprite, spriteX) {
    this.bornSprite = spriteX;
    this.canBeAttack = false;
    this.ctor(sprite, 5);
    this.rego('Player');
  }

});

//////////////////////////////////////////////////////////////////////////
/**
 * @class Motion
 */
xbox.Motion = sh.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Motion
   * @method constructor
   */
  constructor() {
    this.right=false;
    this.left= false;
    this.down= false;
    this.up= false;
  }

});

//////////////////////////////////////////////////////////////////////////
/**
 * @class Spark
 */
xbox.Spark = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Spark
   * @method constructor
   * @param {cc.Sprite} sp1
   * @param {cc.Sprite} sp2
   */
  constructor(sp1, sp2) {
    this.duration = 0.7;
    this.sprite2= sp2;
    this.ctor(sp1);
    this.scale = 1.2;
  },

  /**
   * @memberof module:n/cobjs~Spark
   * @method inflate
   * @param {Object} options
   */
  inflate(options) {
    let x= options.x,
    y= options.y;

    this.sprite.attr({
      x: x,
      y: y,
      scale: this.scale,
      opacity: 255
    });
    this.sprite2.attr({
      x: x,
      y: y,
      scale: this.scale,
      rotation: sjs.rand(360),
      opacity: 255
    });

    let scaleBy = cc.scaleBy(this.duration, 3, 3),
    right = cc.rotateBy(this.duration, 45),
    seq = cc.sequence(cc.fadeOut(this.duration),
                      cc.callFunc(this.destroy, this));

    this.sprite.runAction(right);
    this.sprite.runAction(scaleBy);
    this.sprite.runAction(seq);

    this.sprite2.runAction(scaleBy.clone());
    this.sprite2.runAction(seq.clone());

    this.sprite2.setVisible(true);
    this.status=true;
    this.sprite.setVisible(true);
  },

  /**
   * @memberof module:n/cobjs~Spark
   * @method deflate
   */
  deflate() {
    this.sprite2.setVisible(false);
    this.sprite.setVisible(false);
    this.status=false;
    this.sprite2.stopAllActions();
    this.sprite.stopAllActions();
  }

});

//////////////////////////////////////////////////////////////////////////
/**
 * @class Explosion
 */
xbox.Explosion = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Explosion
   * @method constructor
   * @param {cc.Sprite} sprite
   */
  constructor(sprite) {
    this.animation = cc.animationCache.getAnimation("Explosion");
    this.ctor(sprite);
  },

  /**
   * @memberof module:n/cobjs~Explosion
   * @method inflate
   * @param {Object} options
   */
  inflate(options) {
    this.sprite.setPosition(options.x, options.y);
    this.sprite.setVisible(true);
    this.status=true;
    this.sprite.runAction(cc.sequence(
        cc.animate(this.animation),
        cc.callFunc(this.deflate, this)
    ));
  }

});

//////////////////////////////////////////////////////////////////////////
/**
 * @class HitEffect
 */
xbox.HitEffect = sh.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~HitEffect
   * @method constructor
   * @param {cc.Sprite} sprite
   */
  constructor(sprite) {
    this.scale = 0.75;
    this.ctor(sprite);
  },

  /**
   * @memberof module:n/cobjs~HitEffect
   * @method inflate
   * @param {Object} options
   */
  inflate(options) {
    this.sprite.setPosition(options.x, options.y);
    this.sprite.setScale(this.scale);
    this.sprite.setRotation(sjs.rand(360));
    this.sprite.setVisible(true);
    this.status=true;
    this.sprite.runAction(cc.scaleBy(0.3, 2, 2));
    this.sprite.runAction(cc.sequence(cc.fadeOut(0.3),
                               cc.callFunc(this.deflate, this)));
  }

});

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

