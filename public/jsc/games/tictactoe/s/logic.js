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
              * @module s/logic
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _odin = require('zotohlab/asx/odin');

var _odin2 = _interopRequireDefault(_odin);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////////////////////////////////////////////////////////////////
var evts = _odin2.default.Events,
    sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
/** * @class Logic */
Logic = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/logic~Logic
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
    this.botTimer = null;
  },

  /**
   * @memberof module:s/logic~Logic
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.board = null;
  },

  /**
   * @memberof module:s/logic~Logic
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.board = engine.getNodeList(_gnodes2.default.BoardNode);
  },

  /**
   * @memberof module:s/logic~Logic
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.board.head;
    if (this.state.running && !!node) {
      this.doit(node, dt);
    }
  },

  /**
   * @method doit
   * @private
   */
  doit: function doit(node, evt) {
    var ps = this.state.players,
        cp = ps[this.state.actor],
        board = node.board,
        grid = node.grid,
        bot = node.robot,
        sel = node.selection;

    //handle online play
    if (sjs.isobj(this.state.wsock)) {
      //if the mouse click is from the valid user, handle it
      if (!!cp && this.state.pnum === cp.pnum) {
        this.enqueue(sel.cell, cp.value, grid);
      }
    } else if (cp.category === csts.BOT) {
      // for the bot, create some small delay...
      if (!!this.botTimer) {
        if (_ccsx2.default.timerDone(this.botTimer)) {
          var bd = bot.algo.getGameBoard(),
              rc = void 0;
          bd.syncState(grid.values, this.state.players[this.state.actor].value);
          rc = bd.getFirstMove();
          if (!sjs.echt(rc)) {
            rc = bot.algo.eval();
          }
          this.enqueue(rc, cp.value, grid);
          this.botTimer = _ccsx2.default.undoTimer(this.botTimer);
        }
      } else {
        this.botTimer = _ccsx2.default.createTimer(_asterix2.default.main, 0.6);
      }
    } else if (sel.cell >= 0) {
      //possibly a valid click ? handle it
      this.enqueue(sel.cell, cp.value, grid);
    }

    sel.cell = -1;
  },

  /**
   * @method enqueue
   * @private
   */
  enqueue: function enqueue(pos, value, grid) {

    if (pos >= 0 && pos < grid.values.length && csts.CV_Z === grid.values[pos]) {

      var snd = void 0,
          pnum = void 0;

      _asterix2.default.fire('/hud/timer/hide');

      if (sjs.isobj(this.state.wsock)) {
        this.onEnqueue(grid, this.state.actor, pos);
      } else {
        if (this.state.actor === 1) {
          snd = 'x_pick';
          pnum = 2;
        } else {
          snd = 'o_pick';
          pnum = 1;
        }
        grid.values[pos] = value;
        this.state.actor = pnum;
        _asterix2.default.sfxPlay(snd);
        if (this.state.players[pnum].category === csts.HUMAN) {
          _asterix2.default.fire('/hud/timer/show');
        }
      }
    }
  },

  /**
   * @method onEnqueue
   * @private
   */
  onEnqueue: function onEnqueue(grid, pnum, cell) {
    var src = {
      color: this.state.players[pnum].color,
      value: this.state.players[pnum].value,
      grid: grid.values,
      cell: cell
    },
        snd = pnum === 1 ? 'x_pick' : 'o_pick',
        evt = {
      source: sjs.jsonfy(src),
      type: evts.MSG_SESSION,
      code: evts.PLAY_MOVE
    };
    this.state.wsock.send(evt);
    this.state.actor = 0;
    _asterix2.default.sfxPlay(snd);
  }
}, {
  /**
   * @memberof module:s/logic~Logic
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Logic
});

/** @alias module:s/logic */
var xbox = /** @lends xbox# */{
  /**
   * @property {Logic} Logic
   */
  Logic: Logic
};
sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF