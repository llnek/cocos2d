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

(function(undef) { "use stricts"; var global = this ; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XLoader = cc.Scene.extend({

  _logo: null,
  _bar: null,
  _bgLayer: null,
  _label: null,
  _winSize: null,

  ctor: function () {
    cc.Scene.prototype.ctor.call(this);
    this._winSize = cc.Director.getInstance().getWinSize();
  },

  init: function() {
    cc.Scene.prototype.init.call(this);
    this.pkLoad();
    this._bgLayer = cc.LayerColor.create(cc.c4(0,0,0, 255));
    this._bgLayer.setPosition(0, 0);
    this.addChild(this._bgLayer, 0);
  },

  pkLoad: function() {
    var me=this;
    this._logo= new Image();
    this._logo.onload = function() { me.pkInitStage(); };
    this._logo.src = '/public/ig/media/main/logos/ZotohLabs_x200.png';
  },

  pkInitStage: function () {
    var me=this, centerPos = cc.p(this._winSize.width / 2, this._winSize.height / 2);
    var s1,s2, texture2d;

    texture2d = new cc.Texture2D();
    texture2d.initWithElement(this._logo);
    texture2d.handleLoadedTexture();

    this._logoSprite = cc.Sprite.createWithTexture(texture2d);
    this._logoSprite.setScale(cc.CONTENT_SCALE_FACTOR());
    this._logoSprite.setPosition(centerPos);
    this._bgLayer.addChild(this._logoSprite, 10);

    s2= cc.Sprite.create( '/public/ig/media/cocos2d/game/preloader_bar.png');
    this._progress = cc.ProgressTimer.create(s2);
    this._progress.setType(cc.PROGRESS_TIMER_TYPE_BAR);
    this._progress.setScaleX(0.5);
    this._progress.setPosition( this._logoSprite.getPosition().x - 0.5 * this._logo.width / 2 , centerPos.y - this._logo.height / 2 - 10);
    this._bgLayer.addChild(this._progress, 20);

  },

  onEnter: function () {
    cc.Node.prototype.onEnter.call(this);
    this.schedule(this.pkStartLoading, 0.3);
  },

  onExit: function () {
    cc.Node.prototype.onExit.call(this);
  },

  initWithResources: function (resources, selector, target) {
    this.resources = resources;
    this.selector = selector;
    this.target = target;
  },

  niceFadeOut: function() {
    this._logoSprite.runAction( cc.Sequence.create(
                                      cc.FadeOut.create(1.2),
                                      cc.CallFunc.create(this.selector, this.target)));
  },

  pkStartLoading: function () {
    this.unschedule(this.pkStartLoading);
    cc.Loader.preload(this.resources, function() {
      this.niceFadeOut();
    }, this);
    this.schedule(this.pkUpdatePercent);
  },

  pkUpdatePercent: function () {
    var percent = cc.Loader.getInstance().getPercentage();
    this._progress.setPercentage(percent);
    if (percent >= 100) {
      this.unschedule(this.pkUpdatePercent);
    }
  }

});

asterix.XLoader.preload = function (resources, selector, target) {

  var director = cc.Director.getInstance();
  if (!this._instance) {
    this._instance = new asterix.XLoader();
    this._instance.init();
  }

  this._instance.initWithResources(resources, selector, target);

  if (director.getRunningScene()) {
    director.replaceScene(this._instance);
  } else {
    director.runWithScene(this._instance);
  }

  return this._instance;
};


}).call(this);


