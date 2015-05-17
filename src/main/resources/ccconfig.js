document.ccConfig = {

  // 0(default), 1(Canvas only), 2(WebGL only)
  renderMode: 0,
  debugMode: 1,

  showFPS: false,
  frameRate: 30,

  id: 'gameArea',

  engineDir: ['/public/extlibs/cocos2d-html5'],
  modules: ['cocos2d', 'ccui' ],

  jsList: [

    "/public/vendors/mustache/mustache.js",
    "/public/vendors/ramda/ramda.js",
    "/public/vendors/l10njs/l10n.js",
    "/public/vendors/helpers/dbg.js",

    "/public/vendors/js-signals/signals.js",
    "/public/vendors/ash-js/ash.js",

    "/public/vendors/crypto-js/components/core-min.js",
    "/public/vendors/crypto-js/components/enc-utf16-min.js",
    "/public/vendors/crypto-js/components/enc-base64-min.js",

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
    "/public/ig/lib/zotohlab/ext/xpool.js",
    "/public/ig/lib/zotohlab/ext/xldr.js",

    "/public/ig/lib/zotohlab/gui/startscreen.js",
    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",
    "/public/ig/lib/zotohlab/gui/mainmenu.js",

    '/public/ig/lib/game/@@APPID@@/config.js',
    '/public/ig/lib/game/@@APPID@@/i18n/game_en_US.js',

    '/public/ig/lib/game/@@APPID@@/splash.js',
    '/public/ig/lib/game/@@APPID@@/mmenu.js',
    '/public/ig/lib/game/@@APPID@@/hud.js',
    '/public/ig/lib/game/@@APPID@@/game.js',

    '/public/ig/lib/game/@@APPID@@/protos.js',
    '/public/ig/lib/zotohlab/ext/xboot.js'

  ]

};

