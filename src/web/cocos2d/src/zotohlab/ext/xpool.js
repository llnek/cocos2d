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

define("zotohlab/asx/xpool", ['cherimoia/skarojs',
                              'zotohlab/asterix'],
  function (sjs, sh) { "use strict";

    //////////////////////////////////////////////////////////////////////////////
    var R= sjs.ramda,
    undef,
    XEntityPool = sjs.Class.xtends({

      checkEntity: function(ent) {
        if (ent instanceof this.entType) {
          return true;
        }
        throw new Error("Cannot add type : " + ent.rtti() + " into pool.  Wrong type.");
      },

      drain: function() {
        this.curSize = 0;
        this.pool = [];
      },

      get: function() {
        var rc= null;
        if (this.curSize > 0) {
          rc = this.pool.pop();
          --this.curSize;
          sjs.loggr.debug('getting object "' + rc.rtti() + '" from pool: oid = ' + rc.pid() );
        }
        return rc;
      },

      add: function(ent) {
        if (this.checkEntity(ent) && this.curSize < this.maxSize) {
          sjs.loggr.debug('putting object "' + ent.rtti() + '" into pool: oid = ' + ent.pid() );
          this.pool.push(ent);
          ent.deflate();
          ++this.curSize;
          return true;
        } else {
          return false;
        }
      },


      ctor: function(options) {
        this.options = options || {};
        this.maxSize = this.options.maxSize || 1000;
        this.entType = this.options.entityProto;
        this.maxSize= 1000;
        this.curSize= 0;
        this.pool= [];
      }

    }),
    XPool = sjs.class.xtends({

      preSet: function(ctor, count) {
        var olen = this.pool.length,
        sz = count || 48,
        n, rc;

        for (n=0; n < sz; ++n) {
          rc= ctor(this.pool);
          if (!!rc) {
            this.pool.push(rc);
          }
        }
      },

      select: function(filter) {
        var rc, n;
        for (n=0; n < this.pool.length; ++n) {
          rc = filter(this.pool[n]);
          if (!!rc) {
            return this.pool[n];
          }
        }
      },

      get: function() {
        for (var n=0; n < this.pool.length; ++n) {
          if (!this.pool[n].status) {
            return this.pool[n];
          }
        }
        return null;
      },

      actives: function() {
        var c=0;
        for (var n=0; n < this.pool.length; ++n) {
          if (this.pool[n].status) {
            ++c;
          }
        }
        return c;
      },

      size: function() { return this.pool.length; },

      iter: function(func, target) {
        target = target || this;
        for (var n=0; n < this.pool.length; ++n) {
          func.call(target, this.pool[n]);
        }
      },

      reset: function() {
        R.forEach(function(z) {
          z.deflate();
        }, this.pool);
      },

      ctor: function() {
        this.pool = [];
      }

    });

    return XPool;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

