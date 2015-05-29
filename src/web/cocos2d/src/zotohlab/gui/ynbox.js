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
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/asx/ynbox
 */
define("zotohlab/asx/ynbox",

       ['zotohlab/asx/xscenes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (scenes, sh, ccsx ) { "use strict";

    /** @alias module:zotohlab/asx/ynbox */
    let exports = {},
    sjs= sh.skarojs,
    xcfg= sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XLayer
     * @class BGLayer
     */
    BGLayer = scenes.XLayer.extend({
      /**
       * @method rtti
       */
      rtti() { return "BackLayer"; },
      /**
       * @method setup
       * @protected
       */
      setup() {
        this.centerImage(sh.getImagePath('game.bg'));
      }

    }),
    //////////////////////////////////////////////////////////////////////////
    /**
     * @module zotohlab/asx/xscenes.XLayer
     * @class UILayer
     */
    UILayer =  scenes.XLayer.extend({

      /**
       * @method setup
       * @protected
       */
      setup() {
        let qn= new cc.LabelBMFont(sh.l10n('%quit?'),
                                   sh.getFontPath('font.OCR')),
        cw= ccsx.center(),
        wz= ccsx.vrect(),
        wb= ccsx.vbox(),
        menu;

        qn.setPosition(cw.x, wb.top * 0.75);
        qn.setScale(xcfg.game.scale * 0.25);
        qn.setOpacity(0.9*255);
        this.addItem(qn);

        menu= ccsx.vmenu([
          { nnn: '#continue.png',
            cb() {
              this.options.yes();
            },
            target: this },

          { nnn: '#cancel.png',
            cb() {
              this.options.onBack();
            },
            target: this }
        ],
        { pos: cw});
        this.addItem(menu);
      }

    });

    exports = /** @lends exports# */{
      /**
       * @property {String} rtti
       */
      rtti: sh.ptypes.yn,
      /**
       * Create a YesNo message screen.
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        return new scenes.XSceneFactory( [ BackLayer, UILayer ]).reify(options);
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

