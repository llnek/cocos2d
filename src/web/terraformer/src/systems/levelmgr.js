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

define("zotohlab/p/levelmgr", ['zotohlab/p/components',
                              'zotohlab/p/s/utils',
                              'zotohlab/p/gnodes',
                              'cherimoia/skarojs',
                              'zotohlab/asterix',
                              'zotohlab/asx/xcfg',
                              'zotohlab/asx/ccsx',
                              'zotohlab/asx/xpool',
                              'ash-js'],

  function (cobjs, utils, gnodes, sjs, sh, xcfg, ccsx, XPool, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    LevelManager = Ash.System.extend({

      constructor: function(options){
        this.state= options;
        this._currentLevel = 1;
        this.setLevel(this._currentLevel);
      },

      setLevel: function(level) {
        this.onceLatch=1;
      },

      getLCfg: function() {
        var k= 'gamelevel' + Number(this._currentLevel).toString();
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

      loadLevelResource: function(node, deltaTime) {
        var fc, em, cfg= this.getLCfg(),
        me=this,
        t, n,
        cl= this._currentLevel;

        if (sh.pools[csts.P_BADIES].actives >= cfg.enemyMax) { return; }

        for (n = 0; n < cfg.enemies.length; ++n){
          em = cfg.enemies[n];
          if (!!em) {
            fc= function() {
              for (var t = 0; t < em.types.length; ++t) {
                me.addEnemyToGameLayer(node, em.types[t]);
              }
            };
            if (em.style === "Repeat" && deltaTime % em.time === 0) {
              fc();
            }
            if (em.style === "Once" &&
                em.time >= deltaTime && this.onceLatch > 0) {
              this.onceLatch=0;
              fc();
            }
          }
        }
      },

      dropBombs: function(enemy) {
        // this ptr = enemy.sprite
        var po2= sh.pools[csts.P_BS],
        plen= po2.length,
        sp= enemy.sprite,
        sz= sp.getContentSize(),
        pos= sp.getPosition(),
        n, b;

        for (n=0; n < plen; ++n) {
          if (!po2[n].status) {
            b= po2[n];
            break;
          }
        }

        if (!b) {
          utils.createBombs(sh.main.getNode('op-pics'),
                            sh.main.options, 50);
          b= po2[plen];
        }

        b.inflate(pos.x, pos.y - sz.height * 0.2);
        b.attackMode=enemy.attackMode;
      },

      getOrCreateEnemy: function(arg) {
        var layer = sh.main.getNode('tr-pics'),
        po1 = sh.pools[csts.P_BADIES],
        ens= po1.ens,
        me=this,
        en, j;

        for (j = 0; j < ens.length; ++j) {
          en = ens[j];
          if (en.status === false &&
              en.enemyType === arg.type) {
            en._hurtColorLife = 0;
            en.status = true;
            en.sprite.schedule(function() {
              me.dropBombs(en);
            }, en.delayTime);
            en.sprite.setVisible(true);
            ++po1.actives;
            return en;
          }
        }
        en = this.state.factory.createEnemy(layer, arg);
        ++po1.actives;
        return en;
      },

      addEnemyToGameLayer: function(node, enemyType) {
        var addEnemy = this.getOrCreateEnemy(xcfg.EnemyTypes[enemyType]),
        ship= node.ship,
        pos= ship.sprite.getPosition(),
        sp= addEnemy.sprite,
        sz= sp.getContentSize(),
        offset, tmpAction,
        a0=0,
        a1=0,
        wz = ccsx.screen();

        sp.setPosition(sjs.rand(80 + (wz.width - 160)), wz.height);
        switch (addEnemy.moveType) {

          case csts.ENEMY_MOVE.RUSH:
            tmpAction = cc.moveTo(1, cc.p(pos.x, pos.y));
          break;

          case csts.ENEMY_MOVE.VERT:
            tmpAction = cc.moveBy(4, cc.p(0, -wz.height - sz.height));
          break;

          case csts.ENEMY_MOVE.HORZ:
            a0 = cc.moveBy(0.5, cc.p(0, -100 - sjs.rand(200)));
            a1 = cc.moveBy(1, cc.p(-50 - sjs.rand(100), 0));
            var onComplete = cc.callFunc(function (pSender) {
              var a2 = cc.delayTime(1);
              var a3 = cc.moveBy(1, cc.p(100 + sjs.rand(100), 0));
              pSender.runAction(cc.sequence(a2, a3, a2.clone(), a3.reverse()).repeatForever());
            }.bind(addEnemy) );
            tmpAction = cc.sequence(a0, a1, onComplete);
          break;

          case csts.ENEMY_MOVE.OLAP:
            var newX = (sp.getPositionX() <= wz.width * 0.5) ? wz.width : -wz.width;
            a0 = cc.moveBy(4, cc.p(newX, -wz.width * 0.75));
            a1 = cc.moveBy(4,cc.p(-newX, -wz.width));
            tmpAction = cc.sequence(a0,a1);
          break;
        }

        sp.runAction(tmpAction);
      }

    });

    return LevelManager;
});
