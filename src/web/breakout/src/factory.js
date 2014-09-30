// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef){ "use strict"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
ccsx= asterix.CCS2DX,
sjs= global.SkaroJS,
sh= asterix,
bko= sh.BreakOut;


//////////////////////////////////////////////////////////////////////////////
//
bko.EntityFactory = Ash.Class.extend({

  constructor: function(engine) {
    this.engine=engine;
    return this;
  },

  createBricks: function(layer, options) {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    cw= ccsx.center(),
    candies= csts.CANDIES,
    bks=[],
    cs= csts.LEVELS["1"],
    ent, sp, b, w, r, c,
    x,
    y= wz.height - csts.TOP_ROW * csts.TILE ;

    for (r=0; r < csts.ROWS; ++r) {
      x= csts.TILE + csts.LEFT_OFF + sh.hw(options.candySize);
      for (c=0; c < csts.COLS; ++c) {
        sp= new cc.Sprite();
        sp.initWithSpriteFrameName( candies[cs[r]] + ".png");
        sp.setPosition(x,y);
        layer.addItem(sp);
        bks.push(new bko.Brick(sp,10));
        x += options.candySize.width + 1;
      }
      y -= options.candySize.height - 2;
    }

    ent= new Ash.Entity();
    ent.add(new bko.BrickFence(bks));
    this.engine.addEntity(ent);
  },

  createPaddle: function(layer,options) {
    var csts= sh.xcfg.csts,
    cw= ccsx.center(),
    ent,
    sp= new cc.Sprite();

    sp.initWithSpriteFrameName('paddle.png');
    sp.setPosition(cw.x, 56);
    layer.addItem(sp);
    ent= new Ash.Entity();
    ent.add(new bko.Paddle(sp));
    ent.add(new bko.Motion());
    ent.add(new bko.Velocity(150,0));
    this.engine.addEntity(ent);
  },

  createBall: function(layer,options) {
    var csts= sh.xcfg.csts,
    vy = 200 * sjs.randomSign(),
    vx = 200 * sjs.randomSign(),
    cw= ccsx.center(),
    ent,
    sp= new cc.Sprite();

    sp.initWithSpriteFrameName('ball.png');
    sp.setPosition(cw.x, 250);
    layer.addItem(sp);
    ent= new Ash.Entity();
    ent.add(new bko.Ball(sp,200));
    ent.add(new bko.Velocity(vx,vy));
    this.engine.addEntity(ent);
  }


});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF


