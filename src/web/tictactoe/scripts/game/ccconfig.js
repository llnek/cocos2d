document.ccConfig = {

  loadExtension: false,
  chipmunk: true,
  box2d: false,
  showFPS: false,
  frameRate: 60,

  // 0(default), 1(Canvas only), 2(WebGL only)
  renderMode: 0,

  id: 'gameArea',

  //0 to turn debug off, 1 for basic debug, and 2 for full debug
  debugLevel: 2,

  engineDir: ['/public/extlibs/cocos2d-html5'],

  modules: [ 'cocos2d', 'editbox' ],
  jsList: [
    '/public/c/ztlcommon.js',
    '/public/ig/lib/zotohlab/ext/negamax.js',
    '/public/ig/lib/game/tictactoe/config.js',
    '/public/ig/lib/game/tictactoe/i18n/game_en_US.js',
    '/public/ig/lib/game/tictactoe/board.js',
    '/public/ig/lib/game/tictactoe/hud.js',
    '/public/ig/lib/game/tictactoe/game.js',
    '/public/ig/lib/game/tictactoe/mmenu.js',
    '/public/ig/lib/game/tictactoe/splash.js'
  ]

};

