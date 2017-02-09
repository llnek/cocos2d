// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires zotohlab/asx/scenes
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/odin
 * @module zotohlab/gui/online
 */

import scenes from 'zotohlab/asx/scenes';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import odin from 'zotohlab/asx/odin';

//////////////////////////////////////////////////////////////////////////
let evts= odin.Events,
sjs= sh.skarojs,
xcfg= sh.xcfg,
csts= xcfg.csts,
R = sjs.ramda,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @extends module:zotohlab/asx/scenes.XLayer
 * @class UILayer
 */
UILayer =  scenes.XLayer.extend({
  /**
   * @method onOnlineReq
   * @private
   */
  onOnlineReq(uid,pwd) {
    const wsurl = sjs.fmtUrl(sjs.getWebSockProtocol(), sh.wsUri),
    user = (uid || '').trim(),
    pswd = (pwd || '').trim();

    if (user.length === 0 ||
        pswd.length === 0) { return; }

    this.wss= odin.reifySession({game: xcfg.appKey,
                                 user: user, passwd: pswd });
    this.wss.listenAll(this.onOdinEvent, this);
    this.wss.connect(wsurl);
  },
  /**
   * @method onOdinEvent
   * @private
   */
  onOdinEvent(evt) {
    //sjs.loggr.debug(evt);
    switch (evt.type) {
      case evts.MSG_NETWORK: this.onNetworkEvent(evt); break;
      case evts.MSG_SESSION: this.onSessionEvent(evt); break;
    }
  },
  /**
   * @method onNetworkEvent
   * @private
   */
  onNetworkEvent(evt) {
    switch (evt.code) {
      case evts.PLAYER_JOINED:
        //TODO
        sjs.loggr.debug("another player joined room. " + evt.source.puid);
      break;
      case evts.START:
        sjs.loggr.info("play room is ready, game can start.");
        this.wss.cancelAll();
        // flip to game scene
        this.options.yes(this.wss, this.player, evt.source || {});
      break;
    }
  },
  /**
   * @method onSessionEvent
   * @private
   */
  onSessionEvent(evt) {
    switch (evt.code) {
      case evts.PLAYREQ_OK:
        sjs.loggr.debug("player " +
                        evt.source.pnum +
                        ": request to play game was successful.");
        this.player=evt.source.pnum;
        this.showWaitOthers();
      break;
    }
  },
  /**
   * @method onCancelPlay
   * @private
   */
  onCancelPlay() {
    try {
      this.wss.close();
    } catch (e) {}
    this.wss=null;
    this.options.onback();
  },
  /**
   * @method showWaitOthers
   * @private
   */
  showWaitOthers() {
    let qn= new cc.LabelBMFont(sh.l10n('%waitother'),
                               sh.getFont('font.OCR')),
    cw= ccsx.center(),
    wz= ccsx.vrect(),
    wb = ccsx.vbox(),
    menu;

    this.removeAll();

    qn.setPosition(cw.x, wb.top * 0.75);
    qn.setScale(xcfg.game.scale * 0.3);
    qn.setOpacity(0.9*255);
    this.addItem(qn);

    menu= ccsx.vmenu([
      { nnn: '#cancel.png',
        cb() {
          this.onCancelPlay();
        },
        target: this
      }
    ],
    {pos: cc.p(cw.x, wb.top * 0.1) });
    this.addItem(menu);
  },
  /**
   * @method setup
   * @protected
   */
  setup() {
    let qn= new cc.LabelBMFont(sh.l10n('%signinplay'),
                               sh.getFont('font.OCR')),
    cw= ccsx.center(),
    wz= ccsx.vrect(),
    wb= ccsx.vbox(),
    uid, pwd,
    me=this,
    menu;

    this.centerImage(sh.getImage('game.bg'));
    qn.setPosition(cw.x, wb.top * 0.75);
    qn.setScale(xcfg.game.scale * 0.3);
    qn.setOpacity(0.9*255);
    this.addItem(qn);

    let bxz = new cc.Sprite('#ok.png').getContentSize();

    // editbox for user
    uid = new ccui.TextField();
    uid.setMaxLengthEnabled(true);
    uid.setMaxLength(16);
    uid.setTouchEnabled(true);
    uid.fontName = "Arial";
    uid.fontSize = 18;
    uid.placeHolder = sh.l10n('%userid');
    uid.setPosition(cw.x, cw.y + bxz.height * 0.5 + 2);
    this.addItem(uid);

    // editbox for password
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
      { nnn: '#continue.png',
        cb() {
          this.onOnlineReq(uid.getString(),pwd.getString());
        },
        target: this },

      { nnn: '#cancel.png',
        cb() {
          this.options.onback();
        },
        target: this }
    ],
    {pos: cc.p(cw.x, wb.top * 0.1) });
    this.addItem(menu);
  }

});

/** @alias module:zotohlab/asx/online */
const xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti : sh.ptypes.online,
  /**
   * Create the online-request play screen.
   * @method reify
   * @param {Object} options
   * @return {cc.Scene}
   */
  reify(options) {
    return new scenes.XSceneFactory([ UILayer ]).reify(options);
  }

};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/

//////////////////////////////////////////////////////////////////////////////
//EOF

