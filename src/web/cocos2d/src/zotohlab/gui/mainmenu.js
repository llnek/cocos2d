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
 * @module zotohlab/asx/xmmenus
 */
define("zotohlab/asx/xmmenus",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xlayers'],

  function (sjs, sh, ccsx, layers) { "use strict";

    /** @alias module:zotohlab/asx/xmmenus */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends XLayer
     * @class XMenuBackLayer
     */
    XMenuBackLayer = layers.XLayer.extend({

      /**
       * @memberof module:zotohlab/asx/xmmenus~XMenuBackLayer
       * @method pkInit
       * @protected
       */
      pkInit() {
        this.setBg();
        this.setTitle();
      },

      setTitle() {
        let title = new cc.LabelBMFont(sh.l10n('%mmenu'),
                                       sh.getFontPath('font.JellyBelly'));
        title.setPosition(cw.x, wb.top - csts.TILE * 8 / 2);
        title.setOpacity(0.9*255);
        title.setScale(0.2);
        this.addItem(title);
      },

      setBg() {
        this.centerImage(sh.getImagePath('gui.mmenu.menu.bg'));
      },

      /**
       * @memberof module:zotohlab/asx/xmmenus~XMenuBackLayer
       * @method rtti
       * @return {String} id
       */
      rtti() { return 'XMenuBackLayer'; }

    }),

    /**
     * @extends XLayer
     * @class XMenuLayer
     */
    XMenuLayer= layers.XLayer.extend({

      /**
       * @memberof module:zotohlab/asx/xmmenus~XMenuLayer
       * @method rtti
       * @return {String} id
       */
      rtti() { return 'XMenuLayer'; },

      mkBackQuit(vert, btns, posfn) {
        let sz, menu;

        if (vert) {
          menu = ccsx.vmenu(btns);
        } else {
          menu= ccsx.hmenu(btns);
        }

        sz= menu.getChildren()[0].getContentSize();
        if (posfn) {
          posfn(menu, sz);
        }
        this.addItem(menu);
      },

      mkAudio(options) {
        this.addAudioIcon(options);
      }

    });

    exports = /** @lends exports# */{
      /**
       * @property {XMenuBackLayer} XMenuBackLayer
       */
      XMenuBackLayer: XMenuBackLayer,

      /**
       * @property {XMenuLayer} XMenuLayer
       */
      XMenuLayer: XMenuLayer,

      /**
       * @method showMenu
       */
      showMenu() {
        const dir= cc.director;
        dir.pushScene( sh.protos[sh.ptypes.mmenu].reify({
          onBack() {
            dir.popScene();
          }
        }));
      }

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

