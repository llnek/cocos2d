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
                               'cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/ccsx'],

  function (cobjs, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts = xcfg.csts,
    undef,
    EntityFactory = sh.Ashley.casDef({

      constructor: function(engine) {
        this.engine=engine;
      },

      createShip: function(layer, options) {
        var sp= ccsx.createSpriteFrame('ship01.png'),
        ent= sh.Ashley.newEntity(),
        sz= sp.getContentSize(),
        bs, player,
        cw= ccsx.center(),
        wz= ccsx.screen();
        sp.setPosition(cw.x, sz.height);

        // set frame
        var fr0 = cc.spriteFrameCache.getSpriteFrame("ship01.png"),
        fr1 = cc.spriteFrameCache.getSpriteFrame("ship02.png"),
        animFrames = [fr0, fr1],
        animation = new cc.Animation(animFrames, 0.1),
        animate = cc.animate(animation);
        sp.runAction(animate.repeatForever());

        layer.addItem(sp, csts.SHIP_ZX);

        bs = ccsx.createSpriteFrame("ship03.png");
        bs.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        bs.setPosition(sz.width * 0.5, 12);
        bs.setVisible(false);
        sp.addChild(bs, csts.SHIP_ZX, 99999);

        player = new cobjs.Ship(sp, bs);
        options.player= player;
        ent.add(player);
        ent.add(new cobjs.Motion());
        this.engine.addEntity(ent);
      },

      createEnemy: function(layer, arg) {
        var sp= ccsx.createSpriteFrame(arg.textureName);
        sp.setVisible(false);
        layer.addItem(sp, csts.SHIP_ZX - 1); // why?
        return new cobjs.Enemy(sp, arg);
      },

      createBackSky: function(layer, options) {
        var bg = ccsx.createSpriteFrame('bg01.png');
        bg.setAnchorPoint(0,0);
        bg.setVisible(false);
        layer.addItem(bg, -10);

        if (! options.backSkyDim) {
          options.backSkyDim= cc.size(bg.getContentSize());
        }

        return { sprite: bg, status: false };
      }

    });

    return EntityFactory;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

