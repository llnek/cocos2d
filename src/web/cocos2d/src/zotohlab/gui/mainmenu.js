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
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    //////////////////////////////////////////////////////////////////////////
    /**
     * @class XMenuBackLayer
     */
    XMenuBackLayer = layers.XLayer.extend({

      /**
       * @memberof module:zotohlab/asx/xmmenus~XMenuBackLayer
       * @method pkInit
       * @protected
       */
      pkInit: function() {
        this.setBg();
        this.setTitle();
      },

      setTitle: function() {
        var title = new cc.LabelBMFont(sh.l10n('%mmenu'),
                                       sh.getFontPath('font.JellyBelly')),
        title.setPosition(cw.x, wb.top - csts.TILE * 8 / 2);
        title.setOpacity(0.9*255);
        title.setScale(0.2);
        this.addItem(title);
      },

      setBg : function() {
        this.centerImage(sh.getImagePath('gui.mmenu.menu.bg'));
      },

      /**
       * @memberof module:zotohlab/asx/xmmenus~XMenuBackLayer
       * @method rtti
       * @return {String} - id
       */
      rtti: function() { return 'XMenuBackLayer'; }

    }),

    /**
     * @class XMenuLayer
     */
    XMenuLayer= layers.XLayer.extend({

      /**
       *
       * @memberof module:zotohlab/asx/xmmenus~XMenuLayer
       * @method rtti
       * @return {String} - id
       */
      rtti: function() { return 'XMenuLayer'; },

      mkBackQuit: function(vert, btns, posfn) {
        var sz, menu;

        if (vert) {
          menu = ccsx.vmemu(btns);
        } else {
          menu= ccsx.hmenu(btns);
        }

        sz= menu.getChildren()[0].getContentSize();
        if (posfn) {
          posfn(menu, sz);
        }
        this.addItem(menu);
      },

      mkAudio: function(options) {
        this.addAudioIcon(options);
      }

    });


    /**
     * @memberof module:zotohlab/asx/xmmenus~XMenuLayer
     * @method onShowMenu
     * @static
     */
    XMenuLayer.onShowMenu = function() {
      var dir= cc.director;
      dir.pushScene( sh.protos['MainMenu'].create({
        onBack: function() {
          dir.popScene();
        }
      }));
    };

    /**
     * @property {XMenuBackLayer.Class} XMenuBackLayer
     * @final
     */
    exports.XMenuBackLayer= XMenuBackLayer;

    /**
     * @property {XMenuLayer.Class} XMenuLayer
     * @final
     */
    exports.XMenuLayer= XMenuLayer;

    return exports;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

