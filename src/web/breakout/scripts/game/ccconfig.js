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

  modules: [ 'cocos2d' ],
  jsList: [
    '/public/c/ztlcommon.js',

  '/public/ig/lib/game/breakout/entities/explode.js',
  '/public/ig/lib/game/breakout/entities/player.js',
  '/public/ig/lib/game/breakout/entities/ball.js',
  '/public/ig/lib/game/breakout/entities/brick.js',
  '/public/ig/lib/game/breakout/hud.js',
  '/public/ig/lib/game/breakout/game.js',
  '/public/ig/lib/game/breakout/mmenu.js',
  '/public/ig/lib/game/breakout/splash.js'

  ]

};

