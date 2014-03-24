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

  ctor: function(x,y,options) {
    this.options= options;
    this._super();
    this.loadAmmo();
    //this.setZOrder(this.options.zIndex);
    //this.setTag(this.options.tag);
    this.setPosition(x,y);
  }

});

asterix.Invaders.EntityPlayer = asterix.XEntity.extends({

  speed: 150,

  create: function() {
    this.sprite = new Ship(this.options._startPos.x, this.options._startPos.y, this.options);
    return this.sprite;
  },

  update: function(dt) {
    if (this.sprite) {
      if (this.coolAmmo && this.coolAmmo.isDone()) {
        this.coolAmmo= null;
        this.sprite.loadAmmo();
      }
      this._super(dt);
    }
  },

  keypressed: function(dt) {
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
    loggr.debug("player about to fire another missile! pos = [" + pos.x + "," + pos.y + "]");
    if ( ! sh.main.reviveMissile(pos.x, pos.y + 4)) {
      sh.main.addMissile(pos.x, pos.y + 4);
    }
    //ig.game.onPlayerFire();
    this.sprite.coolDown();
    this.coolAmmo = this.sprite.runAction(cc.DelayTime.create(this.options.coolDown));
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

  takeWin: function(num) {
    sh.main.updateScore(num);
  },

  check: function(other) {
    if (other instanceof ivs.EntityAlien) {
      //other.takeHit(666,this);
      this.takeHit(666,other);
    }
    else
    if (other instanceof ivs.EntityBomb) {
      other.kill();
      this.takeHit(other);
    }
  },

  takeHit: function() {
    this.kill();
  },

  kill: function() {
    sh.main.killPlayer();
  },

  ctor: function(x, y, options) {
    this._super(x, y, options);
    this.maxVel.y = 200;
    this.maxVelx = 100;
    this.friction.x = 150;
    this.friction.y = 0;
    this.score=0;
    //this.coolAmmo = this.runAction(cc.DelayTime.create(this.options.coolDown));
    this.options.frames= [ 'ship_0.png', 'ship_1.png' ];
  }


});




}).call(this);


