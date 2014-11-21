// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

define("zotohlab/p/hud", ['cherimoia/skarojs',
                         'zotohlab/asterix',
                         'zotohlab/asx/ccsx',
                         'zotohlab/asx/xlayers',
                         'zotohlab/asx/xscenes'],

  function (sjs, sh, ccsx, layers, scenes) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    BackLayer = cc.LayerColor.extend({

      rtti: function() { return 'BackLayer'; },

      ctor: function() {
        this._super(cc.color(38,119,120));
      }

    }),

    XXBackLayer = layers.XLayer.extend({

      rtti: function() { return 'BackLayer'; },

      pkInit: function() {
        var imgUrl= sh.getImagePath('arena.bg'),
        s,
        cw = ccsx.center();

        this._super();

        if (!!imgUrl) {
          s= new cc.Sprite(imgUrl);
          s.setPosition(cw);
          this.addItem(s);
        }
      }

    }),

    HUDLayer = layers.XGameHUDLayer.extend({

      ctor: function(options) {
        this._super(options);
        this.mode= 0;
        this.p2Long= '';
        this.p1Long= '';
        this.p2ID= '';
        this.p1ID= '';
      },

      initScores: function() {
        this.scores= {};
        this.scores[csts.P2_COLOR] =  0;
        this.scores[csts.P1_COLOR] =  0;
      },

      setGameMode: function(mode) {
        this.initScores();
        this.mode= mode;
      },

      initAtlases: sjs.NILFUNC,
      initIcons: sjs.NILFUNC,

      initLabels: function() {
        var cw= ccsx.center(),
        wz= ccsx.vrect(),
        wb= ccsx.vbox();

        this.title = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.JellyBelly'),
          text: '',
          anchor: ccsx.AnchorTop,
          scale: 0.1,
          pos: cc.p(cw.x, wb.top - 2*csts.TILE)
        });
        this.addItem(this.title);

        this.score1= ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.SmallTypeWriting'),
          text: '0',
          scale: 0.2,
          color: cc.color(220,104,90),
          pos: cc.p(csts.TILE + csts.S_OFF + 2,
                    wb.top - csts.TILE - csts.S_OFF),
          anchor: ccsx.AnchorTopLeft
        });
        this.addItem(this.score1);

        this.score2= ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.SmallTypeWriting'),
          text: '0',
          scale: 0.2,
          color: cc.color(236,175,79),
          pos: cc.p(wb.right - csts.TILE - csts.S_OFF,
                    wb.top - csts.TILE - csts.S_OFF),
          anchor: ccsx.AnchorTopRight
        });
        this.addItem(this.score2);

        this.status= ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.Subito'),
          text: '',
          scale: 0.06,
          pos: cc.p(cw.x, wb.bottom + csts.TILE * 10)
        });
        this.addItem(this.status);

        this.result= ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.Subito'),
          text: '',
          scale: 0.06,
          pos: cc.p(cw.x, wb.bottom + csts.TILE * 10),
          visible: false
        });
        this.addItem(this.result);

      },

      showTimer: function() {
        var cw= ccsx.center(),
        wz= ccsx.vrect(),
        wb= ccsx.vbox();

        // timer is already showing, go away
        if (this.countDownState) {
          return;
        }

        if (! this.countDown) {
          this.countDown= ccsx.bmfLabel({
            fontPath: sh.getFontPath('font.AutoMission'),
            text: '',
            scale: 0.1,
            color: cc.color(255,255,255), // 0xff6600;
            pos: cc.p(cw.x,
                      wb.top - 10*csts.TILE),
            anchor: ccsx.AnchorCenter
          });
          this.addItem(this.countDown);
        }

        this.countDownValue= csts.PLAYER_THINK_TIME;
        this.showCountDown();

        this.schedule(this.updateTimer, 1.0);
        this.countDownState= true;
      },

      updateTimer: function(dt) {

        if (!this.countDownState) { return; } else {
          this.countDownValue -= 1;
        }

        if (this.countDownValue < 0) {
          this.killTimer();
          sh.fireEvent('/game/player/timer/expired');
        }
        else {
          this.showCountDown();
        }
      },

      showCountDown: function(msg) {
        if (!!this.countDown) {
          this.countDown.setString(msg || '' + this.countDownValue);
        }
      },

      killTimer: function() {
        if (this.countDownState) {
          this.unschedule(this.updateTimer);
          this.showCountDown(' ');
        }
        this.countDownState=false;
        this.countDownValue=0;
      },

      updateScore: function(pcolor, value) {
        this.scores[pcolor] += value;
        this.drawScores();
      },

      update: function(running, pnum) {
        if (running) {
          this.drawStatus(pnum);
        } else {
          this.drawResult(pnum);
        }
      },

      endGame: function(winner) {
        this.replayBtn.setVisible(true);
        this.result.setVisible(true);
        this.status.setVisible(false);
        this.drawResult(winner);
      },

      drawStatusText: function(obj, msg) {
        obj.setString(msg || '');
      },

      drawScores: function() {
        var s2 = this.scores[this.play2],
        s1 = this.scores[this.play1],
        n2 = ''+s2,
        n1 = ''+s1;

        this.score1.setString(n1);
        this.score2.setString(n2);
      },

      drawResult: function(pnum) {
        var msg;

        if (sjs.isNumber(pnum)) {
          switch (pnum) {
            case 2: msg= sh.l10n('%whowin', { who: this.p2Long}); break;
            case 1: msg= sh.l10n('%whowin', { who: this.p1Long}); break;
          }
        } else {
          msg= sh.l10n('%whodraw');
        }

        this.drawStatusText(this.result, msg);
      },

      drawStatus: function(pnum) {
        if (sjs.isNumber(pnum)) {
          var pfx = pnum === 1 ? this.p1Long : this.p2Long;
          this.drawStatusText(this.status,
                              sh.l10n('%whosturn', {
            who: pfx
          }));
        }
      },

      regoPlayers: function(color1,p1ids,color2,p2ids) {
        this.play2= color2;
        this.play1= color1;
        this.p2Long= p2ids[1];
        this.p1Long= p1ids[1];
        this.p2ID= p2ids[0];
        this.p1ID= p1ids[0];
        this.title.setString(this.p1ID + " / " + this.p2ID);
      },

      resetAsNew: function() {
        this.initScores();
        this.reset();
      },

      reset: function() {
        this.replayBtn.setVisible(false);
        this.result.setVisible(false);
        this.status.setVisible(true);
      }


    });

    return {
      BackLayer: BackLayer,
      HUDLayer: HUDLayer
    };

});


//////////////////////////////////////////////////////////////////////////////
//EOF

