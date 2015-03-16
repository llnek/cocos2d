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

define("zotohlab/p/levelmgr", ['zotohlab/p/components',
                              'zotohlab/p/s/utils',
                              'zotohlab/p/gnodes',
                              'cherimoia/skarojs',
                              'zotohlab/asterix',
                              'zotohlab/asx/ccsx'],

  function (cobjs, utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    LevelManager = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
        this.setLevel(1);
      },

      setLevel: function(level) {
        this.curLevel = level;
        this.onceLatch = 1;
      },

      getLCfg: function() {
        var k= 'gamelevel' + Number(this.curLevel).toString();
        return xcfg['levels'][k]['cfg'];
      },

      removeFromEngine: function(engine) {
        this.ships=null;
      },

      addToEngine: function(engine) {
        this.ships = engine.getNodeList(gnodes.ShipMotionNode);
      },

      update: function (dt) {
        var node = this.ships.head;
        if (this.state.running &&
           !!node) {
          this.loadLevelResource(node, this.state.secCount);
        }
      },

      loadLevelResource: function(node, dt) {
        var enemies= sh.pools.Baddies,
        cfg= this.getLCfg(),
        fc,
        me=this;

        if (enemies.actives() < cfg.enemyMax) {
          sjs.eachObj(function(v) {
            fc= function() {
              for (var t = 0; t < v.types.length; ++t) {
                me.addEnemyToGame(node, v.types[t]);
              }
            };
            if (v.style === "Repeat" &&
                dt % v.time === 0) {
              fc();
            }
            if (v.style === "Once" &&
                v.time >= dt && me.onceLatch > 0) {
              me.onceLatch=0;
              fc();
            }
          }, cfg.enemies);
        }
      },

      dropBombs: function(enemy) {
        var bombs= sh.pools.Bombs,
        sp= enemy.sprite,
        sz= sp.getContentSize(),
        pos= sp.getPosition(),
        b = bombs.get();

        if (!b) {
          sh.factory.createBombs();
          b= bombs.get();
        }

        b.inflate({ x: pos.x, y: pos.y - sz.height * 0.2 });
        b.attackMode=enemy.attackMode;
      },

      getB: function(arg) {
        var enemies = sh.pools.Baddies,
        me=this,
        en,
        pred= function(e) {
          return (e.enemyType === arg.type
                  &&
                  e.status === false);
        };

        en= enemies.select(pred);
        if (!en) {
          sh.factory.createEnemies(1);
          en= enemies.select(pred);
        }

        if (!!en) {
          en.sprite.schedule(function() {
            me.dropBombs(en);
          }, en.delayTime);
          en.inflate();
        }

        return en;
      },

      addEnemyToGame: function(node, enemyType) {
        var arg = xcfg.EnemyTypes[enemyType],
        wz = ccsx.screen(),

        en = this.getB(arg),
        sz= en.size(),
        epos= en.pos(),

        ship= node.ship,
        pos= ship.pos(),

        act, a0, a1;

        en.setPos(sjs.rand(80 + wz.width * 0.5), wz.height);
        switch (en.moveType) {

          case csts.ENEMY_MOVE.RUSH:
            act = cc.moveTo(1, cc.p(pos.x, pos.y));
          break;

          case csts.ENEMY_MOVE.VERT:
            act = cc.moveBy(4, cc.p(0, -wz.height - sz.height));
          break;

          case csts.ENEMY_MOVE.HORZ:
            a0 = cc.moveBy(0.5, cc.p(0, -100 - sjs.rand(200)));
            a1 = cc.moveBy(1, cc.p(-50 - sjs.rand(100), 0));
            var onComplete = cc.callFunc(function (p) {
              var a2 = cc.delayTime(1);
              var a3 = cc.moveBy(1, cc.p(100 + sjs.rand(100), 0));
              p.runAction(cc.sequence(a2, a3,
                                      a2.clone(),
                                      a3.reverse()).repeatForever());
            }.bind(en) );
            act = cc.sequence(a0, a1, onComplete);
          break;

          case csts.ENEMY_MOVE.OLAP:
            var newX = (pos.x <= wz.width * 0.5) ? wz.width : -wz.width;
            a0 = cc.moveBy(4, cc.p(newX, -wz.width * 0.75));
            a1 = cc.moveBy(4,cc.p(-newX, -wz.width));
            act = cc.sequence(a0,a1);
          break;
        }

        en.sprite.runAction(act);
      }

    });

    return LevelManager;
});
