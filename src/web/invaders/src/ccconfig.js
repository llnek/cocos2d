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

  modules: [ 'cocos2d', 'editbox', 'ccpool' ],
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

      '/public/ig/lib/game/invaders/config.js',
      '/public/ig/lib/game/invaders/i18n/game_en_US.js',

'/public/ig/lib/game/invaders/components/looper.js',
'/public/ig/lib/game/invaders/components/alien.js',
'/public/ig/lib/game/invaders/components/velocity.js',
'/public/ig/lib/game/invaders/components/motion.js',
'/public/ig/lib/game/invaders/components/bomb.js',
'/public/ig/lib/game/invaders/components/ship.js',
'/public/ig/lib/game/invaders/components/missile.js',
'/public/ig/lib/game/invaders/components/explosion.js',
'/public/ig/lib/game/invaders/components/cannon.js',


'/public/ig/lib/game/invaders/nodes/cannonctrl.js',
'/public/ig/lib/game/invaders/nodes/alienmotion.js',
'/public/ig/lib/game/invaders/nodes/shipmotion.js',

'/public/ig/lib/game/invaders/factory.js',

'/public/ig/lib/game/invaders/systems/systempriorities.js',
'/public/ig/lib/game/invaders/systems/util.js',
'/public/ig/lib/game/invaders/systems/motionctrlsystem.js',
'/public/ig/lib/game/invaders/systems/cannon-control.js',
'/public/ig/lib/game/invaders/systems/movement_aliens.js',
'/public/ig/lib/game/invaders/systems/movement_bombs.js',
'/public/ig/lib/game/invaders/systems/move-missiles.js',
'/public/ig/lib/game/invaders/systems/movement_ship.js',
'/public/ig/lib/game/invaders/systems/collision.js',
'/public/ig/lib/game/invaders/systems/supervisor.js',


      '/public/ig/lib/game/invaders/hud.js',
      '/public/ig/lib/game/invaders/game.js',
      '/public/ig/lib/game/invaders/mmenu.js',
      '/public/ig/lib/game/invaders/splash.js'

  ]

};

