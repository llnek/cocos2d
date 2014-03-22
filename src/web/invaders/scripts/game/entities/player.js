// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Cherimoia, LLC. All rights reserved.

(function(undef) { "use strict"; var global = this; var _ = global._ ;

var asterix = global.ZotohLabs.Asterix;
var ccsx = asterix.COCOS2DX;
var ivs = asterix.Invaders;
var sh = asterix.Shell;
var loggr = global.ZotohLabs.logger;
var echt = global.ZotohLabs.echt;

var Ship = cc.Sprite.extend({

  ammoCount: 0,

  coolDown: function() {
    this.initWithSpriteFrameName(this.options.frames[0]);
    this.ammoCount= 0;
  },

  loadAmmo: function() {
    this.initWithSpriteFrameName(this.options.frames[1]);
    this.ammoCount= 1;
  },

  hasAmmo: function() {
    return this.ammoCount > 0;
  },

  ctor: function(options) {
    this.options= options;
    this._super();
    this.loadAmmo();
    this.setZOrder(this.options.zIndex);
    this.setTag(this.options.tag);
    this.setPosition(this.options._startPos);
  }

});

asterix.Invaders.EntityPlayer = asterix.XEntity.extends({

  missiles: {},
  speed: 150,

  create: function() {
    this.sprite = new Ship(this.options);
    return this.sprite;
  },

  update: function(dt) {
    if (this.coolAmmo && this.coolAmmo.isDone()) {
      this.coolAmmo= null;
      this.sprite.loadAmmo();
    }
    _.each(this.missiles, function(z) {
      z.update(dt);
    });
    if (sh.main.keyboard[cc.KEY.right]) {
      this.onRight(dt);
    }
    if (sh.main.keyboard[cc.KEY.left]) {
      this.onLeft(dt);
    }
    if (sh.main.keyboard[cc.KEY.space] && this.sprite.hasAmmo()) {
      this.doFire();
    }
  },

  doFire: function() {
    var pos= this.sprite.getPosition();
    var m= new ivs.EntityMissile(pos.x, pos.y + 4, {
      zIndex: sh.main.lastZix,
      tag: ++sh.main.lastTag
    });
    sh.main.addChild(m.create(), m.options.zIndex, m.options.tag);
    //ig.game.onPlayerFire();
    this.coolAmmo = this.sprite.runAction(cc.DelayTime.create(this.options.coolDown));
    this.sprite.coolDown();
    this.missiles[ '' + m.options.tag ] = m;
  },

  onRight: function(dt) {
    var pos= this.sprite.getPosition();
    var x = pos.x + dt * this.speed;
    this.sprite.setPosition(x, pos.y);
    this.clamp();
  },

  onLeft: function(dt) {
    var pos= this.sprite.getPosition();
    var x = pos.x - dt * this.speed;
    this.sprite.setPosition(x, pos.y);
    this.clamp();
  },

  clamp: function() {
    var sz= this.sprite.getContentSize();
    var csts = sh.xcfg.csts;
    var pos= this.sprite.getPosition();
    var wz = ccsx.screen();
    if (ccsx.getRight(this.sprite) > wz.width - csts.TILE) {
      this.sprite.setPosition(wz.width - csts.TILE - sz.width/2, pos.y);
    }
    if (ccsx.getLeft(this.sprite) < csts.TILE) {
      this.sprite.setPosition( csts.TILE + sz.width/2, pos.y);
    }
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.maxVel.y = 200;
    this.maxVelx = 100;
    this.friction.x = 150;
    this.friction.y = 0;
    //this.coolAmmo = this.runAction(cc.DelayTime.create(this.options.coolDown));
    this.options.frames= [ 'ship_0.png', 'ship_1.png' ];
  }


});




}).call(this);


