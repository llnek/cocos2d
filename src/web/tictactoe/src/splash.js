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

    BGLayer = layers.XLayer.extend({

      rtti: function() { return "BGLayer"; },

      ctor: function() {
        var bg= new cc.Sprite(sh.getImagePath('game.bg')),
        cw= ccsx.center();
        this._super();
        bg.setPosition(cw.x, cw.y);
        this.addItem(bg);
      }

    }),

    SplashLayer = layers.XLayer.extend({

      pkInit: function() {

        var wb = ccsx.vbox(),
        me=this,
        tt, menu,
        cw = ccsx.center();

        this._super();

        tt= ccsx.createSpriteFrame('title.png');
        tt.setPosition(cw.x, wb.top * 0.9);
        this.addItem(tt);

        menu= ccsx.pmenu([
          { imgPath: '#play.png',
            cb: function() {
              sh.fireEvent('/splash/controls/playgame');
            },
            target: me } ],
          1, 2);

        menu.alignItemsVerticallyWithPadding(2);
        menu.setPosition(cw.x, wb.top * 0.10);
        this.addItem(menu);

        this.showGrid();
      },

      rtti: function() { return "SplashLayer"; },

      showGrid: function() {
        var scale= 0.75, me=this, pos=0, fm, sp,
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
          sp.setPosition( mp.x1 + (mp.x2 - mp.x1) * 0.5,
                          mp.y2 + (mp.y1 - mp.y2) * 0.5);
          sp.setScale(scale);
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

