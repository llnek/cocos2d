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

    "/public/vendors/rxjs/rx.all.js",

    "/public/vendors/crypto-js/components/core-min.js",
    "/public/vendors/crypto-js/components/enc-utf16-min.js",
    "/public/vendors/crypto-js/components/enc-base64-min.js",

    "/public/vendors/cherimoia/skaro.js",
    "/public/vendors/cherimoia/caesar.js",
    "/public/vendors/cherimoia/ebus.js",

    "/public/ig/lib/zotohlab/asx/asterix.js",
    "/public/ig/lib/zotohlab/asx/cfg.js",
    "/public/ig/lib/zotohlab/asx/ccsx.js",
    "/public/ig/lib/zotohlab/asx/odin.js",

    "/public/ig/lib/zotohlab/asx/scenes.js",
    "/public/ig/lib/zotohlab/asx/pool.js",
    "/public/ig/lib/zotohlab/asx/loader.js",

    "/public/ig/lib/zotohlab/gui/msgbox.js",
    "/public/ig/lib/zotohlab/gui/ynbox.js",
    "/public/ig/lib/zotohlab/gui/online.js",

    '/public/ig/lib/game/@@APPID@@/p/config.js',
    '/public/ig/lib/game/@@APPID@@/i18n/l10n.js',

    '/public/ig/lib/game/@@APPID@@/p/splash.js',
    '/public/ig/lib/game/@@APPID@@/p/mmenu.js',
    '/public/ig/lib/game/@@APPID@@/p/hud.js',
    '/public/ig/lib/game/@@APPID@@/p/game.js',

    '/public/ig/lib/game/@@APPID@@/p/protos.js',
    '/public/ig/lib/zotohlab/p/boot.js'
  ]

};

