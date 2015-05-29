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

  function (scenes, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/mmenu */
    let exports= {},
    sjs=sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R=sjs.ramda,
    undef,
    SEED= {
      ppids: {},
      grid: [
        0,0,0,
        0,0,0,
        0,0,0
      ],
      size: 3,
      pnum: 1,
      mode: 0
    },
    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XLayer
     * @class BackLayer
     */
    BackLayer = scenes.XLayer.extend({
      /**
       * @method setup
       * @private
       */
      setup() {
        this.centerImage(sh.getImagePath('gui.mmenu.menu.bg'));
        this.title();
      },
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
          color: cc.color(246,177,127),
          scale: xcfg.game.scale
        });
        this.addItem(tt);
      }
    }),
    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XMenuLayer
     * @class MainMenuLayer
     */
    MainMenuLayer = scenes.XMenuLayer.extend({
      /**
       * @method onnetplay
       * @private
       */
      onnetplay(msg) {
        const gl= sh.protos[sh.ptypes.game],
        ol= sh.protos[sh.ptypes.online],
        mm= sh.protos[sh.ptypes.mmenu],
        dir= cc.director;
        msg.yes= (wss,pnum,startmsg) => {
          const m= sjs.mergeEx( R.omit(['yes', 'onBack'], msg), {
            wsock: wss,
            pnum: pnum
          });
          sjs.merge(m, startmsg);
          dir.runScene( gl.reify(m));
        }
        msg.onBack= () => { dir.runScene( mm.reify()); };
        dir.runScene(ol.reify(msg));
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
        const color= cc.color(94,49,120),
        cw = ccsx.center(),
        wb= ccsx.vbox(),
        p={},
        menu= ccsx.vmenu([
          { nnn: '#online.png',
            target: this,
            cb() {
              this.onnetplay(sjs.mergeEx(SEED,
                                         { mode: sh.gtypes.ONLINE_GAME}));
            }},
          { nnn: '#player2.png',
            target: this,
            cb() {
              p[ sh.l10n('%p1') ] = [ 1, sh.l10n('%player1') ];
              p[ sh.l10n('%p2') ] = [ 2, sh.l10n('%player2') ];
              this.onplay(sjs.mergeEx(SEED,
                                      {ppids: p,
                                       mode: sh.gtypes.P2_GAME }));
            }},
          { nnn: '#player1.png',
            target: this,
            cb() {
              p[ sh.l10n('%cpu') ] = [ 2, sh.l10n('%computer') ];
              p[ sh.l10n('%p1') ] = [ 1,  sh.l10n('%player1') ];
              this.onplay(sjs.mergeEx(SEED,
                                      {ppids: p,
                                       mode: sh.gtypes.P1_GAME }));
            }}
        ],
        { pos: cw });
        this.addItem(menu);

        this.mkBackQuit(false, [{
            nnn: '#icon_back.png',
            color: color,
            cb() {
              this.options.onBack();
            },
            target: this },
          { nnn: '#icon_quit.png',
            color: color,
            cb() { this.onQuit(); },
            target: this
          }],
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
      rtti: sh.ptypes.mmenu,
      /**
       * Create the Main Menu screen.
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        return new scenes.XSceneFactory([
          BackLayer,
          MainMenuLayer
        ]).reify(options);
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

