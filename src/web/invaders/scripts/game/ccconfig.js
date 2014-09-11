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
      '/public/ig/lib/game/invaders/entities/explode.js',
      '/public/ig/lib/game/invaders/entities/missile.js',
      '/public/ig/lib/game/invaders/entities/bomb.js',
      '/public/ig/lib/game/invaders/entities/player.js',
      '/public/ig/lib/game/invaders/entities/alien.js',
      '/public/ig/lib/game/invaders/hud.js',
      '/public/ig/lib/game/invaders/game.js',
      '/public/ig/lib/game/invaders/mmenu.js',
      '/public/ig/lib/game/invaders/splash.js'

  ]

};

