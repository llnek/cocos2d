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

define("zotohlab/asx/msgbox", ['cherimoia/skarojs',
                              'zotohlab/asterix',
                              'zotohlab/asx/xcfg',
                              'zotohlab/asx/ccsx',
                              'zotohlab/asx/xlayers',
                              'zotohlab/asx/xscenes'],
  function (sjs, sh,  xcfg, ccsx, layers, scenes) { "use strict";

    var csts= xcfg.csts,
    R = sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    //
    var BGLayer = layers.XLayer.extend({

    pkInit: function() {
      var imgUrl= sh.getImagePath('gui.blank'),
      s,
      cw = ccsx.center();

      if (!!imgUrl) {
        s= new cc.Sprite(imgUrl);
        s.setPosition(cw);
        this.addItem(s);
      }
      return this._super();
    }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    var UILayer =  layers.XLayer.extend({

    pkInit: function() {
      var qn= new cc.LabelBMFont(sh.l10n(this.options.msg),
                                 sh.getFontPath('font.TinyBoxBB')),
      s1= [null,null,null],
      cw= ccsx.center(),
      wz= ccsx.screen(),
      t1, menu;

      qn.setPosition(cw.x, wz.height * 0.75);
      qn.setScale(18/72);
      qn.setOpacity(0.9*255);
      this.addItem(qn);

      R.map.idx(function(z,n,a) {
        a[n] = new cc.Sprite(sh.getImagePath('gui.mmenu.ok'));
      },s1);
      t1 = new cc.MenuItemSprite(s1[0], s1[1], s1[2], function() {
        this.options.yes();
      }, this);

      menu= cc.Menu.create(t1);
      menu.alignItemsHorizontallyWithPadding(10);
      menu.setPosition(wz.width - csts.TILE - csts.S_OFF - s1[0].getContentSize().width * 0.5,
        csts.TILE + csts.S_OFF + s1[0].getContentSize().height * 0.5);
      this.addItem(menu);

      return this._super();
    }

    });


    return {

      'MsgBox' : {
        create: function(options) {
          return new scenes.XSceneFactory([ BGLayer, UILayer ]).create(options);
        }
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

