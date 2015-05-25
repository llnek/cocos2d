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
    "/public/ig/lib/zotohlab/ext/xldr.js",

    "/public/ig/lib/zotohlab/gui/start.js",
    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",
    "/public/ig/lib/zotohlab/gui/mainmenu.js",

    '/public/ig/lib/game/tetris/config.js',
    '/public/ig/lib/game/tetris/i18n/game_en_US.js',

    '/public/ig/lib/game/tetris/elements/cobjs.js',
    '/public/ig/lib/game/tetris/nodes/gnodes.js',

    '/public/ig/lib/game/tetris/systems/factory.js',
    '/public/ig/lib/game/tetris/systems/utils.js',
    '/public/ig/lib/game/tetris/systems/supervisor.js',
    '/public/ig/lib/game/tetris/systems/clearance.js',
    '/public/ig/lib/game/tetris/systems/generator.js',
    '/public/ig/lib/game/tetris/systems/motion.js',
    '/public/ig/lib/game/tetris/systems/movement.js',
    '/public/ig/lib/game/tetris/systems/rendering.js',
    '/public/ig/lib/game/tetris/systems/resolution.js',
    '/public/ig/lib/game/tetris/systems/sysobjs.js',

    '/public/ig/lib/game/tetris/splash.js',
    '/public/ig/lib/game/tetris/mmenu.js',
    '/public/ig/lib/game/tetris/hud.js',
    '/public/ig/lib/game/tetris/game.js',

    '/public/ig/lib/game/tetris/protos.js',
    '/public/ig/lib/zotohlab/ext/xboot.js'

  ]

};

