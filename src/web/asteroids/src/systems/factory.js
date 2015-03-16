// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define('zotohlab/p/s/factory', ['zotohlab/p/components',
                               'zotohlab/p/gnodes',
                               'cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/ccsx'],

  function (cobjs, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    EntityFactory = sh.Ashley.casDef({

      constructor: function(engine, options) {
        this.state = options;
        this.engine=engine;
      },

      createMissiles: function(count) {
        sh.pools.Missiles.preSet(function() {
          var sp = ccsx.createSpriteFrame('laserGreen.png');
          sp.setVisible(false);
          sh.main.addAtlasItem('game-pics', sp);
          return new cobjs.Missile(sp);
        }, count || 36);
      },

      createLasers: function(count) {
        sh.pools.Lasers.preSet(function() {
          var sp = ccsx.createSpriteFrame('laserRed.png');
          sp.setVisible(false);
          sh.main.addAtlasItem('game-pics', sp);
          return new cobjs.Laser(sp);
        }, count || 36);
      },

      createShip: function() {
        var ent= sh.Ashley.newEntity(),
        deg = 90,//sjs.randPercent() * 360;
        sp= ccsx.createSpriteFrame('rship_0.png');

        sp.setRotation(deg);
        sh.main.addAtlasItem('game-pics', sp);

        sp= new cobjs.Ship(sp,['rship_0.png','rship_1.png']);
        this.state.ship= sp;
        this.bornShip();

        ent.add(sp);

        ent.add(new cobjs.Velocity(0,0,150,150));
        ent.add(new cobjs.Motion());
        ent.add(new cobjs.Looper(1));
        ent.add(new cobjs.Cannon());
        ent.add(new cobjs.Thrust(25));
        ent.add(new cobjs.Rotation(deg));
        this.engine.addEntity(ent);

      },

      bornShip: function() {
        var h = this.state.playerSize.height,
        w = this.state.playerSize.width,
        B= this.state.world,
        wz = ccsx.screen(),
        cw = ccsx.center(),
        test=true,
        sp,aa,x,y,r;

        while (test) {
          r= { left: sjs.rand(wz.width),
               top: sjs.rand(wz.height) };
          r.bottom = r.top - h;
          r.right = r.left + w;
          if (!this.maybeOverlap(r) &&
              !sh.outOfBound(r,B)) {
            x = r.left + w * 0.5;
            y = r.top - h * 0.5;
            test=false;
          }
        }

        this.state.ship.inflate({ x: x, y: y });
      },

      createAsteroids: function(rank) {
        var cfg = sh.getLevelCfg(this.state.level),
        B= this.state.world,
        pool,
        ht = this.state.astro1.height,
        wd = this.state.astro1.width;

        switch (rank) {
          case csts.P_AS1: pool = sh.pools.Astros1; break;
          case csts.P_AS2: pool = sh.pools.Astros2; break;
          case csts.P_AS3: pool = sh.pools.Astros3; break;

          default: return;
        }

        sjs.loggr.debug('about to create more asteroids - ' + rank);

        pool.preSet(function(pl) {
          var wz = ccsx.screen(),
          cw = ccsx.center(),
          sp, x, y,
          deg, r, n=0;
          while (n < cfg[rank][0]) {
            r= { left: sjs.rand(wz.width),
                 top: sjs.rand(wz.height) };
            r.bottom = r.top - ht;
            r.right = r.left + wd;
            if ( !sh.outOfBound(r,B)) {
              deg = sjs.rand(360);
              x = r.left + wd/2;
              y = r.top - ht/2;
              sp= ccsx.createSpriteFrame(cfg[rank][1]);
              sp.setRotation(deg);
              sh.main.addAtlasItem('game-pics', sp);

              sp= new cobjs.Asteroid(sp, cfg[rank][2], rank,
                                     deg,
                                     20 * sjs.randSign(),
                                     20 * sjs.randSign());
              sp.inflate({x :x, y: y});
              pl.push(sp);
              ++n;
            }
          }
        },1);

        sjs.loggr.debug('CREATED more asteroids - ' + rank);
      },

      maybeOverlap: function (ship) {
        var rc= R.some(function(z) {
          return z.status ? sh.isIntersect(ship, ccsx.bbox4(z.sprite)) : false;
        }, sh.pools.Astros1.pool);
        if (rc) { return true; }

        rc= R.some(function(z) {
          return z.status ? sh.isIntersect(ship, ccsx.bbox4(z.sprite)) : false;
        }, sh.pools.Astros2.pool);
        if (rc) { return true; }

        rc= R.some(function(z) {
          return z.status ? sh.isIntersect(ship, ccsx.bbox4(z.sprite)) : false;
        }, sh.pools.Astros3.pool);
        if (rc) { return true; }

        return false;
      }

    });

    return EntityFactory;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

