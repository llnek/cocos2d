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
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @module zotohlab/asx/xpool
 */
define("zotohlab/asx/xpool",

       ['cherimoia/skarojs',
        'zotohlab/asterix'],

  function (sjs, sh) { "use strict";

    //////////////////////////////////////////////////////////////////////////////
    /** @alias module:zotohlab/asx/xpool */
    var exports = {},
    R= sjs.ramda,
    undef,

    XEntityPool = sjs.mixes({

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

    /**
     * @class XPool
     */
    XPool = sjs.mixes({

      /**
       * Pre-populate a bunch of objects in the pool.
       *
       * @memberof module:zotohlab/asx/xpool~XPool
       * @method preSet
       * @param {Function} ctor object constructor
       * @param {Number} count
       */
      preSet: function(ctor, count) {
        var sz = count || 48,
        n, rc;

        for (n=0; n < sz; ++n) {
          rc= ctor(this.pool);
          if (!!rc) {
            this.pool.push(rc);
          }
        }
      },

      /**
       * Find an object by applying this filter.
       *
       * @memberof module:zotohlab/asx/xpool~XPool
       * @method select
       * @param {Function} filter
       * @return {Object} the selected one
       */
      select: function(filter) {
        var rc, n;
        for (n=0; n < this.pool.length; ++n) {
          rc = filter(this.pool[n]);
          if (!!rc) {
            return this.pool[n];
          }
        }
      },

      /**
       * Get an object from the pool and set it's status to true.
       *
       * @memberof module:zotohlab/asx/xpool~XPool
       * @method getAndSet
       * @return {Object}
       */
      getAndSet: function() {
        var rc= this.get();
        if (!!rc) {
          rc.status=true;
        }
        return rc;
      },

      /**
       * Get an object from the pool.  More like a peek.
       *
       * @memberof module:zotohlab/asx/xpool~XPool
       * @method get
       * @return {Object}
       */
      get: function() {
        for (var n=0; n < this.pool.length; ++n) {
          if (!this.pool[n].status) {
            return this.pool[n];
          }
        }
        return null;
      },

      /**
       * Get the count of active objects.
       *
       * @memberof module:zotohlab/asx/xpool~XPool
       * @method actives
       * @return {Number}
       */
      actives: function() {
        var c=0;
        for (var n=0; n < this.pool.length; ++n) {
          if (this.pool[n].status) {
            ++c;
          }
        }
        return c;
      },

      /**
       * Get the size of the pool.
       *
       * @memberof module:zotohlab/asx/xpool~XPool
       * @method size
       * @return {Number}
       */
      size: function() { return this.pool.length; },

      /**
       * Like map, but with no output.
       *
       * @memberof module:zotohlab/asx/xpool~XPool
       * @method iter
       * @param {Function} func
       * @param {Object} target if null, use the pool
       */
      iter: function(func, target) {
        target = target || this;
        for (var n=0; n < this.pool.length; ++n) {
          func.call(target, this.pool[n]);
        }
      },

      /**
       * Hibernate (status off) all objects in the pool.
       *
       * @memberof module:zotohlab/asx/xpool~XPool
       * @method deflate
       */
      reset: function() {
        R.forEach(function(z) {
          z.deflate();
        }, this.pool);
      },


      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/xpool~XPool
       * @method ctor
       */
      ctor: function() {
        this.pool = [];
      }

    });

    /**
     * @property {XPool.Class} XPool
     * @static
     * @final
     */
    exports.XPool = XPool;

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

