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

define("zotohlab/p/splash", ['zotohlab/p/s/utils',
                            'cherimoia/skarojs',
                            'zotohlab/asterix',
                            'zotohlab/asx/ccsx',
                            'zotohlab/asx/xlayers',
                            'zotohlab/asx/xscenes'],
  function (utils, sjs, sh, ccsx, layers, scenes) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    SplashLayer = layers.XLayer.extend({

      rtti: function() { return "SplashLayer"; },

      pkInit: function() {

        var bg= new cc.Sprite(sh.getImagePath('game.bg')),
        cw = ccsx.center(),
        wb = ccsx.vbox(),
        me=this,
        tt, menu;

        bg.setPosition(cw.x, cw.y);
        this.addItem(bg);

        tt= ccsx.createSpriteFrame('title.png');
        tt.setPosition(cw.x, wb.top * 0.9);
        this.addItem(tt);

        menu= ccsx.vmenu([
          { imgPath: '#play.png',
            cb: function() {
              this.removeAll();
              sh.fireEvent('/splash/controls/playgame');
            },
            target: me
          }
        ]);

        menu.setPosition(cw.x, wb.top * 0.10);
        this.addItem(menu);

        this.showGrid();
      },

      showGrid: function() {
        var scale= 0.75, me=this, pos=0, fm, sp, bx,
        mgs = utils.mapGridPos(3,scale);

        R.forEach(function(mp) {
          if (pos === 1 || pos===5 || pos===6 || pos===7) {
            fm= 'x.png';
          } else if (pos===0 || pos===4) {
            fm= 'z.png';
          } else {
            fm= 'o.png';
          }
          sp= ccsx.createSpriteFrame(fm);
          bx=ccsx.vboxMID(mp);
          sp.setScale(scale);
          sp.setPosition(bx);
          me.addItem(sp);
          ++pos;
        }, mgs);
      },

    });

    //////////////////////////////////////////////////////////////////////////////
    return {
      'StartScreen' : {
        create: function(options) {
          var scene = new scenes.XSceneFactory([
            SplashLayer
          ]).create(options);
          scene.ebus.on('/splash/controls/playgame',
                        function() {
                          var ss= sh.protos['StartScreen'],
                          mm= sh.protos['MainMenu'],
                          dir= cc.director;
                          dir.runScene( mm.create({
                            onBack: function() { dir.runScene( ss.create() ); }
                          }));
          });
          return scene;
        }
      }
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

