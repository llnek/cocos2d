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

/**
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/clearance
 */
define("zotohlab/p/s/clearance",

       ['zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (utils, gnodes, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/clearance */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @class RowClearance
     */
    RowClearance = sh.Ashley.sysDef({
      /**
       * @memberof module:zotohlab/p/s/clearance~RowClearance
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state = options;
      },
      /**
       * @memberof module:zotohlab/p/s/clearance~RowClearance
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.arena=null;
      },
      /**
       * @memberof module:zotohlab/p/s/clearance~RowClearance
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.arena= engine.getNodeList(gnodes.ArenaNode);
      },
      /**
       * @memberof module:zotohlab/p/s/clearance~RowClearance
       * @method update
       * @return {Number}
       */
      update(dt) {
        let node = this.arena.head,
        ps;

        if (this.state.running &&
           !!node) {
          ps= node.pauser;
          if (ps.pauseToClear) {
            if (ccsx.timerDone(ps.timer)) {
              this.clearFilled(node);
              ps.timer=ccsx.releaseTimer(ps.timer);
              ps.pauseToClear=false;
            }
            //stop downstream processing
            return false;
          }
        }
      },
      /**
       * @method clearFilled
       * @private
       */
      clearFilled(node) {
        const score= node.flines.lines.length;

        R.forEach((z) => {
          this.clearOneRow(node,z);
          this.resetOneRow(node,z);
        },
        node.flines.lines);

        this.shiftDownLines(node);
        sh.fire('/hud/score/update', { score: score * 50 });
      },
      /**
       * Dispose and get rid of blocks which are marked to be cleared
       * @method clearOneRow
       * @private
       */
      clearOneRow(node, r) {
        const row= node.blocks.grid[r];

        for (let c=0; c < row.length; ++c) {
          if (row[c]) {
            row[c].dispose();
            row[c]=undef;
          }
        }
      },
      /**
       * Clear collision mark
       * @method resetOneRow
       * @private
       */
      resetOneRow(node, r) {
        const row= node.collision.tiles[r];

        for (let c=0; c < row.length; ++c) {
          row[c]= r===0 ? 1 : 0;
        }
        row[0]=1;
        row[row.length-1]=1;
      },
      /**
       * @method shiftDownLines
       * @private
       */
      shiftDownLines(node) {
        let top= utils.topLine(node),
        f, e, d;

        while (true) {
          f= this.findFirstDirty(node);
          // no lines are touched
          if (f===0) { return; }
          e= this.findLastEmpty(node);
          if (e > f) { return; }
          d=e+1;
          for (let r=d; r < top; ++r) {
            this.copyLine(node,r,e);
            ++e;
          }
        }
      },
      /**
       * @method findFirstDirty
       * @private
       */
      findFirstDirty(node) {
        const t = utils.topLine(node);// - 1,

        for (let r = t; r > 0; --r) {
          if (!this.isEmptyRow(node,r)) { return r; }
        }

        return 0;
      },
      /**
       * @method findLastEmpty
       * @private
       */
      findLastEmpty(node) {
        const t = utils.topLine(node);

        for (let r=1; r < t; ++r) {
          if (this.isEmptyRow(node,r)) { return r; }
        }

        return 0;
      },
      /**
       * @method isEmptyRow
       * @private
       */
      isEmptyRow(node, r) {
        const row= node.collision.tiles[r],
        len= row.length-1;

        if (r===0) { return false; }

        for (let c=1; c < len; ++c) {
          if (row[c] !== 0) { return false; }
        }
        return true;
      },
      /**
       * @method copyLine
       * @private
       */
      copyLine(node, from, to) {
        let line_f = node.collision.tiles[from],
        line_t = node.collision.tiles[to],
        c, pos;

        for (c=0; c < line_f.length; ++c) {
          line_t[c] = line_f[c];
          line_f[c]= 0;
        }
        line_f[0]=1;
        line_f[line_f.length-1]=1;

        // deal with actual shape
        line_f = node.blocks.grid[from];
        line_t = node.blocks.grid[to];

        for (c=0; c < line_f.length; ++c) {
          if (line_f[c]) {
            pos = line_f[c].sprite.getPosition();
            line_f[c].sprite.setPosition(pos.x, pos.y - csts.TILE);
          }
          line_t[c] = line_f[c];
          line_f[c] = undef;
        }
      }

    });

    /**
     * @memberof module:zotohlab/p/s/clearance~RowClearance
     * @property {Number} Priority
     */
    RowClearance.Priority= xcfg.ftypes.Clear;

    exports= RowClearance;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

