document.ccConfig = {

  loadExtension: false,
  chipmunk: true,
  box2d: false,
  showFPS: false,
  frameRate: 60,

  renderMode: 0,
  debugMode: 1,

  id: 'gameArea',

  engineDir: ['/public/extlibs/cocos2d-html5'],
  modules: [ 'cocos2d', 'editbox' ],

  jsList: [
    "/public/vendors/underscore/underscore-min.js",
    "/public/vendors/l10njs/l10n.min.js",
    "/public/vendors/mustache/mustache.js",
    "/public/vendors/helpers/dbg.js",
"/public/vendors/ash-js/ash.min.js",
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

    '/public/ig/lib/game/asteroids/config.js',
    '/public/ig/lib/game/asteroids/i18n/game_en_US.js',

'/public/ig/lib/game/asteroids/components/velocity.js',
'/public/ig/lib/game/asteroids/components/motion.js',
'/public/ig/lib/game/asteroids/components/asteroid.js',
'/public/ig/lib/game/asteroids/components/cannon.js',
'/public/ig/lib/game/asteroids/components/looper.js',
'/public/ig/lib/game/asteroids/components/ship.js',
'/public/ig/lib/game/asteroids/components/missile.js',




'/public/ig/lib/game/asteroids/nodes/motion-cannon.js',
'/public/ig/lib/game/asteroids/nodes/motion-astro.js',
'/public/ig/lib/game/asteroids/nodes/motion-ship.js',

    '/public/ig/lib/game/asteroids/factory.js',
'/public/ig/lib/game/asteroids/systems/util.js',

'/public/ig/lib/game/asteroids/systems/priorities.js',
'/public/ig/lib/game/asteroids/systems/motion-control.js',
'/public/ig/lib/game/asteroids/systems/missile-control.js',
'/public/ig/lib/game/asteroids/systems/move-asteroids.js',
'/public/ig/lib/game/asteroids/systems/move-ship.js',

'/public/ig/lib/game/asteroids/systems/supervisor.js',




      '/public/ig/lib/game/asteroids/hud.js',
      '/public/ig/lib/game/asteroids/game.js',
      '/public/ig/lib/game/asteroids/mmenu.js',
      '/public/ig/lib/game/asteroids/splash.js'

  ]

};

