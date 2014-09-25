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
    var p = options.players[1],
    ent,
    x = options.p1.x,
    y = options.p1.y;

    ent = new Ash.Entity();
    ent.add(new png.Paddle(layer,x,y,p.color,options.paddle.speed));
    ent.add(p);
    this.engine.addEntity(ent);

    p = options.players[2],
    x = options.p2.x,
    y = options.p2.y;

    ent = new Ash.Entity();
    ent.add(new png.Paddle(layer, x,y,p.color,options.paddle.speed));
    ent.add(p);
    this.engine.addEntity(ent);
  }



});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

