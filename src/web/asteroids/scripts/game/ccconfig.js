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

      '/public/ig/lib/game/asteroids/entities/explode.js',
      '/public/ig/lib/game/asteroids/entities/aster.js',
      '/public/ig/lib/game/asteroids/entities/asteroid3.js',
      '/public/ig/lib/game/asteroids/entities/asteroid2.js',
      '/public/ig/lib/game/asteroids/entities/asteroid1.js',
      '/public/ig/lib/game/asteroids/entities/missile.js',
      '/public/ig/lib/game/asteroids/entities/player.js',
      '/public/ig/lib/game/asteroids/entities/laser.js',
      '/public/ig/lib/game/asteroids/entities/ufo.js',
      '/public/ig/lib/game/asteroids/hud.js',
      '/public/ig/lib/game/asteroids/game.js',
      '/public/ig/lib/game/asteroids/mmenu.js',
      '/public/ig/lib/game/asteroids/splash.js'

  ]

};

