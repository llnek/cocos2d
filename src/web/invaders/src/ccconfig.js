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
    "/public/ig/lib/zotohlab/ext/xcfg.js",
    "/public/ig/lib/zotohlab/ext/cs2dx.js",
    "/public/ig/lib/zotohlab/ext/odin.js",

    "/public/ig/lib/zotohlab/ext/xscenes.js",
    "/public/ig/lib/zotohlab/ext/xpool.js",
    "/public/ig/lib/zotohlab/ext/xloader.js",

    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",

    '/public/ig/lib/game/invaders/config.js',
    '/public/ig/lib/game/invaders/i18n/game_en_US.js',

    '/public/ig/lib/game/invaders/elements/cobjs.js',
    '/public/ig/lib/game/invaders/nodes/gnodes.js',

    '/public/ig/lib/game/invaders/systems/factory.js',
    '/public/ig/lib/game/invaders/systems/utils.js',
    '/public/ig/lib/game/invaders/systems/motion.js',
    '/public/ig/lib/game/invaders/systems/cannon.js',
    '/public/ig/lib/game/invaders/systems/move-aliens.js',
    '/public/ig/lib/game/invaders/systems/move-bombs.js',
    '/public/ig/lib/game/invaders/systems/move-missiles.js',
    '/public/ig/lib/game/invaders/systems/move-ship.js',
    '/public/ig/lib/game/invaders/systems/collision.js',
    '/public/ig/lib/game/invaders/systems/supervisor.js',
    '/public/ig/lib/game/invaders/systems/resolution.js',
    '/public/ig/lib/game/invaders/systems/sysobjs.js',

      '/public/ig/lib/game/invaders/hud.js',
      '/public/ig/lib/game/invaders/game.js',
      '/public/ig/lib/game/invaders/mmenu.js',
      '/public/ig/lib/game/invaders/splash.js',

      '/public/ig/lib/game/invaders/protos.js',
      '/public/ig/lib/zotohlab/ext/xboot.js'
  ]

};

