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
png= sh.Pong;


//////////////////////////////////////////////////////////////////////////////
//
png.EntityFactory = Ash.Class.extend({

  constructor: function(engine) {
    this.engine=engine;
    return this;
  },

  createPaddles: function(layer, options) {

    this.createOnePaddle(layer, options.players[1],
                         options.p1,
                         options.paddle.speed);

    this.createOnePaddle(layer, options.players[2],
                         options.p2,
                         options.paddle.speed);
  },

  createBall: function(layer, options) {
    var ent = new Ash.Entity(),
    info = options.ball,
    vy = info.speed * sjs.randomSign(),
    vx = info.speed * sjs.randomSign(),
    x = info.x,
    y = info.y;

    if (options.mode === sh.ONLINE_GAME) {
      vx = vy = 0;
    }

    ent.add(new png.Ball(layer,x,y,info.speed));
    ent.add(new png.Velocity(vx,vy));
    this.engine.addEntity(ent);
  },

  createOnePaddle: function(layer, p, info,speed) {
    var ent = new Ash.Entity(),
    x = info.x,
    y = info.y;

    ent.add(new png.Paddle(layer,x,y,p.color, speed));
    ent.add(p);
    ent.add(new png.Motion());
    this.engine.addEntity(ent);
  }



});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

