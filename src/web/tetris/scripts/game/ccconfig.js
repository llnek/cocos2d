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
      '/public/ig/lib/game/tetris/entities/block.js',
      '/public/ig/lib/game/tetris/entities/shape.js',
      '/public/ig/lib/game/tetris/entities/box.js',
      '/public/ig/lib/game/tetris/entities/line.js',
      '/public/ig/lib/game/tetris/entities/nub.js',
      '/public/ig/lib/game/tetris/entities/elx.js',
      '/public/ig/lib/game/tetris/entities/el.js',
      '/public/ig/lib/game/tetris/entities/stx.js',
      '/public/ig/lib/game/tetris/entities/st.js',
      '/public/ig/lib/game/tetris/hud.js',
      '/public/ig/lib/game/tetris/game.js',
      '/public/ig/lib/game/tetris/mmenu.js',
      '/public/ig/lib/game/tetris/splash.js'
  ]

};

