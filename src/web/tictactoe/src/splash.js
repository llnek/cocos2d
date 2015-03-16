// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

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

        var cw = ccsx.center(),
        wb = ccsx.vbox(),
        menu;

        // show the background and title
        this.centerImage(sh.getImagePath('game.bg'));
        this.addFrame('#title.png',
                      cc.p(cw.x, wb.top * 0.9));

        // show the play button
        menu= ccsx.vmenu([
          { imgPath: '#play.png',
            cb: function() {
              this.removeAll();
              sh.fireEvent('/splash/controls/playgame');
            },
            target: this }
        ]);
        menu.setPosition(cw.x, wb.top * 0.10);
        this.addItem(menu);

        // show the demo icons
        this.showGrid();
      },

      showGrid: function() {
        var scale= 0.75, me=this,
        pos=0,
        fm, sp, bx;

        // we scale down the icons to make it look nicer
        R.forEach(function(mp) {
          // set up the grid icons
          if (pos === 1 || pos===5 || pos===6 || pos===7) { fm= '#x.png'; }
          else if (pos===0 || pos===4) { fm= '#z.png'; }
          else { fm= '#o.png'; }
          sp= new cc.Sprite(fm);
          bx=ccsx.vboxMID(mp);
          sp.setScale(scale);
          sp.setPosition(bx);
          me.addItem(sp);
          ++pos;
        },
        utils.mapGridPos(3,scale));
      }

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

