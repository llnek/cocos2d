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

define("zotohlab/asx/ynbox", ['cherimoia/skarojs',
                             'zotohlab/asterix',
                             'zotohlab/asx/ccsx',
                             'zotohlab/asx/xlayers',
                             'zotohlab/asx/xscenes'],
  function (sjs, sh, ccsx, layers, scenes) { "use strict";

    var xcfg= sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,

    BGLayer = layers.XLayer.extend({

      pkInit: function() {
        var imgUrl= sh.getImagePath('gui.blank'),
        s,
        cw = ccsx.center();

        this._super();

        if (!!imgUrl) {
          s= new cc.Sprite(imgUrl);
          s.setPosition(cw);
          this.addItem(s);
        }
      }

    }),

    UILayer =  layers.XLayer.extend({

      pkInit: function() {
        var qn= new cc.LabelBMFont(sh.l10n('%quit?'),
                                   sh.getFontPath('font.OCR')),
        cw= ccsx.center(),
        wz= ccsx.vrect(),
        wb= ccsx.vbox(),
        t1, t2,
        menu;

        this._super();

        qn.setPosition(cw.x, wb.top * 0.75);
        qn.setScale(0.05);
        qn.setOpacity(0.9*255);
        this.addItem(qn);

        var s2 = R.map.idx(function(v,n,a) {
          return new cc.Sprite(sh.getImagePath('gui.mmenu.back'));
        }, [null,null,null]),
        s1= R.map.idx(function(v,n,a) {
          return new cc.Sprite(sh.getImagePath('gui.mmenu.ok'));
        }, [null,null,null]);

        t2 = new cc.MenuItemSprite(s2[0], s2[1], s2[2], function() {
          this.options.onBack();
        }, this);
        t1 = new cc.MenuItemSprite(s1[0], s1[1], s1[2], function() {
          this.options.yes();
        }, this);

        menu= new cc.Menu(t1,t2);
        menu.alignItemsHorizontallyWithPadding(10);
        menu.setPosition(wb.right - csts.TILE - csts.S_OFF - (s2[0].getContentSize().width + s1[0].getContentSize().width + 10) * 0.5,
          wb.bottom + csts.TILE + csts.S_OFF + s2[0].getContentSize().height * 0.5);
        this.addItem(menu);

      }

    });

    return {

      'YesNo' : {
        create: function(options) {
          return new scenes.XSceneFactory( [ BGLayer, UILayer ]).create(options);
        }
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

