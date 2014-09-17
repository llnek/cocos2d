document.ccConfig = {

  loadExtension: false,
  chipmunk: true,
  box2d: false,
  showFPS: false,
  frameRate: 60,

  id: 'gameArea',

  renderMode: 0,
  debugMode: 1,

  engineDir: ['/public/extlibs/cocos2d-html5'],

  modules: [ 'cocos2d', 'editbox' ],
  jsList: [

    "/public/vendors/underscore/underscore-min.js",
    "/public/vendors/l10njs/l10n.min.js",
    "/public/vendors/mustache/mustache.js",
    "/public/vendors/helpers/dbg.js",
    "/public/vendors/cherimoia/skaro.js",
    "/public/vendors/cherimoia/caesar.js",
    "/public/vendors/cherimoia/zlab.js",
    "/public/vendors/cherimoia/bus.js",
    "/public/ig/lib/zotohlab/ext/asterix.js",
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

      '/public/ig/lib/game/invaders/config.js',
      '/public/ig/lib/game/invaders/i18n/game_en_US.js',
      '/public/ig/lib/game/invaders/entities/explode.js',
      '/public/ig/lib/game/invaders/entities/missile.js',
      '/public/ig/lib/game/invaders/entities/bomb.js',
      '/public/ig/lib/game/invaders/entities/player.js',
      '/public/ig/lib/game/invaders/entities/alien.js',
      '/public/ig/lib/game/invaders/hud.js',
      '/public/ig/lib/game/invaders/game.js',
      '/public/ig/lib/game/invaders/mmenu.js',
      '/public/ig/lib/game/invaders/splash.js'

  ]

};
