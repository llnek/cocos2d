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
ast= sh.Asteroids;

//////////////////////////////////////////////////////////////////////////////
//
ast.Velocity = Ash.Class.extend({

  constructor: function(vx,vy,mx,my) {
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
    return this;
  }

});

//////////////////////////////////////////////////////////////////////////////
//
ast.Rotation = Ash.Class.extend({

  constructor: function(deg) {
    this.angle = deg;
    return this;
  }

});

//////////////////////////////////////////////////////////////////////////////
//
ast.Thrust = Ash.Class.extend({

  constructor: function(t) {
    this.power = t;
    return this;
  }

});




}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF



