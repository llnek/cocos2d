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

  modules: [ 'cocos2d','ccui' ],
  jsList: [

    "/public/vendors/ramda/ramda.js",
    "/public/vendors/l10njs/l10n.js",
    "/public/vendors/mustache/mustache.js",
    "/public/vendors/helpers/dbg.js",

    "/public/vendors/js-signals/signals.js",
    "/public/vendors/ash-js/ash.js",

    "/public/vendors/rxjs/rx.all.js",

    "/public/vendors/cherimoia/skaro.js",
    "/public/vendors/cherimoia/caesar.js",
    "/public/vendors/cherimoia/ebus.js",

    "/public/ig/lib/zotohlab/asx/asterix.js",
    "/public/ig/lib/zotohlab/asx/cfg.js",
    "/public/ig/lib/zotohlab/asx/ccsx.js",
    "/public/ig/lib/zotohlab/asx/odin.js",

    "/public/ig/lib/zotohlab/asx/scenes.js",
    "/public/ig/lib/zotohlab/asx/pool.js",
    "/public/ig/lib/zotohlab/asx/loader.js",

    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",

    '/public/ig/lib/game/tetris/p/config.js',
    '/public/ig/lib/game/tetris/i18n/l10n.js',

    '/public/ig/lib/game/tetris/nodes/cobjs.js',
    '/public/ig/lib/game/tetris/nodes/gnodes.js',

    '/public/ig/lib/game/tetris/s/factory.js',
    '/public/ig/lib/game/tetris/s/utils.js',
    '/public/ig/lib/game/tetris/s/supervisor.js',
    '/public/ig/lib/game/tetris/s/clearance.js',
    '/public/ig/lib/game/tetris/s/generator.js',
    '/public/ig/lib/game/tetris/s/motion.js',
    '/public/ig/lib/game/tetris/s/movement.js',
    '/public/ig/lib/game/tetris/s/rendering.js',
    '/public/ig/lib/game/tetris/s/resolution.js',
    '/public/ig/lib/game/tetris/s/sysobjs.js',

    '/public/ig/lib/game/tetris/p/splash.js',
    '/public/ig/lib/game/tetris/p/mmenu.js',
    '/public/ig/lib/game/tetris/p/hud.js',
    '/public/ig/lib/game/tetris/p/game.js',

    '/public/ig/lib/game/tetris/p/protos.js',
    '/public/ig/lib/zotohlab/p/boot.js'
  ]

};

