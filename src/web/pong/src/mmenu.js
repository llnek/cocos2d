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
 * @module zotohlab/p/mmenu
 */
define("zotohlab/p/mmenu",

       ['zotohlab/asx/xscenes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (scenes, sh, ccsx ) { "use strict";

    let SEED= { ppids: { }, pnum: 1, mode: 0 },
    /** @alias zotohlab/p/mmenu */
    exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    R=sjs.ramda,
    csts= xcfg.csts,
    undef,
    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xmmenus.XMenuLayer
     * @class MainMenuLayer
     */
    MainMenuLayer = scenes.XMenuLayer.extend({
      /**
       * @method title
       * @private
       */
      title() {
        const wb=ccsx.vbox(),
        cw= ccsx.center(),
        tt=ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.JellyBelly'),
          text: sh.l10n('%mmenu'),
          pos: cc.p(cw.x, wb.top * 0.9),
          color: cc.color('#EDFF90'),
          scale: xcfg.game.scale
        });
        this.addItem(tt);
      },
      /**
       * @method onplaynet
       * @private
       */
      onplaynet(msg) {
        const net = sh.protos[sh.ptypes.online],
        game = sh.protos[sh.ptypes.game],
        mm = sh.protos[sh.ptypes.mmenu],
        dir=cc.director;
        msg.onBack=() => {
          dir.runScene( mm.reify());
        };
        msg.yes= (wss,pnum,startmsg) => {
          const m= sjs.mergeEx(R.omit(['yes','onBack'], msg),
                               { wsock: wss, pnum: pnum });
          m.ppids = startmsg.ppids;
          dir.runScene( game.reify(m));
        }
        dir.runScene(net.reify(msg));
      },
      /**
       * @method onplay
       * @private
       */
      onplay(msg) {
        cc.director.runScene(sh.protos[sh.ptypes.game].reify(msg));
      },
      /**
       * @method setup
       * @protected
       */
      setup() {
        this.centerImage(sh.getImagePath('gui.mmenu.menu.bg'));
        this.title();
        const color= cc.color('#32baf4'),
        cw= ccsx.center(),
        wb= ccsx.vbox(),
        p={},
        menu = ccsx.vmenu([
          { nnn: '#online.png',
            target: this,
            cb() {
              this.onplaynet(sjs.mergeEx(SEED,
                                         {mode: sh.gtypes.ONLINE_GAME }));
            }
          },
          { nnn: '#player2.png',
            target: this,
            cb() {
              p[ sh.l10n('%p1') ] = [ 1, sh.l10n('%player1') ];
              p[ sh.l10n('%p2') ] = [ 2, sh.l10n('%player2') ];
              this.onplay(sjs.mergeEx(SEED,
                                      {ppids: p,
                                       mode: sh.gtypes.P2_GAME }));
            }
          },
          { nnn: '#player1.png',
            target: this,
            cb() {
              p[ sh.l10n('%cpu') ] = [ 2, sh.l10n('%computer') ];
              p[ sh.l10n('%p1') ] = [ 1,  sh.l10n('%player1') ];
              this.onplay(sjs.mergeEx(SEED,
                                      { ppids: p,
                                        mode: sh.gtypes.P1_GAME }));
            }
          }], { pos: cw });
        this.addItem(menu);

        this.mkBackQuit(false, [
          { nnn: '#icon_back.png',
            color: color,
            cb() {
              this.options.onBack();
            },
            target: this },
          { nnn: '#icon_quit.png',
            color: color,
            cb() { this.onQuit(); },
            target: this }
        ],
        (m,z) => {
          m.setPosition(wb.left + csts.TILE + z.width * 1.1,
                        wb.bottom + csts.TILE + z.height * 0.45);
        });

        this.mkAudio({
          pos: cc.p(wb.right - csts.TILE,
                    wb.bottom + csts.TILE),
          color: color,
          anchor: ccsx.acs.BottomRight
        });
      }

    });

    exports= /** @lends exports# */{
      /**
       * @property {String} rtti
       */
      rtti : sh.ptypes.mmenu,
      /**
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        return new scenes.XSceneFactory([
          MainMenuLayer
        ]).reify(options);
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

