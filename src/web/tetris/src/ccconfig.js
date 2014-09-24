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

  modules: [ 'cocos2d' ],
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
      '/public/ig/lib/game/tetris/config.js',
      '/public/ig/lib/game/tetris/i18n/game_en_US.js',

      '/public/ig/lib/game/tetris/components/brick.js',
      '/public/ig/lib/game/tetris/components/box.js',
      '/public/ig/lib/game/tetris/components/line.js',
      '/public/ig/lib/game/tetris/components/nub.js',
      '/public/ig/lib/game/tetris/components/elx.js',
      '/public/ig/lib/game/tetris/components/el.js',
      '/public/ig/lib/game/tetris/components/stx.js',
      '/public/ig/lib/game/tetris/components/st.js',
      '/public/ig/lib/game/tetris/components/shape.js',
      '/public/ig/lib/game/tetris/components/motion.js',

'/public/ig/lib/game/tetris/components/dropper.js',
'/public/ig/lib/game/tetris/components/pauser.js',
'/public/ig/lib/game/tetris/components/flines.js',

'/public/ig/lib/game/tetris/components/tilegrid.js',
'/public/ig/lib/game/tetris/components/blocks.js',
'/public/ig/lib/game/tetris/nodes/arena.js',
'/public/ig/lib/game/tetris/systems/systempriorities.js',
'/public/ig/lib/game/tetris/systems/util.js',
'/public/ig/lib/game/tetris/systems/supervisor.js',
'/public/ig/lib/game/tetris/systems/clearance.js',
'/public/ig/lib/game/tetris/systems/generator.js',
'/public/ig/lib/game/tetris/systems/motionctrlsystem.js',
'/public/ig/lib/game/tetris/systems/movementsystem.js',
'/public/ig/lib/game/tetris/systems/rendersystem.js',
'/public/ig/lib/game/tetris/systems/resolution.js',

      '/public/ig/lib/game/tetris/factory.js',
      '/public/ig/lib/game/tetris/hud.js',
      '/public/ig/lib/game/tetris/game.js',
      '/public/ig/lib/game/tetris/mmenu.js',
      '/public/ig/lib/game/tetris/splash.js'
  ]

};

