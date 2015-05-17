// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xlayers
 * @requires zotohlab/asx/xscenes
 * @module zotohlab/asx/ynbox
 */
define("zotohlab/asx/ynbox",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xlayers',
        'zotohlab/asx/xscenes'],

  function (sjs, sh, ccsx, layers, scenes) { "use strict";

    /** @alias module:zotohlab/asx/ynbox */
    var exports = {},
    xcfg= sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    BGLayer = layers.XLayer.extend({

      rtti: function() { return "BGLayer"; },

      ctor: function() {
        var bg= new cc.Sprite(sh.getImagePath('game.bg')),
        cw= ccsx.center();
        this._super();
        bg.setPosition(cw.x, cw.y);
        this.addItem(bg);
      },

      pkInit: function() {}

    }),
    //////////////////////////////////////////////////////////////////////////
    UILayer =  layers.XLayer.extend({

      pkInit: function() {
        var qn= new cc.LabelBMFont(sh.l10n('%quit?'),
                                   sh.getFontPath('font.OCR')),
        cw= ccsx.center(),
        wz= ccsx.vrect(),
        wb= ccsx.vbox(),
        me=this,
        menu;

        this._super();

        qn.setPosition(cw.x, wb.top * 0.75);
        qn.setScale(xcfg.game.scale * 0.25);
        qn.setOpacity(0.9*255);
        this.addItem(qn);

        menu= ccsx.vmenu([
          { imgPath: '#continue.png',
            cb: function() {
              me.options.yes();
            },
            target: me },

          { imgPath: '#cancel.png',
            cb: function() {
              me.options.onBack();
            },
            target: me }
        ]);
        menu.setPosition(cw.x, cw.y);
        this.addItem(menu);
      }

    });

    exports = {

      /**
       * @property {String} rtti
       * @static
       */
      rtti: sh.ptypes.yn,

      /**
       * Create a YesNo message screen.
       *
       * @method reify
       * @static
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify: function(options) {
        return new scenes.XSceneFactory( [ BGLayer, UILayer ]).reify(options);
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

