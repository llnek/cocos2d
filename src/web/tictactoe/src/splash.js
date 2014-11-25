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

define("zotohlab/p/splash", ['cherimoia/skarojs',
                            'zotohlab/asterix',
                            'zotohlab/asx/ccsx',
                            'zotohlab/asx/xlayers',
                            'zotohlab/asx/xscenes'],
  function (sjs, sh, ccsx, layers, scenes) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    BGLayer = cc.LayerColor.extend({

      rtti: function() { return "BGLayer"; },

      ctor: function() {
        //this._super(cc.color(38,119,120));
        this._super(cc.color(72,142,142));
      }

    }),

    SplashLayer = layers.XLayer.extend({

      pkInit: function() {

        var wb = ccsx.vbox(),
        me=this,
        tt, menu,
        cw = ccsx.center();

        this._super();

        tt= new cc.Sprite(sh.getImagePath('splash.title'));
        tt.setPosition(cw.x, wb.top * 0.9);
        this.addItem(tt);

        menu= ccsx.pmenu([
          { imgPath: sh.getImagePath('splash.play'),
            cb: function() {
              sh.fireEvent('/splash/controls/playgame');
            },
            target: me } ],
          1, 2);

        menu.alignItemsVerticallyWithPadding(2);
        menu.setPosition(cw.x, wb.top * 0.15);
        this.addItem(menu);
      },

      rtti: function() { return "SplashLayer"; }

    });

    //////////////////////////////////////////////////////////////////////////////
    return {
      'StartScreen' : {
        create: function(options) {
          var scene = new scenes.XSceneFactory([
            BGLayer, SplashLayer
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

