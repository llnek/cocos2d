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
 * @module zotohlab/asx/msgbox
 */
define("zotohlab/asx/msgbox",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xlayers',
        'zotohlab/asx/xscenes'],

  function (sjs, sh, ccsx, layers, scenes) { "use strict";

    /** @alias module:zotohlab/asx/msgbox */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @class BGLayer
     */
    BGLayer = layers.XLayer.extend({

      rtti() { return "BGLayer"; },

      ctor() {
        const bg= new cc.Sprite(sh.getImagePath('game.bg')),
        cw= ccsx.center();
        this._super();
        bg.setPosition(cw.x, cw.y);
        this.addItem(bg);
      },

      pkInit() {}

    }),
    //////////////////////////////////////////////////////////////////////////
    /**
     * @class UILayer
     */
    UILayer = layers.XLayer.extend({

      pkInit() {
        let qn= new cc.LabelBMFont(sh.l10n(this.options.msg),
                                   sh.getFontPath('font.OCR')),
        cw= ccsx.center(),
        wz= ccsx.vrect(),
        wb = ccsx.vbox(),
        me=this,
        menu;

        this._super();

        qn.setPosition(cw.x, wb.top * 0.75);
        qn.setScale(xcfg.game.scale * 0.25);
        qn.setOpacity(0.9*255);
        this.addItem(qn);

        menu= ccsx.vmenu([
          { imgPath: '#ok.png',
            cb() {
              me.options.yes();
            },
            target: me
          }
        ]);
        menu.setPosition(cw.x, wb.top * 0.1);
        this.addItem(menu);
      }

    });

    exports = /** @lends exports# */{

      /**
       * @property {String} rtti
       */
      rtti: sh.ptypes.mbox,

      /**
       * Create a scene to display the message.
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        return new scenes.XSceneFactory([ BGLayer, UILayer ]).reify(options);
      }

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

