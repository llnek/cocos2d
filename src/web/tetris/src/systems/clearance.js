// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define("zotohlab/p/s/clearance",

       ['zotohlab/p/s/priorities',
         'zotohlab/p/s/utils',
         'zotohlab/p/gnodes',
       'cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    RowClearance = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state = options;
      },

      removeFromEngine: function(engine) {
        this.arena=null;
      },

      addToEngine: function(engine) {
        this.arena= engine.getNodeList(gnodes.ArenaNode);
      },

      update: function(dt) {
        var node = this.arena.head;
        if (this.state.running &&
           !!node) {
          var ps= node.pauser;
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

      clearFilled: function(node) {
        var score= node.flines.lines.length;

        R.forEach(function(z) {
          this.clearOneRow(node,z);
          this.resetOneRow(node,z);
        }.bind(this),
        node.flines.lines);

        this.shiftDownLines(node);
        sh.fireEvent('/game/hud/score/update', { score: score * 50 });
      },

      //dispose and get rid of blocks which are marked to be cleared
      clearOneRow: function(node, r) {
        var row= node.blocks.grid[r],
        c;
        for (c=0; c < row.length; ++c) {
          if (row[c]) {
            row[c].dispose();
            row[c]=undef;
          }
        }
      },

      //clear collision mark
      resetOneRow: function(node, r) {
        var row= node.collision.tiles[r],
        c;
        for (c=0; c < row.length; ++c) {
          row[c]= r===0 ? 1 : 0;
        }
        row[0]=1;
        row[row.length-1]=1;
      },

      shiftDownLines: function(node) {
        var top= utils.topLine(node),
        r,
        f, e, d;

        while (true) {
          f= this.findFirstDirty(node);
          // no lines are touched
          if (f===0) { return; }
          e= this.findLastEmpty(node);
          if (e > f) { return; }
          d=e+1;
          for (r=d; r < top; ++r) {
            this.copyLine(node,r,e);
            ++e;
          }
        }
      },

      findFirstDirty: function(node) {
        var t = utils.topLine(node),// - 1,
        r;

        for (r = t; r > 0; --r) {
          if (!this.isEmptyRow(node,r)) { return r; }
        }

        return 0;
      },

      findLastEmpty: function(node) {
        var t = utils.topLine(node),
        r;

        for (r=1; r < t; ++r) {
          if (this.isEmptyRow(node,r)) { return r; }
        }

        return 0;
      },

      isEmptyRow: function(node, r) {
        var row= node.collision.tiles[r],
        len= row.length-1,
        c;

        if (r===0) { return false; }

        for (c=1; c < len; ++c) {
          if (row[c] !== 0) { return false; }
        }
        return true;
      },

      copyLine: function(node, from, to) {
        var line_f = node.collision.tiles[from],
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

    RowClearance.Priority= pss.Clear;
    return RowClearance;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

