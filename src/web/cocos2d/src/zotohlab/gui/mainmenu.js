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

define("zotohlab/asx/xmmenus", ['cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/xcfg',
                               'zotohlab/asx/ccsx',
                               'zotohlab/asx/xlayers'],
  function (sjs, sh, xcfg, ccsx, layers) { "use strict";

    var csts= xcfg.csts,
    R = sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    // Main menu.
    var XMenuBackLayer = layers.XLayer.extend({

      pkInit: function() {

        var imgUrl= sh.getImagePath('gui.mmenu.menu.bg'),
        s,
        title,
        wz = ccsx.screen(),
        cw = ccsx.center();

        if (!!imgUrl) {
          s= new cc.Sprite(imgUrl);
          s.setPosition(cw);
          this.addItem(s);
        }

        title = new cc.LabelBMFont(sh.l10n('%mmenu'),
                                   sh.getFontPath('font.JellyBelly')),
        title.setPosition(cw.x, wz.height - csts.TILE * 8 / 2);
        title.setOpacity(0.9*255);
        title.setScale(0.6);

        this.addItem(title);

        return this._super();
      },

      rtti: function() { return 'XMenuBackLayer'; }

    });

    //////////////////////////////////////////////////////////////////////////////
    // Main menu.
    var XMenuLayer= layers.XLayer.extend({

      doCtrlBtns: function() {
        var audio = xcfg.assets.sprites['gui.audio'],
        wz = ccsx.screen(),
        cw = ccsx.center(),
        s1 = [null, null, null],
        s2 = [null, null, null],
        menu, t2,t1,
        w= audio[1],
        h= audio[2],
        p= sh.sanitizeUrl(audio[0]);

        for (var n=0; n < 3; ++n) {
          s1[n]= new cc.Sprite(p, cc.rect(w,0,w,h));
          s2[n]= new cc.Sprite(p, cc.rect(0,0,w,h));
        }

        audio= new cc.MenuItemToggle(new cc.MenuItemSprite(s1[0], s1[1], s1[2]),
                            new cc.MenuItemSprite(s2[0], s2[1], s2[2]),
               function(sender) {
                if (sender.getSelectedIndex() === 0) {
                  sh.toggleSfx(true);
                } else {
                  sh.toggleSfx(false);
                }
               });
        audio.setAnchorPoint(cc.p(0,0));
        if (xcfg.sound.open) {
          audio.setSelectedIndex(0);
        } else {
          audio.setSelectedIndex(1);
        }

        menu= new cc.Menu(audio);
        menu.setPosition(csts.TILE + csts.S_OFF,
                         csts.TILE + csts.S_OFF);
        this.addItem(menu);

        //all these to make 2 buttons
        R.map.idx(function(z, pos, lst) {
          lst[pos]= new cc.Sprite( sh.getImagePath('gui.mmenu.back'));
        }, s2);
        R.map.idx(function(z, pos, lst) {
          lst[pos]= new cc.Sprite( sh.getImagePath('gui.mmenu.quit'));
        }, s1);
        t2 = new cc.MenuItemSprite(s2[0], s2[1], s2[2], function() {
          this.options.onBack();
        },this);
        t1 = new cc.MenuItemSprite(s1[0], s1[1], s1[2], function() {
          this.pkQuit();
        }, this);
        menu= new cc.Menu(t1,t2);
        menu.alignItemsHorizontallyWithPadding(10);
        menu.setPosition(wz.width - csts.TILE - csts.S_OFF - (s2[0].getContentSize().width + s1[0].getContentSize().width + 10) * 0.5,
          csts.TILE + csts.S_OFF + s2[0].getContentSize().height * 0.5);
        this.addItem(menu);
      },

      rtti: function() { return 'XMenuLayer'; },

      pkQuit: function() {
        var ss= sh.protos['StartScreen'],
        yn= sh.protos['YesNo'],
        dir = cc.director;

        dir.pushScene( yn.create({
          onBack: function() { dir.popScene(); },
          yes: function() {
            sh.sfxPlay('game_quit');
            dir.popToRootScene();
            dir.runScene(ss.create());
            //dir.replaceRootScene( ss.create() );
          }
        }));
      }

    });

    XMenuLayer.onShowMenu = function() {
      var dir= cc.director;
      dir.pushScene( sh.protos['MainMenu'].create({
        onBack: function() {
          dir.popScene();
        }
      }));
    };

    return {
      XMenuBackLayer: XMenuBackLayer,
      XMenuLayer: XMenuLayer
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

