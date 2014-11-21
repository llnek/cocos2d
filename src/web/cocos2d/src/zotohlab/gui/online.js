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

      pkInit: function() {
        var imgUrl= sh.getImagePath('gui.blank'),
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
        var qn= new cc.LabelBMFont(sh.l10n('%waitothers'),
                                   sh.getFontPath('font.OCR')),
        cw= ccsx.center(),
        wz= ccsx.vrect(),
        wb = ccsx.vbox(),
        t2, menu,
        s2 = R.map.idx(function(z,n) {
          return new cc.Sprite(sh.getImagePath('gui.mmenu.back'));
        }, [null,null,null]);

        qn.setPosition(cw.x, wb.top * 0.90);
        qn.setScale(0.06);
        qn.setOpacity(0.9*255);
        this.addItem(qn);

        t2= new cc.MenuItemSprite(s2[0], s2[1], s2[2], function() {
          this.onCancelPlay();
        }, this);

        menu= cc.Menu.create(t2);
        menu.alignItemsHorizontallyWithPadding(10);
        menu.setPosition(wb.right - csts.TILE - csts.S_OFF - s2[0].getContentSize().width * 0.5,
          wb.bottom + csts.TILE + csts.S_OFF + s2[0].getContentSize().height * 0.5);
        this.addItem(menu);
      },

      pkInit: function() {
        var qn= new cc.LabelBMFont(sh.l10n('%signinplay'),
                                   sh.getFontPath('font.OCR')),
        cw= ccsx.center(),
        wz= ccsx.vrect(),
        wb= ccsx.vbox(),
        uid, pwd,
        menu;

        this._super();

        qn.setPosition(cw.x, wb.top * 0.90);
        qn.setScale(0.06);
        qn.setOpacity(0.9*255);
        this.addItem(qn);

        var url = sh.sanitizeUrl(xcfg.assets.images['gui.edit.orange']),
        s9= new cc.Scale9Sprite(url),
        wcc= cc.color(255,255,255),
        bxz= cc.size(100,36);

        uid = new cc.EditBox(bxz, s9);
        uid.x = cw.x
        uid.y = cw.y + bxz.height * 0.5 + 2; // + 2 for a gap
        uid.setPlaceHolder(sh.l10n('%userid'));
        uid.setPlaceholderFontColor(wcc);
        uid.setFontColor(wcc);
        uid.setMaxLength(12);
        uid.setDelegate(this);
        this.addItem(uid);

        s9= new cc.Scale9Sprite(url);
        pwd= new cc.EditBox(bxz, s9);
        pwd.y = cw.y - bxz.height * 0.5 - 2; // + 2 for a gap
        pwd.x= cw.x;
        pwd.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        pwd.setPlaceHolder(sh.l10n('%passwd'));
        pwd.setPlaceholderFontColor(wcc);
        pwd.setFontColor(wcc);
        pwd.setMaxLength(12);
        pwd.setDelegate(this);
        this.addItem(pwd);

        var s2= R.map.idx(function(z,n,a) {
          return new cc.Sprite(sh.getImagePath('gui.mmenu.back'));
        },[0,1,2]),
        s1= R.map.idx(function(z,n,a) {
          return new cc.Sprite(sh.getImagePath('gui.mmenu.ok'));
        },[0,1,2]),
        t2,t1;

        t2 = new cc.MenuItemSprite(s2[0], s2[1], s2[2], function() {
          this.options.onBack();
        }, this);
        t1 = new cc.MenuItemSprite(s1[0], s1[1], s1[2], function() {
          this.onOnlineReq(uid.getString(),pwd.getString());
        }, this);

        menu= new cc.Menu(t1,t2);
        menu.alignItemsHorizontallyWithPadding(10);
        menu.setPosition(wb.right - csts.TILE - csts.S_OFF - (s2[0].getContentSize().width + s1[0].getContentSize().width + 10) * 0.5,
          wb.bottom + csts.TILE + csts.S_OFF + s2[0].getContentSize().height * 0.5);
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

