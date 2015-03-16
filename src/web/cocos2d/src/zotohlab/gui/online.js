// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define("zotohlab/asx/onlineplay", ['cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx',
                                  'zotohlab/asx/xlayers',
                                  'zotohlab/asx/xscenes',
                                  'zotohlab/asx/odin'],
  function (sjs, sh, ccsx, layers, scenes, odin) { "use strict";

    var events= odin.Events,
    xcfg= sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    unde,

    BGLayer = layers.XLayer.extend({

      rtti: function() { return "BGLayer"; },

      ctor: function() {
        var bg= new cc.Sprite(sh.getImagePath('game.bg')),
        cw= ccsx.center();
        this._super();
        bg.setPosition(cw.x, cw.y);
        this.addItem(bg);
      },

      pkInit: function() {}

    }),

    UILayer =  layers.XLayer.extend({

      onOnlineReq: function(uid,pwd) {
        var wsurl = sjs.fmtUrl(sjs.getWebSockProtocol(), "/network/odin/websocket"),
        //gid = $('body').attr('data-gameid') || '',
        wsurl,
        user = (uid || '').trim(),
        pswd = (pwd || '').trim();

        if (user.length === 0 ||
            pswd.length === 0) { return; }

        this.wss= odin.newSession({ game: xcfg.appKey, user: user, passwd: pswd });
        this.wss.subscribeAll(this.onOdinEvent, this);
        this.wss.connect(wsurl);
      },

      onOdinEvent: function(topic,evt) {
        //sjs.loggr.debug(evt);
        switch (evt.type) {
          case events.NETWORK_MSG: this.onNetworkEvent(evt); break;
          case events.SESSION_MSG: this.onSessionEvent(evt); break;
        }
      },

      onNetworkEvent: function(evt) {
        switch (evt.code) {
          case events.C_PLAYER_JOINED:
            //TODO
            sjs.loggr.debug("another player joined room. " + evt.source.puid);
          break;
          case events.C_START:
            sjs.loggr.info("play room is ready, game can start.");
            this.wss.unsubscribeAll();
            // flip to game scene
            this.options.yes(this.wss, this.player, evt.source || {});
          break;
        }
      },

      onSessionEvent: function(evt) {
        switch (evt.code) {
          case events.C_PLAYREQ_OK:
            sjs.loggr.debug("player " +
                            evt.source.pnum +
                            ": request to play game was successful.");
            this.player=evt.source.pnum;
            this.showWaitOthers();
          break;
        }
      },

      onCancelPlay: function() {
        try {
          this.wss.close();
        } catch (e) {}
        this.wss=null;
        this.options.onBack();
      },

      showWaitOthers: function() {
        this.removeAll();
        var qn= new cc.LabelBMFont(sh.l10n('%waitother'),
                                   sh.getFontPath('font.OCR')),
        cw= ccsx.center(),
        wz= ccsx.vrect(),
        wb = ccsx.vbox(),
        me=this, menu;

        qn.setPosition(cw.x, wb.top * 0.75);
        qn.setScale(xcfg.game.scale * 0.3);
        qn.setOpacity(0.9*255);
        this.addItem(qn);

        menu= ccsx.vmenu([
          { imgPath: '#cancel.png',
            cb: function() {
              this.onCancelPlay();
            },
            target: me
          }
        ]);
        menu.setPosition(cw.x, wb.top * 0.2);
        this.addItem(menu);
      },

      pkInit: function() {
        var qn= new cc.LabelBMFont(sh.l10n('%signinplay'),
                                   sh.getFontPath('font.OCR')),
        cw= ccsx.center(),
        wz= ccsx.vrect(),
        wb= ccsx.vbox(),
        uid, pwd,
        me=this,
        menu;

        this._super();

        qn.setPosition(cw.x, wb.top * 0.75);
        qn.setScale(xcfg.game.scale * 0.3);
        qn.setOpacity(0.9*255);
        this.addItem(qn);

        var dummy = new cc.Sprite('#ok.png'),
        bxz= dummy.getContentSize();

        uid = new ccui.TextField();
        uid.setMaxLengthEnabled(true);
        uid.setMaxLength(16);
        uid.setTouchEnabled(true);
        uid.fontName = "Arial";
        uid.fontSize = 18;
        uid.placeHolder = sh.l10n('%userid');
        uid.setPosition(cw.x, cw.y + bxz.height * 0.5 + 2);
        this.addItem(uid);

        pwd = new ccui.TextField();
        pwd.setPasswordEnabled(true);
        pwd.setPasswordStyleText("*");
        pwd.setTouchEnabled(true);
        pwd.setMaxLength(16);
        pwd.fontName = "Arial";
        pwd.fontSize = 18;
        pwd.placeHolder = sh.l10n('%passwd');
        pwd.setPosition(cw.x, cw.y - bxz.height * 0.5 - 2);
        this.addItem(pwd);

        menu= ccsx.vmenu([
          { imgPath: '#continue.png',
            cb: function() {
              this.onOnlineReq(uid.getString(),pwd.getString());
            },
            target: me },

          { imgPath: '#cancel.png',
            cb: function() {
              this.options.onBack();
            },
            target: me }
        ]);
        menu.setPosition(cw.x, wb.top * 0.2);
        this.addItem(menu);
      }

    });

    return {

      'OnlinePlay' : {
        create: function(options) {
          return new scenes.XSceneFactory([ BGLayer, UILayer ]).create(options);
        }
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

