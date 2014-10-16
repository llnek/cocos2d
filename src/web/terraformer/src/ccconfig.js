document.ccConfig = {

  loadExtension: false,
  chipmunk: true,
  box2d: false,
  showFPS: false,
  frameRate: 60,

  // 0(default), 1(Canvas only), 2(WebGL only)
  renderMode: 0,
  debugMode: 1,

  id: 'gameArea',

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

    '/public/ig/lib/game/terraformer/config.js',
    '/public/ig/lib/game/terraformer/i18n/game_en_US.js',

'/public/ig/lib/game/terraformer/components/cobjs.js',
'/public/ig/lib/game/terraformer/nodes/gnodes.js',

'/public/ig/lib/game/terraformer/systems/priorities.js',
'/public/ig/lib/game/terraformer/systems/utils.js',

'/public/ig/lib/game/terraformer/systems/factory.js',
'/public/ig/lib/game/terraformer/systems/supervisor.js',
//'/public/ig/lib/game/terraformer/systems/motion.js',
'/public/ig/lib/game/terraformer/systems/move-sky.js',

'/public/ig/lib/game/terraformer/systems/sysobjs.js',


'/public/ig/lib/game/terraformer/splash.js',
'/public/ig/lib/game/terraformer/hud.js',
'/public/ig/lib/game/terraformer/mmenu.js',
'/public/ig/lib/game/terraformer/game.js',

'/public/ig/lib/game/terraformer/protos.js',
'/public/ig/lib/zotohlab/ext/xboot.js'
  ]

};

