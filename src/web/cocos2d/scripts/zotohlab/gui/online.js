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

(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
odin= global.ZotohLab.Odin,
sjs = global.SkaroJS,
$ = global.jQuery,
events= odin.Events,
ccsx = asterix.COCOS2DX;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var BGLayer = asterix.XLayer.extend({

  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.getTilesPath('gui.blank'));
    this.addItem(map);
    return this._super();
  }

});

var UILayer =  asterix.XLayer.extend({

  onOnlineReq: function(uid,pwd) {
    var wsurl = sjs.fmtUrl(sjs.getWebSockProtocol(), "/network/odin/websocket"),
    //gid = $('body').attr('data-gameid') || '',
    wsurl,
    user = (uid || '').trim(),
    pswd = (pwd || '').trim();

    if (user.length === 0 ||
        pswd.length === 0) { return; }

    this.wss= odin.newSession({ game: sh.xcfg.appKey, user: user, passwd: pswd });
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
    this.removeAllItems();
    var qn= new cc.LabelBMFont(sh.l10n('%waitothers'),
                               sh.getFontPath('font.TinyBoxBB')),
    csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    s1, s2, t1, t2, menu;

    qn.setPosition(cw.x, wz.height * 0.90);
    qn.setScale(18/72);
    qn.setOpacity(0.9*255);
    this.addItem(qn);

    s2= new cc.Sprite(sh.getImagePath('gui.mmenu.back'));
    t2= new cc.MenuItemSprite();
    t2.initWithNormalSprite(s2, null, null, function() {
      this.onCancelPlay();
    }, this);

    menu= cc.Menu.create(t2);
    menu.alignItemsHorizontallyWithPadding(10);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF - s2.getContentSize().width * 0.5,
      csts.TILE + csts.S_OFF + s2.getContentSize().height * 0.5);
    this.addItem(menu);
  },

  pkInit: function() {
    var qn= new cc.LabelBMFont(sh.l10n('%signinplay'),
                               sh.getFontPath('font.TinyBoxBB')),
    csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    uid,pwd,
    s1, s2, t1, t2, menu;

    qn.setPosition(cw.x, wz.height * 0.90);
    qn.setScale(18/72);
    qn.setOpacity(0.9*255);
    this.addItem(qn);

    var url = sh.sanitizeUrl(sh.xcfg.assets.images['gui.edit.orange']),
    s9= new cc.Scale9Sprite(url),
    wcc= cc.color(255,255,255),
    bxz= cc.size(100,36);

    uid = new cc.EditBox(bxz,s9);
    uid.x = cw.x
    uid.y = cw.y + bxz.height * 0.5 + 2; // + 2 for a gap
    uid.setPlaceHolder(sh.l10n('%userid'));
    uid.setPlaceholderFontColor(wcc);
    uid.setFontColor(wcc);
    uid.setMaxLength(12);
    uid.setDelegate(this);
    this.addItem(uid);

    s9= new cc.Scale9Sprite(url);
    pwd= new cc.EditBox(bxz,s9);
    pwd.y = cw.y - bxz.height * 0.5 - 2; // + 2 for a gap
    pwd.x= cw.x;
    pwd.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
    pwd.setPlaceHolder(sh.l10n('%passwd'));
    pwd.setPlaceholderFontColor(wcc);
    pwd.setFontColor(wcc);
    pwd.setMaxLength(12);
    pwd.setDelegate(this);
    this.addItem(pwd);

    s2= new cc.Sprite(sh.getImagePath('gui.mmenu.back'));
    s1= new cc.Sprite(sh.getImagePath('gui.mmenu.ok'));
    t2 = new cc.MenuItemSprite();
    t2.initWithNormalSprite(s2, null, null, function() {
      this.options.onBack();
    }, this);
    t1 = new cc.MenuItemSprite();
    t1.initWithNormalSprite(s1, null, null, function() {
      this.onOnlineReq(uid.getString(),pwd.getString());
    }, this);

    menu= new cc.Menu(t1,t2);
    menu.alignItemsHorizontallyWithPadding(10);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF - (s2.getContentSize().width + s1.getContentSize().width + 10) * 0.5,
      csts.TILE + csts.S_OFF + s2.getContentSize().height * 0.5);
    this.addItem(menu);

    return this._super();
  }

});

sh.protos['OnlinePlay'] = {

  create: function(options) {
    return new asterix.XSceneFactory([ BGLayer, UILayer ]).create(options);
  }

};


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

