document.ccConfig = {

  loadExtension: false,
  chipmunk: true,
  box2d: false,
  showFPS: false,
  frameRate: 60,

  // 0(default), 1(Canvas only), 2(WebGL only)
  renderMode: 0,

  id: 'gameArea',

  //0 to turn debug off, 1 for basic debug, and 2 for full debug
  debugLevel: 2,

  engineDir: ['/public/extlibs/cocos2d-html5'],

  modules: [ 'cocos2d' ],
  jsList: [
    "/public/vendors/underscore/underscore-min.js",
    "/public/vendors/l10njs/l10n.min.js",
    "/public/vendors/mustache/mustache.js",
    "/public/vendors/helpers/dbg.js",
    "/public/vendors/cherimoia/skaro.js",
    "/public/vendors/cherimoia/caesar.js",
    "/public/vendors/cherimoia/zlab.js",
    "/public/ig/lib/zotohlab/ext/asterix.js",
    "/public/ig/lib/zotohlab/ext/bus.js",
    "/public/ig/lib/zotohlab/ext/xcfg.js",
    "/public/ig/lib/zotohlab/ext/cs2dx.js",
    "/public/ig/lib/zotohlab/ext/odin.js",
    "/public/ig/lib/zotohlab/ext/xscene.js",
    "/public/ig/lib/zotohlab/ext/xlayer.js",
    "/public/ig/lib/zotohlab/ext/xentity.js",
    "/public/ig/lib/zotohlab/ext/xlives.js",
    "/public/ig/lib/zotohlab/ext/xhud.js",
    "/public/ig/lib/zotohlab/ext/xigg.js",
    "/public/ig/lib/zotohlab/ext/xloader.js",
    "/public/ig/lib/zotohlab/gui/startscreen.js",
    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",
    "/public/ig/lib/zotohlab/gui/mainmenu.js",



      '/public/ig/lib/game/asteroids/entities/explode.js',
      '/public/ig/lib/game/asteroids/entities/aster.js',
      '/public/ig/lib/game/asteroids/entities/asteroid3.js',
      '/public/ig/lib/game/asteroids/entities/asteroid2.js',
      '/public/ig/lib/game/asteroids/entities/asteroid1.js',
      '/public/ig/lib/game/asteroids/entities/missile.js',
      '/public/ig/lib/game/asteroids/entities/player.js',
      '/public/ig/lib/game/asteroids/entities/laser.js',
      '/public/ig/lib/game/asteroids/entities/ufo.js',
      '/public/ig/lib/game/asteroids/hud.js',
      '/public/ig/lib/game/asteroids/game.js',
      '/public/ig/lib/game/asteroids/mmenu.js',
      '/public/ig/lib/game/asteroids/splash.js'

  ]

};

