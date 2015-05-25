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
 * @requires zotohlab/asx/xmmenus
 * @requires zotohlab/asx/xscenes
 * @module zotohlab/p/mmenu
 */
define("zotohlab/p/mmenu",

       ['cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx',
       'zotohlab/asx/xlayers',
       'zotohlab/asx/xmmenus',
       'zotohlab/asx/xscenes'],

  function (sjs, sh, ccsx, mmenus, scenes) { "use strict";

    let SEED= { ppids: { }, pnum: 1, mode: 0 },
    /** @alias zotohlab/p/mmenu */
    exports = {},
    xcfg = sh.xcfg,
    R=sjs.ramda,
    csts= xcfg.csts,
    undef,

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xmmenus.XMenuBackLayer
     * @class BackLayer
     */
    BackLayer = mmenus.XMenuBackLayer.extend({

      /**
       * @method setTitle
       * @protected
       */
      setTitle() {
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
      }

    }),

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xmmenus.XMenuLayer
     * @class MainMenuLayer
     */
    MainMenuLayer = mmenus.XMenuLayer.extend({

      /**
       * @method pkInit
       * @protected
       */
      pkInit() {
        const color= cc.color('#32baf4'),
        cw= ccsx.center(),
        wb= ccsx.vbox(),
        menu = ccsx.vmenu([
          { imgPath: '#online.png',
            cb() {
              sh.fire('/mmenu/online',
                      sjs.mergeEx(SEED,
                                  { mode: sh.gtypes.ONLINE_GAME }));
            }
          },
          { imgPath: '#player2.png',
            cb() {
              const pobj2={};
              pobj2[ sh.l10n('%p1') ] = [ 1, sh.l10n('%player1') ];
              pobj2[ sh.l10n('%p2') ] = [ 2, sh.l10n('%player2') ];
              sh.fire('/mmenu/newgame',
                      sjs.mergeEx(SEED, {
                             ppids: pobj2,
                             mode: sh.gtypes.P2_GAME }));
            }
          },
          {
            imgPath: '#player1.png',
            cb() {
              const pobj1={};
              pobj1[ sh.l10n('%cpu') ] = [ 2, sh.l10n('%computer') ];
              pobj1[ sh.l10n('%p1') ] = [ 1,  sh.l10n('%player1') ];
              sh.fire('/mmenu/newgame',
                      sjs.mergeEx(SEED, {
                             ppids: pobj1,
                             mode: sh.gtypes.P1_GAME }));
            }
          }
        ]);
        menu.setPosition(cw);
        this.addItem(menu);

        this.mkAudio({
          pos: cc.p(wb.right - csts.TILE,
                    wb.bottom + csts.TILE),
          color: color,
          anchor: ccsx.acs.BottomRight
        });

        this.mkBackQuit(false, [
          { imgPath: '#icon_back.png',
            color: color,
            cb() {
              this.options.onBack();
            },
            target: this },
          { imgPath: '#icon_quit.png',
            color: color,
            cb() { this.onQuit(); },
            target: this }
        ],
        (m,z) => {
          m.setPosition(wb.left + csts.TILE + z.width * 1.1,
                        wb.bottom + csts.TILE + z.height * 0.45);
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

        const net = sh.protos[sh.ptypes.online],
        game = sh.protos[sh.ptypes.game],
        mm = sh.protos[sh.ptypes.mmenu],
        dir=cc.director,
        scene = new scenes.XSceneFactory([
          BackLayer,
          MainMenuLayer
        ]).reify(options);

        scene.onmsg('/mmenu/newgame', (topic, msg) => {
          dir.runScene( game.reify(msg));
        }).
        onmsg('/mmenu/online', (topic, msg) => {
          msg.onBack=() => {
            dir.runScene( mm.reify());
          };
          msg.yes= (wss,pnum,startmsg) => {
            const m= sjs.mergeEx(R.omit(['yes','onBack'], msg),
                                 { wsock: wss, pnum: pnum });
            m.ppids = startmsg.ppids;
            dir.runScene( game.reify(m));
          }
          dir.runScene( net.reify(msg));
        });

        return scene;
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

