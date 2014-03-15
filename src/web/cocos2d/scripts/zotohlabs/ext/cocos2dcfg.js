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

(function(undef) { "use strict"; var global= this; var _ = global._;
var doc= global.document;
var cfg= {

    loadExtension: false,

    chipmunk: false,
    box2d: false,
    showFPS: false,
    frameRate: 60,
    // 0(default), 1(Canvas only), 2(WebGL only)
    renderMode: 0,
    tag: 'gameCanvas',

    appFiles: [
      'plugins/deps.js',
      'zotohlabs/ext/basefuncs.js',
      'zotohlabs/ext/asterix.js',
      'zotohlabs/ext/cs2dx.js',
      'zotohlabs/ext/xcfgbase.js',
      'zotohlabs/ext/xcfg.js',
      'game/tictactoe/config.js',
      'game/tictactoe/i18n/game_en_US.js',
      'zotohlabs/ext/xloader.js',
      'zotohlabs/gui/startscreen.js',
      'zotohlabs/gui/ynbox.js',
      'zotohlabs/gui/mainmenu.js',
      'zotohlabs/ext/negamax.js',
      'game/tictactoe/board.js',
      'game/tictactoe/game.js',
      'zotohlabs/ext/application.js',
    ],


    //0 to turn debug off, 1 for basic debug, and 2 for full debug
    debugLevel: 2,
    debug: true,

    srcDir: '/public/ig/lib/',
    engineDir: '/public/vendors/cocos2d_html5/cocos2d/'
};

global.document['ccConfig'] = cfg;

if ( ! doc.createElement('canvas').getContext) {
  var s = doc.createElement('div');
  s.innerHTML = '<h2>Your browser does not support HTML5 canvas!</h2>' +
        '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
        '<a href="http://www.google.com/chrome" target="_blank"><img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
  doc.getElementById(cfg.tag).parentNode.insertBefore(s);
}
global.addEventListener('DOMContentLoaded', function () {

  var s = doc.createElement('script');
  if (_.isString(cfg.engineDir) && cfg.engineDir.length > 0) {
    s.src = cfg.engineDir + 'jsloader.js';
  }

  doc.body.appendChild(s);
  s.id = 'cocos2d-html5';

});



}).call(this);
