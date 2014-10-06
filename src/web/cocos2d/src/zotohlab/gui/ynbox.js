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

function moduleFactory(sjs, sh, xcfg, ccsx, layers, scenes) { "use strict";
var undef;

//////////////////////////////////////////////////////////////////////////////
//
var BGLayer = layers.XLayer.extend({

  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.getTilesPath('gui.blank'));
    this.addItem(map);
    return this._super();
  }

});

//////////////////////////////////////////////////////////////////////////////
//
var UILayer =  layers.XLayer.extend({

  pkInit: function() {
    var qn= new cc.LabelBMFont(sh.l10n('%quit?'),
                               sh.getFontPath('font.TinyBoxBB')),
    csts = xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    s1, s2, t1, t2, menu;

    qn.setPosition(cw.x, wz.height * 0.75);
    qn.setScale(18/72);
    qn.setOpacity(0.9*255);
    this.addItem(qn);

    s2= new cc.Sprite(sh.getImagePath('gui.mmenu.back'));
    s1= new cc.Sprite(sh.getImagePath('gui.mmenu.ok'));
    t2 = new cc.MenuItemSprite();
    t2.initWithNormalSprite(s2, null, null, function() {
      this.options.onBack();
    }, this);
    t1 = new cc.MenuItemSprite();
    t1.initWithNormalSprite(s1, null, null, function() {
      this.options.yes();
    }, this);

    menu= new cc.Menu(t1,t2);
    menu.alignItemsHorizontallyWithPadding(10);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF - (s2.getContentSize().width + s1.getContentSize().width + 10) * 0.5,
      csts.TILE + csts.S_OFF + s2.getContentSize().height * 0.5);
    this.addItem(menu);

    return this._super();
  }

});


return {
  'YesNo' : {
    create: function(options) {
      return new scenes.XSceneFactory( [ BGLayer, UILayer ]).create(options);
    }
  }
};

}

//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("zotohlab/asx/ynbox",
            ['cherimoia/skarojs',
             'zotohlab/asterix',
             'zotohlab/asx/xcfg',
             'zotohlab/asx/ccsx',
             'zotohlab/asx/xlayers',
             'zotohlab/asx/xscenes'],
            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

