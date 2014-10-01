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
ast.EntityFactory = Ash.Class.extend({

  constructor: function(engine) {
    this.engine=engine;
    return this;
  },

  createAsteroids: function(layer,options) {
    var cfg = sh.xcfg.levels['gamelevel' + options.level]['fixtures'],
    h = options.astro1.height,
    w = options.astro1.width,
    csts= sh.xcfg.csts,
    wz = ccsx.screen(),
    cw = ccsx.center(),
    aa, n, r,
    sp, tag,
    x,y, deg,
    B= options.world,
    p= sh.pools[sh.xcfg.csts.P_LAS];


    n=0;
    while (n < cfg.BOULDERS) {
      r= { left: sjs.randPercentage() * wz.width,
           top: sjs.randPercentage() * wz.height };
      r.bottom = r.top - h;
      r.right = r.left + w;
      if (!this.maybeOverlap(p,r) &&
          !sh.outOfBound(r,B)) {
        deg = sjs.randPercentage() * 360;
        x = r.left + w/2;
        y = r.top - h/2;
        sp= new cc.Sprite();
        sp.initWithSpriteFrameName('rock_large.png');
        sp.setPosition(x,y);
        layer.addItem(sp);
        tag=sp.getTag();
        aa= new ast.AstroMotionNode(
          new ast.Asteroid(sp, 25,1),
          new ast.Rotation(deg),
          new ast.Velocity(20 * sjs.randSign(),
                           20 * sjs.randSign()));
        p[tag]= aa;
        ++n;
      }
    }
  },

  maybeOverlap: function (p, a) {
    return _.some(p, function(n,k) {
      var z= n.astro,
      r={};
      r.left= Math.floor(ccsx.getLeft(z.sprite));
      r.top= Math.floor(ccsx.getTop(z.sprite));
      r.bottom = r.top - ccsx.getHeight(z.sprite);
      r.right= r.left + ccsx.getWidth(z.sprite);
      return sh.isIntersect(r,a);
    });
  }

});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

