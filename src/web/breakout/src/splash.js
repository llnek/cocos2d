// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define('zotohlab/p/splash', ['cherimoia/skarojs',
                            'zotohlab/asterix',
                            'zotohlab/asx/ccsx',
                            'zotohlab/asx/xlayers',
                            'zotohlab/asx/xscenes',
                            'zotohlab/asx/xsplash'],

  function (sjs, sh, ccsx, layers, scenes, XSplashLayer) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    UILayer = layers.XLayer.extend({

      pkInit: function() {
        var cw = ccsx.center(),
        wz = ccsx.screen();

        this._super();

        this.addItem( ccsx.pmenu1({
          imgPath: sh.getImagePath('splash.play-btn'),
          pos: cc.p(cw.x, wz.height * 0.20),
          selector: function() {
            sh.fireEvent('/splash/controls/playgame');
          },
          target: this
        }));

      }

    });

    return {

      'StartScreen' : {

        create: function(options) {
          var scene = new scenes.XSceneFactory([
            XSplashLayer,
            UILayer
          ]).create(options);

          scene.ebus.on('/splash/controls/playgame', function() {
              var ss= sh.protos['StartScreen'],
              mm= sh.protos['MainMenu'],
              dir = cc.director;
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

