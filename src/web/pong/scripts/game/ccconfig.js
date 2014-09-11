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
      '/public/ig/lib/game/pong/entities/entity.js',
      '/public/ig/lib/game/pong/entities/ball.js',
      '/public/ig/lib/game/pong/entities/human.js',
      '/public/ig/lib/game/pong/entities/robot.js',
      '/public/ig/lib/game/pong/hud.js',
      '/public/ig/lib/game/pong/arena.js',
      '/public/ig/lib/game/pong/game.js',
      '/public/ig/lib/game/pong/mmenu.js',
      '/public/ig/lib/game/pong/splash.js'
  ]

};

