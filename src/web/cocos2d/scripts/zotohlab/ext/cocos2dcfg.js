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

(function(undef) { "use strict"; var global= this,  _ = global._ ,
SkaroJS= global.SkaroJS,
doc= global.document,
cfg= {

  loadExtension: false,
  chipmunk: true,
  box2d: false,
  showFPS: false,
  frameRate: 60,

  // 0(default), 1(Canvas only), 2(WebGL only)
  renderMode: 1,

  id: 'gameCanvas',

  appFiles: [
    'plugins/deps.js',
    'zotohlab/ext/cs2dx.js'
    /*
    'zotohlab/ext/basefuncs.js',
    'zotohlab/ext/asterix.js',
    'zotohlab/ext/bus.js',
    'zotohlab/ext/ui.js',
    'zotohlab/ext/xcfgbase.js',
    'zotohlab/ext/xcfg.js'
    */
  ],

  initAppFiles: function(appid,files) {
    files = files || [];
    if (files.length === 0) {
      // for release mode.
      this.appFiles=[];
      this.jsList= [];
      this.engineDir='';
    } else {
      /*
      this.appFiles.push('game/' + appid + '/config.js');
      this.appFiles.push('game/' + appid + '/i18n/game_en_US.js');
      */
      this.appFiles.push('zotohlab/ext/xscene.js');
      this.appFiles.push('zotohlab/ext/xlayer.js');
      this.appFiles.push('zotohlab/ext/xentity.js');
      this.appFiles.push('zotohlab/ext/xlives.js');
      this.appFiles.push('zotohlab/ext/xhud.js');
      this.appFiles.push('zotohlab/ext/xigg.js');
      this.appFiles.push('zotohlab/ext/xloader.js');
      this.appFiles.push('zotohlab/gui/startscreen.js');
      this.appFiles.push('zotohlab/gui/ynbox.js');
      this.appFiles.push('zotohlab/gui/mainmenu.js');
      _.each(files,function(f) { this.appFiles.push(f); }, this);
      this.appFiles.push('zotohlab/ext/application.js');
    }

    _.each(this.appFiles, function(f, idx) {
      this.jsList.push( this.srcDir + f);
    }, this);
  },

  //0 to turn debug off, 1 for basic debug, and 2 for full debug
  debugLevel: 2,
  debug: true,

  modules: [ 'cocos2d' ],
  jsList: [],

  srcDir: '/public/ig/lib/',
  engineDir: '/public/extlibs/cocos2d-html5'

};

if ( ! doc.createElement('canvas').getContext) {
  var s = doc.createElement('div');
  s.innerHTML = '<h2>Your browser does not support HTML5 canvas!</h2>' +
        '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
        '<a href="http://www.google.com/chrome" target="_blank"><img src="http://www.google.com/intl/en-US/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
  doc.getElementById(cfg.tag).parentNode.insertBefore(s);
}
else {

  global.document['ccConfig'] = cfg;

}


}).call(this);

