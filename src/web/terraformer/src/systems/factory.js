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
                               'zotohlab/asx/xcfg',
                               'zotohlab/asx/ccsx',
                               'ash-js'],

  function (cobjs, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    EntityFactory = Ash.Class.extend({

      constructor: function(engine) {
        this.engine=engine;
      },

      createShip: function(layer, options) {
        var bs, sp= ccsx.createSpriteFrame('ship01.png'),
        sz= sp.getContentSize(),
        ent= new Ash.Entity(),
        cw= ccsx.center(),
        wz= ccsx.screen();
        sp.setPosition(cw.x, sz.height);

        // set frame
        var fr0 = cc.spriteFrameCache.getSpriteFrame("ship01.png"),
        fr1 = cc.spriteFrameCache.getSpriteFrame("ship02.png"),
        animFrames = [ fr0, fr1],
        animation = new cc.Animation(animFrames, 0.1),
        animate = cc.animate(animation);
        sp.runAction(animate.repeatForever());

        layer.getNode('tr-pics').addItem(sp, 3000);
        bs = ccsx.createSpriteFrame("ship03.png");
        bs.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        bs.setPosition(sz.width * 0.5, 12);
        bs.setVisible(false);
        sp.addChild(bs, 3000,99999);

        ent.add(new cobjs.Ship(sp, bs));
        this.engine.addEntity(ent);
      },

      createBackSky: function(layer, options) {
        var bg = ccsx.createSpriteFrame('bg01.png');
        bg.setAnchorPoint(0,0);
        bg.setVisible(false);
        layer.addItem(bg, -10);

        if (! options.backSkyDim) {
          options.backSkyDim= cc.size(bg.getContentSize());
        }

        return { sprite: bg, active: false };
      }

    });

    return EntityFactory;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

