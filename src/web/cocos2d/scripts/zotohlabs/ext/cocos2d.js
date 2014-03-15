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

(function(undef) { "use strict"; var global= this; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var doc= global.document;
var sh= asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// main application.
//////////////////////////////////////////////////////////////////////////////

var Cocos2dApp = cc.Application.extend({

  ctor: function (scene) {
    cc.COCOS2D_DEBUG = sh.xcfg.game.debugLevel;
    this.startScene= scene;
    this._super();
    cc.initDebugSetting();
    cc.setup(sh.xcfg.game.tag);
    cc.AppController.shareAppController().didFinishLaunchingWithOptions();
  },

  applicationDidFinishLaunching: function () {
    if (cc.RenderDoesnotSupport()) {
      alert("Browser doesn't support WebGL");
      return false;
    }

    var splash= sh.xcfg.protos[ this.startScene ];
    var director = cc.Director.getInstance();
    var eglv= cc.EGLView.getInstance();
    var sz = sh.xcfg.game.size;

    eglv.adjustViewPort(true);
    eglv.setDesignResolutionSize(sz.width, sz.height, cc.RESOLUTION_POLICY.SHOW_ALL);
    eglv.resizeWithBrowserSize(true);

    director.setAnimationInterval(1 / sh.xcfg.game.frameRate);
    if (sh.xcfg.game.debug) {
      director.setDisplayStats(sh.xcfg.game.showFPS);
    }

    cc.LoaderScene.preload(g_mainmenu, function () {
      director.replaceScene(new (splash)() );
    }, this);

    return true;
  }

});

if ( ! doc.createElement('canvas').getContext) {
  var s = doc.createElement('div');
  s.innerHTML = '<h2>Your browser does not support HTML5 canvas!</h2>' +
        '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
        '<a href="http://www.google.com/chrome" target="_blank"><img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
  doc.getElementById(c.tag).parentNode.insertBefore(s);
}
global.addEventListener('DOMContentLoaded', function () {

  var s = doc.createElement('script');
  if (_.isString(sh.xcfg.cocos2dDir) && sh.xcfg.cocos2dDir.length > 0) {
    s.src = sh.xcfg.cocos2dDir + 'jsloader.js';
  }

  doc.body.appendChild(s);
  s.id = 'cocos2d-html5';

});


loggr.info("About to create Cocos2D HTML5 Game");
var app= new Cocos2dApp('Splash');

loggr.info("register game start state - " + app.startScene);
loggr.info(sh.xcfg);
loggr.info("loaded and running. OK");

}).call(this);


