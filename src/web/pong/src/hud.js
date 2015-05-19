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
 * @module zotohlab/p/hud
 */
define("zotohlab/p/hud",

       ['cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx',
       'zotohlab/asx/xlayers'],

  function(sjs, sh, ccsx, layers) { "use strict";

    /** @alias module:zotohlab/p/hud */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class BackLayer
     */
    BackLayer = layers.XLayer.extend({

      rtti: function() { return 'BackLayer'; },

      pkInit: function() {
        this.centerImage(sh.getImagePath('game.bg'));
      }

    }),

    /**
     * @class HUDLayer
     */
    HUDLayer = layers.XGameHUDLayer.extend({

      /**
       * @memberof module:zotohlab/p/hud~HUDLayer
       * @method ctor
       * @param {Object} options
       */
      ctor: function(options) {
        var color= cc.color('#32baf4'),
        scale;

        this._super(options);
        this.scores=  {};
        this.mode= 0;
        this.p2Long= '';
        this.p1Long= '';
        this.p2ID= '';
        this.p1ID= '';

        this.options.i_replay= {
          imgPath: '#icon_replay.png',
          where: ccsx.acs.Top,
          color:color,
          scale : scale,
          visible: false,
          cb: function() {
            sh.fire('/hud/replay');
          }
        };

        this.options.i_menu= {
          imgPath: '#icon_menu.png',
          where: ccsx.acs.Top,
          color: color,
          scale: scale,
          cb: function() {
            sh.fire('/hud/showmenu');
          }
        };
      },

      /**
       */
      setGameMode: function(mode) {
        this.mode=mode;
      },

      initAtlases: sjs.NILFUNC,
      initIcons: sjs.NILFUNC,

      /**
       * @memberof module:zotohlab/p/hud~HUDLayer
       * @method regoPlayer
       * @param {Object} p1
       * @param {Array} p1ids
       * @param {Object} p2
       * @param {Array} p2ids
       */
      regoPlayers: function(p1,p1ids,p2,p2ids) {
        var cw= ccsx.center(),
        wb= ccsx.vbox();

        this.play2= p2;
        this.play1= p1;
        this.p2Long= p2ids[1];
        this.p1Long= p1ids[1];
        this.p2ID= p2ids[0];
        this.p1ID= p1ids[0];
        this.title.setString(this.p1ID + " / " + this.p2ID);

        this.score1.setPosition( cw.x - ccsx.getScaledWidth(this.title)/2 -
                                 ccsx.getScaledWidth(this.score1)/2 - 10,
                                 wb.top - csts.TILE * 6 /2 - 2);
        this.score2.setPosition( cw.x + ccsx.getScaledWidth(this.title)/2 +
                                 ccsx.getScaledWidth(this.score2)/2 + 6,
                                 wb.top - csts.TILE * 6 /2 - 2);
      },

      /**
       */
      resetAsNew: function() {
        this.reset();
      },

      /**
       */
      reset: function() {
        this.scores=  {};
        this.scores[csts.P2_COLOR] = 0;
        this.scores[csts.P1_COLOR] = 0;

        this.replayBtn.setVisible(false);
        this.resultMsg.setVisible(false);
        this.drawScores();
      },

      /**
       */
      endGame: function() {
        this.replayBtn.setVisible(true);
        this.resultMsg.setVisible(true);
      },

      /**
       */
      initLabels: function() {
        var cw= ccsx.center(),
        wb= ccsx.vbox();

        this.title= ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.TinyBoxBB'),
          text: '',
          scale: xcfg.game.scale * 0.3,
          pos: cc.p(cw.x, wb.top - csts.TILE * 6 /2 )
        });
        this.addItem(this.title);

        this.score1= ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.OCR'),
          text: '8',
          scale: xcfg.game.scale * 0.25,
          color: cc.color('#ffffff')
        });
        this.addItem(this.score1);

        this.score2= ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.OCR'),
          text: '8',
          scale: xcfg.game.scale * 0.25,
          color: cc.color('#ffffff')
        });
        this.addItem(this.score2);

        this.resultMsg = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.CoffeeBuzzed'),
          text: '',
          visible: false,
          pos: cc.p(cw.x,  100),
          scale: xcfg.game.scale * 0.15
        });
        this.addItem(this.resultMsg);

        this.initCtrlBtns(1, cc.ALIGN_TOP);
      },

      /**
       */
      isDone: function() {
        var s2= this.scores[this.play2],
        s1= this.scores[this.play1],
        rc= [false, null];

        if (s2 >= csts.NUM_POINTS) { rc = [ true, this.play2]; }
        if (s1 >= csts.NUM_POINTS) { rc = [ true, this.play1]; }
        return rc;
      },

      /**
       */
      updateScores: function(scores) {
        this.scores[this.play2] = scores[this.play2];
        this.scores[this.play1] = scores[this.play1];
        this.drawScores();
      },

      /**
       */
      updateScore: function(color,value) {
        this.scores[color] = this.scores[color] + value;
        this.drawScores();
      },

      /**
       */
      drawScores: function() {
        var s2 = this.play2 ? this.scores[this.play2] : 0,
        s1 = this.play1 ? this.scores[this.play1] : 0,
        n2 = sjs.prettyNumber(s2,1),
        n1 = sjs.prettyNumber(s1,1);
        this.score1.setString(n1);
        this.score2.setString(n2);
      },

      /**
       */
      drawResult: function(winner) {
        var msg="";
        if (winner === csts.P2_COLOR) {
          msg= sh.l10n('%whowin', { who: this.p2Long});
        } else {
          msg= sh.l10n('%whowin', { who: this.p1Long});
        }
        this.resultMsg.setString(msg);
      }

    });

    exports= {
      /**
       * @property {BackLayer} BackLayer
       * @static
       */
      BackLayer: BackLayer,

      /**
       * @property {HUDLayer} HUDLayer
       * @static
       */
      HUDLayer: HUDLayer
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

