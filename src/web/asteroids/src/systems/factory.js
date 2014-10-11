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

define('zotohlab/p/s/factory', ['zotohlab/p/components',
                               'zotohlab/p/gnodes',
                               'cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/xcfg',
                               'zotohlab/asx/ccsx',
                               'ash-js'],

  function (cobjs, gnodes, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    EntityFactory = Ash.Class.extend({

      constructor: function(engine) {
        this.engine=engine;
      },

      createShip: function(layer,options) {
        var h = options.playerSize.height,
        w = options.playerSize.width,
        B= options.world,
        wz = ccsx.screen(),
        cw = ccsx.center(),
        deg,test=true,
        sp,aa,x,y,r,
        ent= new Ash.Entity(),
        p= sh.pools[ csts.P_LAS];

        while (test) {
          r= { left: sjs.randPercent() * wz.width,
               top: sjs.randPercent() * wz.height };
          r.bottom = r.top - h;
          r.right = r.left + w;
          if (!this.maybeOverlap(p,r) &&
              !sh.outOfBound(r,B)) {
            x = r.left + w * 0.5;
            y = r.top - h * 0.5;
            deg = 90;//sjs.randPercent() * 360;
            sp= new cc.Sprite();
            sp.initWithSpriteFrameName('rship_0.png');
            sp.setPosition(x,y);
            sp.setRotation(deg);
            layer.addItem(sp);
            ent.add(new cobjs.Ship(sp,['rship_0.png','rship_1.png']));
            ent.add(new cobjs.Velocity(0,0,150,150));
            ent.add(new cobjs.Motion());
            ent.add(new cobjs.Looper(1));
            ent.add(new cobjs.Cannon());
            ent.add(new cobjs.Thrust(25));
            ent.add(new cobjs.Rotation(deg));
            this.engine.addEntity(ent);
            test=false;
          }
        }
      },

      createAsteroids: function(layer,options,rank) {
        var cfg = xcfg.levels['gamelevel' + options.level]['fixtures'],
        h = options.astro1.height,
        w = options.astro1.width,
        wz = ccsx.screen(),
        cw = ccsx.center(),
        aa, n, r,
        sp, tag,
        x,y, deg,
        B= options.world,
        p= sh.pools[ csts.P_LAS];

        if (rank >= csts.P_AS1 &&
            rank <= csts.P_AS3) {} else { return; }

        sjs.loggr.debug('about to create more asteroids - ' + rank);
        n=0;
        while (n < cfg[rank][0]) {
          r= { left: sjs.rand(wz.width),
               top: sjs.rand(wz.height) };
          r.bottom = r.top - h;
          r.right = r.left + w;
          if ( !sh.outOfBound(r,B)) {
            deg = sjs.randPercent() * 360;
            x = r.left + w/2;
            y = r.top - h/2;
            sp= new cc.Sprite();
            sp.initWithSpriteFrameName(cfg[rank][1]);
            sp.setPosition(x,y);
            sp.setRotation(deg);
            layer.addItem(sp);
            tag=sp.getTag();
            aa= new gnodes.AstroMotionNode(
              new cobjs.Asteroid(sp, 25,rank),
              new cobjs.Rotation(deg),
              new cobjs.Velocity(20 * sjs.randSign(),
                                 20 * sjs.randSign()));
            p[tag]= aa;
            ++n;
          }
        }

        sjs.loggr.debug('CREATED more asteroids - ' + rank);
      },

      maybeOverlap: function (p, a) {
        return R.some(function(n,k) {
          var z= n.astro,
          r={};
          r.left= Math.floor(ccsx.getLeft(z.sprite));
          r.top= Math.floor(ccsx.getTop(z.sprite));
          r.bottom = r.top - ccsx.getHeight(z.sprite);
          r.right= r.left + ccsx.getWidth(z.sprite);
          return sh.isIntersect(r,a);
        }, p);
      }

    });

    return EntityFactory;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

