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

    '/public/ig/lib/zotohlab/ext/negamax.js',
    '/public/ig/lib/game/tictactoe/config.js',
    '/public/ig/lib/game/tictactoe/i18n/game_en_US.js',

    '/public/ig/lib/game/tictactoe/components/algo.js',
    '/public/ig/lib/game/tictactoe/components/board.js',
    '/public/ig/lib/game/tictactoe/components/grid.js',
    '/public/ig/lib/game/tictactoe/components/gridview.js',
    '/public/ig/lib/game/tictactoe/components/netcmd.js',
    '/public/ig/lib/game/tictactoe/components/player.js',
    '/public/ig/lib/game/tictactoe/components/selection.js',
    '/public/ig/lib/game/tictactoe/factory.js',
    '/public/ig/lib/game/tictactoe/nodes/board.js',
    '/public/ig/lib/game/tictactoe/nodes/gui.js',
    '/public/ig/lib/game/tictactoe/nodes/netplay.js',
    '/public/ig/lib/game/tictactoe/systems/util.js',
    '/public/ig/lib/game/tictactoe/systems/networksystem.js',
    '/public/ig/lib/game/tictactoe/systems/rendersystem.js',
    '/public/ig/lib/game/tictactoe/systems/resolution.js',
    '/public/ig/lib/game/tictactoe/systems/supervisor.js',
    '/public/ig/lib/game/tictactoe/systems/systempriorities.js',
    '/public/ig/lib/game/tictactoe/systems/turnbasesystem.js',
    '/public/ig/lib/game/tictactoe/systems/uiselectsystem.js',

    '/public/ig/lib/game/tictactoe/board.js',
    '/public/ig/lib/game/tictactoe/hud.js',
    '/public/ig/lib/game/tictactoe/game.js',
    '/public/ig/lib/game/tictactoe/mmenu.js',
    '/public/ig/lib/game/tictactoe/splash.js'
  ]

};

