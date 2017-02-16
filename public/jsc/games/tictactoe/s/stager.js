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
              * @requires s/utils
              * @requires n/gnodes
              * @module s/stager
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _odin = require('zotohlab/asx/odin');

var _odin2 = _interopRequireDefault(_odin);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////////////////////////////////////////////////////////////////
var evts = _odin2.default.Events,
    sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
/** * @class Stager */
Stager = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/stager~Stager
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
    this.inited = false;
  },

  /**
   * @memberof module:s/stager~Stager
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.board = null;
  },

  /**
   * @memberof module:s/stager~Stager
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    engine.addEntity(_asterix2.default.factory.reifyBoard(_asterix2.default.main, this.state));
    this.board = engine.getNodeList(_gnodes2.default.BoardNode);
  },

  /**
   * @memberof module:s/stager~Stager
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    if (_ccsx2.default.isTransitioning()) {
      return false;
    }
    var node = this.board.head;
    if (this.state.running && !!node) {
      if (!this.inited) {
        this.onceOnly(node, dt);
        this.inited = true;
      } else {
        this.doit(node, dt);
      }
    }
  },

  /**
   * @method showGrid
   * @private
   */
  showGrid: function showGrid(node) {
    var mgs = _utils2.default.mapGridPos(),
        cs = node.view.cells,
        pos = 0,
        sp = void 0;

    R.forEach(function (mp) {
      sp = _ccsx2.default.createSprite('z.png');
      sp.setPosition(_ccsx2.default.vboxMID(mp));
      _asterix2.default.main.addAtlasItem('game-pics', sp);
      cs[pos++] = [sp, sp.getPositionX(), sp.getPositionY(), csts.CV_Z];
    }, mgs);
  },


  /**
   * @method onceOnly
   * @private
   */
  onceOnly: function onceOnly(node, dt) {

    this.showGrid(node);

    if (sjs.isobj(this.state.wsock)) {
      // online play
      sjs.loggr.debug("reply to server: session started ok");
      this.state.wsock.send({
        type: evts.MSG_SESSION,
        code: evts.STARTED
      });
      this.state.actor = 0;
    } else {
      //randomly pick a player to start the game.
      var pnum = sjs.randSign() > 0 ? 1 : 2;
      this.state.actor = pnum;
      if (this.state.players[pnum].category === csts.HUMAN) {
        _asterix2.default.fire('/hud/timer/show');
      } else if (this.state.players[pnum].category === csts.BOT) {}
    }

    _asterix2.default.main.pkInput();
  },

  /**
   * @method doit
   * @private
   */
  doit: function doit(node, dt) {

    var active = this.state.running,
        actor = this.state.actor;

    if (!active) {
      actor = this.state.lastWinner;
    }

    _asterix2.default.fire('/hud/update', {
      running: active,
      pnum: actor
    });
  }
}, {
  /**
   * @memberof module:s/stager~Stager
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.PreUpdate
});

/** @alias module:s/stager */
var xbox = {
  /**
   * @property {Stager} Stager
   */
  Stager: Stager
};
sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF