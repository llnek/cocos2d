//used by web debug mode only.
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

    "/public/vendors/rxjs/rx.all.js",

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

    '/public/ig/lib/zotohlab/ext/negamax.js',

    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",

    '/public/ig/lib/game/tictactoe/config.js',
    '/public/ig/lib/game/tictactoe/i18n/game_en_US.js',

    '/public/ig/lib/game/tictactoe/elements/board.js',
    '/public/ig/lib/game/tictactoe/elements/cobjs.js',

    '/public/ig/lib/game/tictactoe/nodes/gnodes.js',

    '/public/ig/lib/game/tictactoe/systems/factory.js',
    '/public/ig/lib/game/tictactoe/systems/utils.js',
    '/public/ig/lib/game/tictactoe/systems/network.js',
    '/public/ig/lib/game/tictactoe/systems/rendering.js',
    '/public/ig/lib/game/tictactoe/systems/resolution.js',
    '/public/ig/lib/game/tictactoe/systems/supervisor.js',
    '/public/ig/lib/game/tictactoe/systems/turnbase.js',
    '/public/ig/lib/game/tictactoe/systems/uiselect.js',
    '/public/ig/lib/game/tictactoe/systems/sysobjs.js',

    '/public/ig/lib/game/tictactoe/splash.js',
    '/public/ig/lib/game/tictactoe/mmenu.js',
    '/public/ig/lib/game/tictactoe/hud.js',
    '/public/ig/lib/game/tictactoe/game.js',

    '/public/ig/lib/game/tictactoe/protos.js',
    '/public/ig/lib/zotohlab/ext/boot.js'
  ]

};

