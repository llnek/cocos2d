document.ccConfig = {

  loadExtension: false,
  chipmunk: true,
  box2d: false,
  showFPS: false,
  frameRate: 30,

  id: 'gameArea',

  renderMode: 0,
  debugMode: 1,

  engineDir: ['/public/extlibs/cocos2d-html5'],
  modules: [ 'cocos2d', 'ccui' ],

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
    "/public/ig/lib/zotohlab/ext/cfg.js",
    "/public/ig/lib/zotohlab/ext/cs2dx.js",
    "/public/ig/lib/zotohlab/ext/odin.js",

    "/public/ig/lib/zotohlab/ext/scenes.js",
    "/public/ig/lib/zotohlab/ext/pool.js",
    "/public/ig/lib/zotohlab/ext/loader.js",

    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",

  '/public/ig/lib/game/breakout/config.js',
  '/public/ig/lib/game/breakout/i18n/game_en_US.js',

'/public/ig/lib/game/breakout/elements/cobjs.js',
'/public/ig/lib/game/breakout/nodes/gnodes.js',

'/public/ig/lib/game/breakout/systems/factory.js',
'/public/ig/lib/game/breakout/systems/motion.js',
'/public/ig/lib/game/breakout/systems/move-paddle.js',
'/public/ig/lib/game/breakout/systems/move-ball.js',
'/public/ig/lib/game/breakout/systems/collision.js',
'/public/ig/lib/game/breakout/systems/supervisor.js',
'/public/ig/lib/game/breakout/systems/sysobjs.js',

  '/public/ig/lib/game/breakout/hud.js',
  '/public/ig/lib/game/breakout/game.js',
  '/public/ig/lib/game/breakout/mmenu.js',
  '/public/ig/lib/game/breakout/splash.js',

'/public/ig/lib/game/breakout/protos.js',
'/public/ig/lib/zotohlab/ext/boot.js'

  ]

};

