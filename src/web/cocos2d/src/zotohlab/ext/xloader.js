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

function moduleFactory(sjs, asterix, ccsx, undef) { "use stricts";
var sh = asterix;

//////////////////////////////////////////////////////////////////////////////
//
var XLoader = cc.Scene.extend({

  ctor: function () {
    this.bgLayer = new cc.LayerColor(cc.color(0,0,0, 255));
    this.bgLayer.setPosition(0, 0);
    this.logoSprite= null;
    this.bgLayer= null;
    this.logo= null;
    this._super();
  },

  _instance: null,


  pkLoadBar: function() {
    var pfx = '/public/ig/res';
    if (cc.sys.isNative) {
      pfx= 'res';
    }
    cc.loader.loadImg(pfx+'/cocos2d/game/preloader_bar.png',
                      {isCrossOrigin : false },
      function(err, img) {
        if (err) { cc.error('failed to load progress-bar.png'); } else {
          this.pbar= img;
          this.pkInitStage();
        }
    }.bind(this));
  },

  pkLoad: function() {
    var pfx = '/public/ig/res';
    if (cc.sys.isNative) {
      pfx= 'res';
    }
    cc.loader.loadImg(pfx+'/main/ZotohLab_x200.png',
                      {isCrossOrigin : false },
      function(err, img) {
        if (err) { cc.error('failed to load zotohlab.png'); } else {
          this.logo= img;
          this.pkLoadBar();
        }
    }.bind(this));
  },

  pkInitStage: function () {
    var logo2d = new cc.Texture2D(),
    pbar2d= new cc.Texture2D(),
    cw = ccsx.center(),
    me= this,
    s1,s2;

    logo2d.initWithElement(this.logo);
    logo2d.handleLoadedTexture();

    pbar2d.initWithElement(this.pbar);
    pbar2d.handleLoadedTexture();

    this.addChild(this.bgLayer);

    this.logoSprite = cc.Sprite.create(logo2d);
    //this.logoSprite.setScale( cc.contentScaleFactor());
    this.logoSprite.setPosition(cw);
    this.bgLayer.addChild(this.logoSprite);

    s2 = cc.Sprite.create(pbar2d);
    //s2.setScale( cc.contentScaleFactor());
    this.progress = cc.ProgressTimer.create(s2);
    this.progress.setType(cc.ProgressTimer.TYPE_BAR);
    this.progress.setScaleX(0.8);
    this.progress.setScaleY(0.3);
    //this.progress.setOpacity(0);
    //this.progress.setPercentage(0);
    this.progress.setPosition(this.logoSprite.getPosition().x, // - 0.5 * this.logo.width / 2 ,
                              cw.y - this.logo.height / 2 - 10);
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

  if (!this._instance) {
    this._instance = new XLoader();
  }

  this._instance.initWithResources(resources, selector, target);
  director.runScene(this._instance);
  return this._instance;
};


return XLoader;
}


//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("cherimoia/zotohlab/asterix/xloader",
            ['cherimoia/skarojs',
             'cherimoia/zotohlab/asterix',
             'cherimoia/zotohlab/asterix/ccsx'],
            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

