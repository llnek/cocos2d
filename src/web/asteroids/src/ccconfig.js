document.ccConfig = {

  loadExtension: false,
  chipmunk: true,
  box2d: false,
  showFPS: false,
  frameRate: 30,

  renderMode: 0,
  debugMode: 1,

  id: 'gameArea',

  engineDir: ['/public/extlibs/cocos2d-html5'],
  modules: [ 'cocos2d', 'editbox' ],

  jsList: [

    "/public/vendors/ramda/ramda.js",
    "/public/vendors/l10njs/l10n.js",
    "/public/vendors/mustache/mustache.js",
    "/public/vendors/helpers/dbg.js",

    "/public/vendors/js-signals/signals.js",
    "/public/vendors/ash-js/ash.js",

    "/public/vendors/cherimoia/skaro.js",
    "/public/vendors/cherimoia/caesar.js",
    "/public/vendors/cherimoia/bus.js",
    "/public/vendors/cherimoia/zlab.js",

    "/public/ig/lib/zotohlab/ext/asterix.js",
    "/public/ig/lib/zotohlab/ext/xcfg.js",
    "/public/ig/lib/zotohlab/ext/cs2dx.js",
    "/public/ig/lib/zotohlab/ext/odin.js",

    "/public/ig/lib/zotohlab/ext/xlayers.js",
    "/public/ig/lib/zotohlab/ext/xscenes.js",
    "/public/ig/lib/zotohlab/ext/xpool.js",
    "/public/ig/lib/zotohlab/ext/xloader.js",

    "/public/ig/lib/zotohlab/gui/startscreen.js",
    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",
    "/public/ig/lib/zotohlab/gui/mainmenu.js",

    '/public/ig/lib/game/asteroids/config.js',
    '/public/ig/lib/game/asteroids/i18n/game_en_US.js',

'/public/ig/lib/game/asteroids/components/cobjs.js',
'/public/ig/lib/game/asteroids/nodes/gnodes.js',

'/public/ig/lib/game/asteroids/systems/priorities.js',
'/public/ig/lib/game/asteroids/systems/utils.js',
    '/public/ig/lib/game/asteroids/systems/factory.js',

'/public/ig/lib/game/asteroids/systems/motion.js',
'/public/ig/lib/game/asteroids/systems/missiles.js',
'/public/ig/lib/game/asteroids/systems/move-asteroids.js',
'/public/ig/lib/game/asteroids/systems/move-missiles.js',
'/public/ig/lib/game/asteroids/systems/move-lasers.js',
'/public/ig/lib/game/asteroids/systems/move-ship.js',
'/public/ig/lib/game/asteroids/systems/collision.js',
'/public/ig/lib/game/asteroids/systems/supervisor.js',
'/public/ig/lib/game/asteroids/systems/resolution.js',
'/public/ig/lib/game/asteroids/systems/sysobjs.js',

      '/public/ig/lib/game/asteroids/hud.js',
      '/public/ig/lib/game/asteroids/game.js',
      '/public/ig/lib/game/asteroids/mmenu.js',
      '/public/ig/lib/game/asteroids/splash.js',
'/public/ig/lib/game/asteroids/protos.js',
'/public/ig/lib/zotohlab/ext/xboot.js'

  ]

};

