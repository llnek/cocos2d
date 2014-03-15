// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Cherimoia, LLC. All rights reserved.

(function(undef) { "use strict"; var global=this; var _ = global._;
var asterix = global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var png= asterix.Pong;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

png.GameArena = asterix.XScreen.extends({

  scores : { 'O': 0, 'X': 0 },
  MAX_SCORE: 1, //11,

  players: [],
  ball: null,
  keys: [],

  unbindEvents: function() {
    _.each(this.keys, function(z) {
      sh.main.input.keyboard.removeKey(z.key);
      z.keySignal.detach();
    });
    this.keys=[];
  },

  bindEventsXXX: function(p, up, down) {
    var sb, k = sh.main.input.keyboard.addKey(down);
    sb = k.onDown.add(function() { p.moveDown(); }, this);
    this.keys.push( { key: down, signal: sb } );

    k = sh.main.input.keyboard.addKey(up);
    sb = k.onDown.add(function() { p.moveUp(); }, this);
    this.keys.push( { key: up, signal: sb } );
  },

  bindEvents: function(p1,p2) {
    this.bindEventsXXX(p1,Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);
    if (sh.xcfg.csts.GAME_MODE === 2) {
      this.bindEventsXXX(p2,Phaser.Keyboard.W, Phaser.Keyboard.S);
    }
  },

  play: function() {
    var paddImg= sh.main.cache.getImage('gamelevel1.images.paddle2');
    var ballImg= sh.main.cache.getImage('gamelevel1.images.ball');
    var csts= sh.xcfg.csts;
    var c= sh.main.getCenter();
    var z= sh.main.getSize();
    this.maybeReset();

    //sprites are always centered internally
    var p1 = new png.EntityHuman( csts.TILE + ballImg.width + 4 + paddImg.width/2,
                                  c.y, { color: 'X' });
    var p2= null;
    switch (csts.GAME_MODE) {
    case 1:
    p2 = new png.EntityRobot( z.x - csts.TILE - 4 - ballImg.width - paddImg.width/2,
                              c.y,
                              { color: 'O' });
    break;
    case 2:
    p2 = new png.EntityHuman( z.x - csts.TILE - 4 - ballImg.width - paddImg.width/2,
                              c.y,
                              { color: 'O' });
    case 3:
    break;
    };


    this.players= [ null, p1, p2];
    this.doLayout();

    p2.create(this);
    p1.create(this);
    this.spawnBall();

    //this.bindEvents(p1,p2);
  },

  spawnBall: function() {
    var ballImg= sh.main.cache.getImage('gamelevel1.images.ball');
    var c= sh.main.getCenter();
    // anchored to center internally
    this.ball = new png.EntityBall( c.x, c.y, {});
    this.ball.create(this);
  },

  doLayout: function() {
    var ml, c= sh.main.getCenter();
    var s= sh.main.getSize();
    var csts= sh.xcfg.csts;
    // background
    this.map = sh.main.add.tilemap('gamelevel1.tiles.arena');
    this.map.addTilesetImage('Borders', 'gui.mmenu.border');
    this.map.addTilesetImage('BG', 'gamelevel1.images.arena');
    ml= this.map.createLayer('Back',undef, undef, this.group);
    ml = this.map.createLayer('Front',undef, undef, this.group);
    this.boundary = ml;
    this.map.setCollisionByExclusion([],true, 'Front');

    //sh.phaser.physics.setBoundsToWorld(true,true,true,true);
    /*
    sh.main.physics.arcade.bounds.setTo(csts.TILE, s.y - csts.TILE,
                                s.x - csts.TILE * 2, s.y - csts.TILE * 2);
                                */

    this.score1 = sh.main.add.bitmapText( 0,0, 'font.OCR', '8', 40, this.group);
    this.score1.tint= 0xda4848;
    this.score2 = sh.main.add.bitmapText( 0,0, 'font.OCR', '8', 40, this.group);
    this.score2.tint= 0x6abe61;

    this.status = sh.main.add.bitmapText( 0,0, 'font.TinyBoxBB', '', 12, this.group);
    this.result = sh.main.add.bitmapText( 0,0, 'font.TinyBoxBB', '', 12, this.group);

    this.guiBtns();
  },

  guiBtns: function() {
    var img2= sh.main.cache.getImage('game.arena.replay');
    var img1= sh.main.cache.getImage('game.arena.menu');
    var csts = sh.xcfg.csts;
    var c= sh.main.getCenter();
    var x,y;

    y = csts.TILE + csts.S_OFF;
    x = c.x - img1.width/2;
    this.menuBtn = sh.main.add.button( x, y, 'game.arena.menu', function() {
      sh.xcfg.smac.settings();
    }, this, 0,0,0,0,this.group);
    this.btns.push(this.menuBtn);

    y = (csts.GRID_H - 1) * csts.TILE - csts.S_OFF - img2.height;
    x = c.x;
    this.replayBtn = sh.main.add.button( x, y, 'game.arena.replay', function() {
      sh.xcfg.smac.replay();
    }, this, 0,0,0,0,this.group);
    this.replayBtn.visible=false;
    this.btns.push(this.replayBtn);

    this.drawScores();
  },

  drawScores: function() {
    var s2 = this.scores[this.players[2].color];
    var s1 = this.scores[this.players[1].color];
    var x, y, csts= sh.xcfg.csts;
    var c = sh.main.getCenter();
    var n2 = global.ZotohLabs.prettyNumber(s2,1);
    var n1 = global.ZotohLabs.prettyNumber(s1,1);

    this.score1.setText(n1);
    this.score1.updateText();
    y = csts.TILE + csts.S_OFF;
    x= c.x - 50 - this.score1.textWidth;
    this.score1.repos( x,y);

    this.score2.setText(n2);
    this.score2.updateText();
    y = csts.TILE + csts.S_OFF;
    x= c.x + 50;
    this.score2.repos( x,y);
  },

  loseFocus: function() {
  },

  focus: function(options) {
    options= options || {};
    switch (options.action) {

      case 'new-2':
        this.newGame(2);
      break;

      case 'new-1':
        this.newGame(1);
      break;

      case 'continue':
      break;

      case 'replay':
        this.replay();
      break;

    }

  },

  newGame: function(mode) {
    sh.main.sfxPlay('start_game');
    this.setGameMode(mode);
    this.resetScores();
    this.play();
  },

  resetScores: function() {
    this.scores= { 'X' : 0, 'O' : 0 };
  },

  maybeReset: function() {
    this.unbindEvents();
    this.players=[];
    this.keys=[];
    this.boundary= null;
  },

  updateEntities: function() {
    this.players[2].update();
    this.players[1].update();
    this.ball.update();
    /*
    this.physics.collide(this.players[2], this.ball,
        this.paddleHitBallHandler, this.paddleHitBallProcess, this);
    this.physics.collide(this.players[1], this.ball,
        this.paddleHitBallHandler, this.paddleHitBallProcess, this);
    */
  },

  update: function() {
    if (this.ball) {
      this.updateEntities();
      this.checkWinner();
    }
    this.drawGui();
  },

  checkWinner: function() {
    if ( this.ball.x + this.ball.width < this.players[1].x) {
      return this.onWinner(this.players[2]);
    } else if (this.ball.x > this.players[2].x + this.players[2].x) {
      return this.onWinner(this.players[1]);
    } else {
      return false;
    }
  },

  onWinner: function(p) {
    var s = this.scores[p.color];
    this.scores[p.color] = s + 1;
    this.ball.kill();
    this.ball=null;
    if (s+1 >= this.MAX_SCORE) {
      this.onDone(p);
    } else {
      this.spawnBall();
    }
  },

  onDone: function(p) {
    //sh.xcfg.sfxPlay(this.sfx.game_end);
    this.replayBtn.visible = true;
    this.lastWinner = p;
  },

  drawGui: function() {
  },

  setGameMode: function(mode) {
    this.parent(mode);
    this.p2ID= sh.l10n("%p2");
    this.p1ID= sh.l10n("%p1");
    if (mode === 1) {
      this.p2Long= sh.l10n('%computer');
      this.p2ID= sh.l10n('%cpu');
    }
  }


});






}).call(this);





