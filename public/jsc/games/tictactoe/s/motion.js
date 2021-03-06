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
              * @requires zotohlab/asx/odin
              * @requires n/gnodes
              * @requires Rx
              * @module s/motion
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _odin = require('zotohlab/asx/odin');

var _odin2 = _interopRequireDefault(_odin);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

var _Rx = require('Rx');

var _Rx2 = _interopRequireDefault(_Rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////////////////////////////////////////////////////////////////
var evts = _odin2.default.Events,
    sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
/** * @class Motions */
Motions = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/motion~Motions
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
    this.inited = false;
  },

  /**
   * @memberof module:s/motion~Motions
   * @method removefromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.netplay = null;
    this.stream = null;
    this.evQ = null;
    this.gui = null;
  },

  /**
   * @memberof module:s/motion~Motions
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.netplay = engine.getNodeList(_gnodes2.default.NetPlayNode);
    this.gui = engine.getNodeList(_gnodes2.default.GUINode);
    this.evQ = [];
  },

  /**
   * @method onceOnly
   * @private
   */
  onceOnly: function onceOnly() {
    var _this = this;

    var ws = this.state.wsock,
        t = void 0,
        m = void 0,
        s = void 0;
    if (sjs.isobj(ws)) {
      ws.cancelAll();
      s = _Rx2.default.Observable.create(function (obj) {
        ws.listenAll(function (msg) {
          obj.onNext({ group: 'net',
            event: msg });
        });
      });
    } else {
      s = _Rx2.default.Observable.never();
    }
    t = _Rx2.default.Observable.create(function (obj) {
      _asterix2.default.main.signal('/touch/one/end', function (msg) {
        return obj.onNext(msg);
      });
    });
    m = _Rx2.default.Observable.create(function (obj) {
      _asterix2.default.main.signal('/mouse/up', function (msg) {
        return obj.onNext(msg);
      });
    });
    this.stream = _Rx2.default.Observable.merge(m, t, s);
    this.stream.subscribe(function (msg) {
      if (!!_this.evQ) {
        _this.evQ.push(msg);
      }
    });
  },

  /**
   * @memberof module:s/motion~Motions
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var evt = this.evQ.length > 0 ? this.evQ.shift() : undef,
        n = this.netplay.head,
        g = this.gui.head;

    if (!this.inited) {
      this.onceOnly();
      this.inited = true;
    } else if (!!evt) {
      if (evt.group === 'net') {
        if (!!n) {
          this.onnet(n, evt.event);
        }
      } else {
        if (!!g) {
          this.ongui(g, evt);
        }
      }
    }
  },

  /**
   * @method onnet
   * @private
   */
  onnet: function onnet(node, evt) {
    switch (evt.type) {
      case evts.MSG_NETWORK:
        this.onnetw(node, evt);
        break;
      case evts.MSG_SESSION:
        this.onsess(node, evt);
        break;
    }
  },

  /**
   * @method onnetw
   * @private
   */
  onnetw: function onnetw(node, evt) {
    switch (evt.code) {
      case evts.RESTART:
        sjs.loggr.debug("restarting a new game...");
        _asterix2.default.fire('/net/restart');
        break;
      case evts.STOP:
        if (this.state.running) {
          sjs.loggr.debug("game will stop");
          _asterix2.default.fire('/hud/timer/hide');
          this.onsess(node, evt);
          _asterix2.default.fire('/net/stop', evt);
        }
        break;
    }
  },

  /**
   * @method onsess
   * @private
   */
  onsess: function onsess(node, evt) {
    var cmd = evt.source.cmd,
        snd = void 0,
        pnum = void 0,
        grid = node.grid,
        vs = grid.values;

    if (sjs.isobj(cmd) && sjs.isnum(cmd.cell) && cmd.cell >= 0 && cmd.cell < vs.length) {

      if (this.state.players[1].value === cmd.value) {
        snd = 'x_pick';
      } else {
        snd = 'o_pick';
      }
      vs[cmd.cell] = cmd.value;
      _asterix2.default.sfxPlay(snd);
    }

    pnum = sjs.isnum(evt.source.pnum) ? evt.source.pnum : -1;
    if (pnum === 1 || pnum === 2) {} else {
      return;
    }
    switch (evt.code) {
      case evts.POKE_MOVE:
        sjs.loggr.debug("player " + pnum + ": my turn to move");
        _asterix2.default.fire('/hud/timer/show');
        this.state.actor = pnum;
        break;
      case evts.POKE_WAIT:
        sjs.loggr.debug("player " + pnum + ": my turn to wait");
        _asterix2.default.fire('/hud/timer/hide');
        // toggle color
        this.state.actor = pnum === 1 ? 2 : 1;
        break;
    }
  },

  /**
   * @method ongui
   * @private
   */
  ongui: function ongui(node, evt) {
    if (!this.state.running) {
      return;
    }
    var sel = node.selection,
        map = node.view.gridMap,
        rect = void 0,
        sz = map.length;

    //set the mouse/touch position
    sel.px = evt.loc.x;
    sel.py = evt.loc.y;
    sel.cell = -1;

    if (this.state.actor === 0) {
      return;
    }

    //which cell did he click on?
    for (var n = 0; n < sz; ++n) {
      rect = map[n];
      if (sel.px >= rect.left && sel.px <= rect.right && sel.py >= rect.bottom && sel.py <= rect.top) {
        sel.cell = n;
        break;
      }
    }
  }
}, {
  /**
   * @memberof module:s/motion~Motions
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Motion
});

/** @alias module:s/motion */
var xbox = /** @lends xbox# */{
  /**
   * @property {Motions} Motions
   */
  Motions: Motions
};
sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF