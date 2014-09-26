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

      '/public/ig/lib/game/pong/config.js',
      '/public/ig/lib/game/pong/i18n/game_en_US.js',

      '/public/ig/lib/game/pong/components/player.js',
      '/public/ig/lib/game/pong/components/paddle.js',
      '/public/ig/lib/game/pong/components/motion.js',
      '/public/ig/lib/game/pong/components/ball.js',
'/public/ig/lib/game/pong/components/position.js',
'/public/ig/lib/game/pong/components/velocity.js',

      '/public/ig/lib/game/pong/nodes/paddle.js',
'/public/ig/lib/game/pong/nodes/ball.js',
      '/public/ig/lib/game/pong/factory.js',

      '/public/ig/lib/game/pong/systems/util.js',
      '/public/ig/lib/game/pong/systems/systempriorities.js',
      '/public/ig/lib/game/pong/systems/motionctrlsystem.js',
      '/public/ig/lib/game/pong/systems/supervisor.js',
      '/public/ig/lib/game/pong/systems/movementsystem.js',
      '/public/ig/lib/game/pong/systems/collision.js',
      '/public/ig/lib/game/pong/systems/resolution.js',
      '/public/ig/lib/game/pong/systems/rendersystem.js',

      '/public/ig/lib/game/pong/hud.js',
      '/public/ig/lib/game/pong/arena.js',
      '/public/ig/lib/game/pong/game.js',
      '/public/ig/lib/game/pong/mmenu.js',
      '/public/ig/lib/game/pong/splash.js'
  ]

};

