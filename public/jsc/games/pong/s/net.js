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

"use strict"; /**
              * @requires zotohlab/asx/asterix
              * @requires zotohlab/asx/ccsx
              * @requires n/gnodes
              * @requires zotohlab/asx/odin
              * @requires Rx
              * @module s/net
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _odin = require('zotohlab/asx/odin');

var _odin2 = _interopRequireDefault(_odin);

var _Rx = require('Rx');

var _Rx2 = _interopRequireDefault(_Rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var evts = _odin2.default.Events,
    sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class Net */
Net = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/net~Net
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/net~Net
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.paddles = null;
    this.balls = null;
    this.fauxs = null;
    this.stream = null;
    this.evQ = null;
  },

  /**
   * @memberof module:s/net~Net
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.paddles = engine.getNodeList(_gnodes2.default.PaddleNode);
    this.balls = engine.getNodeList(_gnodes2.default.BallNode);
    this.fauxs = engine.getNodeList(_gnodes2.default.FauxPaddleNode);
    this.evQ = [];
  },

  /**
   * @memberof module:s/net~Net
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    if (!this.inited) {
      this.onceOnly();
      this.inited = true;
    } else {
      this.doit(dt);
    }
  },

  /**
   * @method doit
   * @private
   */
  doit: function doit(dt) {
    var evt = this.evQ.length > 0 ? this.evQ.shift() : undef;
    if (!!evt) {
      this.onevent(evt.event);
    }
  },

  /**
   * @method onceOnly
   * @private
   */
  onceOnly: function onceOnly() {
    var _this = this;

    if (sjs.isobj(this.state.wsock)) {
      sjs.loggr.debug("reply to server: session started ok");
      var src = R.pick(['framespersec', 'world', 'syncMillis', 'paddle', 'ball', 'p1', 'p2', 'numpts'], this.state);
      this.state.wsock.cancenlAll();
      this.state.wsock.send({
        source: sjs.jsonfy(src),
        type: evts.MSG_SESSION,
        code: evts.STARTED
      });
      this.stream = _Rx2.default.Observable.create(function (obj) {
        _this.state.wsock.listenAll(function (e) {
          obj.onNext({ group: 'net', event: e });
        });
      });
    } else {
      this.stream = _Rx2.default.Observable.never();
    }
    this.stream.subscribe(function (msg) {
      if (!!_this.evQ) {
        _this.evQ.push(msg);
      }
    });
  },

  /**
   * Get an odin event, first level callback
   * @method onevent
   * @private
   */
  onevent: function onevent(evt) {
    sjs.loggr.debug(evt);
    switch (evt.type) {
      case evts.MSG_NETWORK:
        this.onnetw(evt);
        break;
      case evts.MSG_SESSION:
        this.onsess(evt);
        break;
    }
  },

  /**
   * @method onnetw
   * @private
   */
  onnetw: function onnetw(evt) {
    switch (evt.code) {
      case evts.RESTART:
        sjs.loggr.debug("restarting a new game...");
        _asterix2.default.fire('/game/restart');
        break;
      case evts.STOP:
        sjs.loggr.debug("game will stop");
        _asterix2.default.fire('/game/stop', evt);
        break;
      case evts.SYNC_ARENA:
        sjs.loggr.debug("synchronize ui as defined by server.");
        this.process(evt);
        this.state.poked = true;
        break;
    }
  },

  /**
   * @method onSessionEvent
   * @private
   */
  onsess: function onsess(evt) {
    if (!sjs.isobj(evt.source)) {
      return;
    }
    switch (evt.code) {
      case evts.POKE_MOVE:
        sjs.loggr.debug("activate arena, start to rumble!");
        if (this.state.pnum === evt.source.pnum) {
          this.state.poked = true;
        } else {
          sjs.loggr.error("Got POKED but with wrong player number. " + evt.source.pnum);
        }
        break;
      case evts.SYNC_ARENA:
        sjs.loggr.debug("synchronize ui as defined by server.");
        this.process(evt);
        this.state.poked = true;
        break;}
  },

  /**
   * @method syncScores
   * @private
   */
  syncScores: function syncScores(scores) {
    var actors = this.state.players,
        rc = {};
    rc[actors[2].color] = scores.p2;
    rc[actors[1].color] = scores.p1;
    _asterix2.default.fire('/hud/score/sync', { points: rc });
  },

  /**
   * @method process
   * @private
   */
  process: function process(evt) {
    sjs.loggr.debug("process: => " + sjs.jsonfy(evt.source));
    var actors = this.state.players,
        win = void 0,
        node = void 0,
        ok = true;

    if (sjs.isobj(evt.source.winner)) {
      win = actors[evt.source.winner.pnum];
      sjs.loggr.debug("server sent us new winner ==> " + win.color);
      this.syncScores(evt.source.winner.scores);
      _asterix2.default.fire('/hud/end', { winner: win.color });
    }

    if (sjs.isobj(evt.source.scores)) {
      sjs.loggr.debug("server sent us new scores !!!!");
      this.syncScores(evt.source.scores);
      // once we get a new score, we reposition the entities
      // and pause the game (no moves) until the server
      // tells us to begin a new point.
      this.reposEntities();
      ok = false;
      //this.state.poked=false;
    }

    if (sjs.isobj(evt.source.ball)) {
      sjs.loggr.debug("server says: Ball got SYNC'ED !!!");
      var c = evt.source.ball;
      node = this.balls.head;
      if (!!node) {
        node.ball.sprite.setPosition(c.x, c.y);
        node.velocity.vel.y = c.vy;
        node.velocity.vel.x = c.vx;
      }
    }

    this.syncPaddles(this.paddles, evt);
    this.syncPaddles(this.fauxs, evt);

    return ok;
  },

  /**
   * Reset back to default position, no movements
   * @method reposPaddles
   * @private
   */
  reposPaddles: function reposPaddles(nl) {
    for (var node = nl.head; node; node = node.next) {
      if (node.player.pnum === 2) {
        node.paddle.sprite.setPosition(this.state.p2.x, this.state.p2.y);
        node.lastpos.lastDir = 0;
      }
      if (node.player.pnum === 1) {
        node.paddle.sprite.setPosition(this.state.p1.x, this.state.p1.y);
        node.lastpos.lastDir = 0;
      }
    }
  },

  /**
   * @method reposEntities
   * @private
   */
  reposEntities: function reposEntities() {
    var node = this.balls.head;

    this.reposPaddles(this.paddles);
    this.reposPaddles(this.fauxs);

    if (!!node) {
      node.ball.sprite.setPosition(this.state.ball.x, this.state.ball.y);
      node.velocity.vel.y = 0;
      node.velocity.vel.x = 0;
    }
  },

  /**
   * @syncPaddles
   * @private
   */
  syncPaddles: function syncPaddles(nl, evt) {

    for (var node = nl.head; node; node = node.next) {

      if (sjs.isobj(evt.source.p2) && node.player.pnum === 2) {
        sjs.loggr.debug("server says: P2 got SYNC'ED !!!");
        this.syncOnePaddle(node, evt.source.p2);
      }

      if (sjs.isobj(evt.source.p1) && node.player.pnum === 1) {
        sjs.loggr.debug("server says: P1 got SYNC'ED !!!");
        this.syncOnePaddle(node, evt.source.p1);
      }
    }
  },

  /**
   * @method syncOnePaddle
   * @private
   */
  syncOnePaddle: function syncOnePaddle(node, c) {
    var dir = 0;
    node.paddle.sprite.setPosition(c.x, c.y);
    if (c.pv > 0) {
      dir = 1;
    }
    if (c.pv < 0) {
      dir = -1;
    }
    node.lastpos.lastDir = dir;
  }
}, {

  /**
   * @memberof module:s/net~Net
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.NetPlay
});

/** @alias module:s/net */
var xbox = /** @lends xbox# */{
  /**
   * @property {Net} Net
   */
  Net: Net
};

sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF