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

  '/public/ig/lib/game/breakout/config.js',
  '/public/ig/lib/game/breakout/i18n/game_en_US.js',

'/public/ig/lib/game/breakout/components/paddle.js',
'/public/ig/lib/game/breakout/components/ball.js',
'/public/ig/lib/game/breakout/components/brick.js',
'/public/ig/lib/game/breakout/components/motion.js',
'/public/ig/lib/game/breakout/components/velocity.js',

'/public/ig/lib/game/breakout/nodes/motion-paddle.js',
'/public/ig/lib/game/breakout/nodes/bricks.js',

'/public/ig/lib/game/breakout/factory.js',
'/public/ig/lib/game/breakout/systems/priorities.js',

'/public/ig/lib/game/breakout/systems/motion-control.js',
'/public/ig/lib/game/breakout/systems/move-paddle.js',
'/public/ig/lib/game/breakout/systems/move-ball.js',
'/public/ig/lib/game/breakout/systems/collision.js',
'/public/ig/lib/game/breakout/systems/supervisor.js',

  '/public/ig/lib/game/breakout/hud.js',
  '/public/ig/lib/game/breakout/game.js',
  '/public/ig/lib/game/breakout/mmenu.js',
  '/public/ig/lib/game/breakout/splash.js'

  ]

};

