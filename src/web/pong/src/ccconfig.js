document.ccConfig = {

  loadExtension: false,
  chipmunk: true,
  box2d: false,
  showFPS: false,
  frameRate: 30,

  renderMode: 0,
  debugMode: 1,

  id: 'gameArea',

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

      '/public/ig/lib/game/pong/p/config.js',
      '/public/ig/lib/game/pong/i18n/l10n.js',

      '/public/ig/lib/game/pong/n/cobjs.js',
      '/public/ig/lib/game/pong/n/gnodes.js',

      '/public/ig/lib/game/pong/s/factory.js',
      '/public/ig/lib/game/pong/s/motion.js',
      '/public/ig/lib/game/pong/s/stager.js',
      '/public/ig/lib/game/pong/s/move.js',
      '/public/ig/lib/game/pong/s/net.js',
      '/public/ig/lib/game/pong/s/collide.js',
      '/public/ig/lib/game/pong/s/resolve.js',
      '/public/ig/lib/game/pong/s/render.js',

      '/public/ig/lib/game/pong/s/sysobjs.js',

      '/public/ig/lib/game/pong/p/hud.js',
      '/public/ig/lib/game/pong/p/game.js',
      '/public/ig/lib/game/pong/p/mmenu.js',
      '/public/ig/lib/game/pong/p/splash.js',
      '/public/ig/lib/game/pong/p/protos.js',


      '/public/ig/lib/zotohlab/p/boot.js'
  ]

};

