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
  modules: [ 'cocos2d', 'editbox', 'ccpool' ],

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
    "/public/ig/lib/zotohlab/ext/xentity.js",
    "/public/ig/lib/zotohlab/ext/xloader.js",

    "/public/ig/lib/zotohlab/gui/startscreen.js",
    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",
    "/public/ig/lib/zotohlab/gui/mainmenu.js",

    '/public/ig/lib/zotohlab/ext/negamax.js',


    '/public/ig/lib/game/tictactoe/config.js',
    '/public/ig/lib/game/tictactoe/i18n/game_en_US.js',

    '/public/ig/lib/game/tictactoe/components/board.js',
    '/public/ig/lib/game/tictactoe/components/cobjs.js',

    '/public/ig/lib/game/tictactoe/nodes/gnodes.js',

    '/public/ig/lib/game/tictactoe/systems/priorities.js',
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
    '/public/ig/lib/zotohlab/ext/xboot.js'
  ]

};

