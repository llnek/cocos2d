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

define("zotohlab/asx/xloader", ['cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/ccsx'],
  function (sjs, sh, ccsx) { "use strict";

    var _instance= null,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    //
    var XLoader = cc.Scene.extend({

      ctor: function () {
        this.bgLayer = new cc.LayerColor(cc.color(0,0,0, 255));
        this.bgLayer.setPosition(0, 0);
        this._super();
      },

      pkLoad: function () {
        var pfx; if (cc.sys.isNative) { pfx= '';  } else { pfx = "/public/ig/res/"; }
        var cw = ccsx.center(),
        s1,s2;

        this.addChild(this.bgLayer);

        // logo
        this.logoSprite = cc.Sprite.create(pfx + 'cocos2d/pics/ZotohLab.png');
        //this.logoSprite.setScale( cc.contentScaleFactor());
        this.logoSprite.setPosition(cw);
        this.bgLayer.addChild(this.logoSprite);

        // progress bar
        s2 = cc.Sprite.create(pfx+'cocos2d/pics/preloader_bar.png');
        //s2.setScale( cc.contentScaleFactor());
        this.progress = cc.ProgressTimer.create(s2);
        this.progress.setType(cc.ProgressTimer.TYPE_BAR);
        this.progress.setScaleX(0.8);
        this.progress.setScaleY(0.3);
        //this.progress.setOpacity(0);
        //this.progress.setPercentage(0);
        this.progress.setPosition(this.logoSprite.getPosition().x, // - 0.5 * this.logo.width / 2 ,
                                  cw.y - this.logoSprite.getContentSize().height * 0.6 );//- 10);
        //this.progress.setMidpoint(cc.p(0,0));
        this.bgLayer.addChild(this.progress);

        this.scheduleOnce(this.pkStartLoading);
      },

      onEnter: function () {
        this._super();
        this.pkLoad();
      },

      /*
      onExit: function () {
      },
      */

      initWithResources: function (resources, selector, target) {
        this.resources = resources;
        this.selector = selector;
        this.target = target;
      },

      niceFadeOut: function() {
        this.logoSprite.runAction( cc.Sequence.create(
                                          cc.FadeOut.create(1.2),
                                          cc.CallFunc.create(this.selector, this.target)));
      },

      pkStartLoading: function () {
        var res = this.resources,
        me=this;

        this._length = res.length;
        this._count=0;

        cc.loader.load(res, function(result,cnt) {
          me._count= cnt;
        }, function() {
          me.niceFadeOut();
        });
        this.schedule(this.update, 0.25);
      },

      update: function () {
        var cnt = this._count,
        len = this._length,
        percent = (cnt / len * 100) | 0;
        percent = Math.min(percent, 100);
        this.progress.setPercentage(percent);
        if (cnt >= len) {
          this.unscheduleUpdate();
        }
      }


    });


    //////////////////////////////////////////////////////////////////////////////
    //
    XLoader.preload = function (resources, selector, target) {
      var director = cc.director;

      if (!_instance) { _instance = new XLoader(); }

      _instance.initWithResources(resources, selector, target);
      director.runScene(_instance);

      return _instance;
    };


    return XLoader;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

