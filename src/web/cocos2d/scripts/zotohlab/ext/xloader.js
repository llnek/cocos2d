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

(function(undef) { "use stricts"; var global = this, _ = global._ ,
asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
SkaroJS= global.SkaroJS;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XLoader = cc.Scene.extend({

  logoSprite: null,
  bgLayer: null,
  winsz: null,
  logo: null,

  _instance: null,

  ctor: function () {
    this.winsz = cc.director.getWinSizeInPixels();
    this._super();
  },

  init: function() {
    this.bgLayer = cc.LayerColor.create(cc.color(0,0,0, 255));
    this.bgLayer.setPosition(0, 0);
    this._super();
    this.pkLoad();
    this.addChild(this.bgLayer, 0);
  },

  pkLoad: function() {
    this.logo= new Image();
    var me=this;
    this.logo.onload = function() { me.pkInitStage(); };
    this.logo.src = '/public/ig/media/main/ZotohLab_x200.png';
  },

  pkInitStage: function () {
    var cw = cc.p(this.winsz.width / 2, this.winsz.height / 2),
    texture2d = new cc.Texture2D(),
    me= this,
    s1,s2;

    texture2d.initWithElement(this.logo);
    texture2d.handleLoadedTexture();

    this.logoSprite = cc.Sprite.create(texture2d);
    this.logoSprite.setScale( cc.contentScaleFactor());
    this.logoSprite.setPosition(cw);
    this.bgLayer.addChild(this.logoSprite);

    s2 = cc.Sprite.create( '/public/ig/media/cocos2d/game/preloader_bar.png');
    this.progress = cc.ProgressTimer.create(s2);
    this.progress.setType(cc.PROGRESS_TIMER_TYPE_BAR);
    this.progress.setScaleX(0.5);
    this.progress.setScaleY(0.3);
    this.progress.setPosition( this.logoSprite.getPosition().x - 0.5 * this.logo.width / 2 , cw.y - this.logo.height / 2 - 10);
    this.bgLayer.addChild(this.progress);
  },

  onEnter: function () {
    this._super();
    this.schedule(this.pkStartLoading, 0.3);
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
    var me=this, res = this.resources;
    this._length = res.length;
    this.unschedule(this.pkStartLoading);
    cc.loader.load(res, function(result,cnt) {
      me._count= cnt;
    }, function() {
      me.niceFadeOut();
    });
    this.schedule(this.pkUpdatePercent);
  },

  pkUpdatePercent: function () {
    var me = this, cnt = this._count,
    len = this._length,
    percent = (cnt / len * 100) | 0;
    percent = Math.min(percent, 100);
    this.progress.setPercentage(percent);
    if (cnt >= len) {
      this.unschedule(this.pkUpdatePercent);
    }
  }


});

asterix.XLoader.preload = function (resources, selector, target) {
  var director = cc.director;

  if (!this._instance) {
    this._instance = new asterix.XLoader();
    this._instance.init();
  }

  this._instance.initWithResources(resources, selector, target);
  director.runScene(this._instance);
  return this._instance;
};


}).call(this);

