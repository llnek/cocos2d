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
              * @module zotohlab/asx/pool
              */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _asterix = require("zotohlab/asx/asterix");

var _asterix2 = _interopRequireDefault(_asterix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//////////////////////////////////////////////////////////////////////////////
var sjs = _asterix2.default.skarojs,
    R = sjs.ramda,
    undef = void 0;

var XEntityPool = function (_sjs$ES6Claxx) {
  _inherits(XEntityPool, _sjs$ES6Claxx);

  _createClass(XEntityPool, [{
    key: "checkEntity",
    value: function checkEntity(ent) {
      if (ent instanceof this.entType) {
        return true;
      }
      sjs.tne("Cannot add type : " + ent.rtti() + " into pool.  Wrong type.");
    }
  }, {
    key: "drain",
    value: function drain() {
      this.curSize = 0;
      this.pool = [];
    }
  }, {
    key: "get",
    value: function get() {
      var rc = null;
      if (this.curSize > 0) {
        rc = this.pool.pop();
        --this.curSize;
        sjs.loggr.debug('getting object "' + rc.rtti() + '" from pool: oid = ' + rc.pid());
      }
      return rc;
    }
  }, {
    key: "add",
    value: function add(ent) {
      if (this.checkEntity(ent) && this.curSize < this.maxSize) {
        sjs.loggr.debug('putting object "' + ent.rtti() + '" into pool: oid = ' + ent.pid());
        this.pool.push(ent);
        ent.deflate();
        ++this.curSize;
        return true;
      } else {
        return false;
      }
    }
  }]);

  function XEntityPool(options) {
    _classCallCheck(this, XEntityPool);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(XEntityPool).call(this));

    _this.options = options || {};
    _this.maxSize = _this.options.maxSize || 1000;
    _this.entType = _this.options.entityProto;
    _this.maxSize = 1000;
    _this.curSize = 0;
    _this.pool = [];
    return _this;
  }

  return XEntityPool;
}(sjs.ES6Claxx);

/**
 * @class XPool
 */


var XPool = function (_sjs$ES6Claxx2) {
  _inherits(XPool, _sjs$ES6Claxx2);

  _createClass(XPool, [{
    key: "preSet",

    /**
     * Pre-populate a bunch of objects in the pool.
     * @memberof module:zotohlab/asx/pool~XPool
     * @method preSet
     * @param {Function} ctor object constructor
     * @param {Number} count
     */
    value: function preSet(ctor, count) {
      var sz = count || 48,
          rc = void 0;

      for (var n = 0; n < sz; ++n) {
        rc = ctor(this.pool);
        if (!!rc) {
          this.pool.push(rc);
        }
      }
    }

    /**
     * Find an object by applying this filter.
     * @memberof module:zotohlab/asx/pool~XPool
     * @method select
     * @param {Function} filter
     * @return {Object} the selected one
     */

  }, {
    key: "select",
    value: function select(filter) {
      var rc = void 0;
      for (var n = 0; n < this.pool.length; ++n) {
        rc = filter(this.pool[n]);
        if (!!rc) {
          return this.pool[n];
        }
      }
    }

    /**
     * Get an object from the pool and set it's status to true.
     * @memberof module:zotohlab/asx/pool~XPool
     * @method getAndSet
     * @return {Object}
     */

  }, {
    key: "getAndSet",
    value: function getAndSet() {
      var rc = this.get();
      if (!!rc) {
        rc.status = true;
      }
      return rc;
    }

    /**
     * Get an object from the pool.  More like a peek.
     * @memberof module:zotohlab/asx/pool~XPool
     * @method get
     * @return {Object}
     */

  }, {
    key: "get",
    value: function get() {
      for (var n = 0; n < this.pool.length; ++n) {
        if (!this.pool[n].status) {
          return this.pool[n];
        }
      }
      return null;
    }

    /**
     * Get the count of active objects.
     * @memberof module:zotohlab/asx/pool~XPool
     * @method actives
     * @return {Number}
     */

  }, {
    key: "actives",
    value: function actives() {
      var c = 0;
      for (var n = 0; n < this.pool.length; ++n) {
        if (this.pool[n].status) {
          ++c;
        }
      }
      return c;
    }

    /**
     * Get the size of the pool.
     * @memberof module:zotohlab/asx/pool~XPool
     * @method size
     * @return {Number}
     */

  }, {
    key: "size",
    value: function size() {
      return this.pool.length;
    }

    /**
     * Like map, but with no output.
     * @memberof module:zotohlab/asx/pool~XPool
     * @method iter
     * @param {Function} func
     * @param {Object} target if null, use the pool
     */

  }, {
    key: "iter",
    value: function iter(func, target) {
      target = target || this;
      for (var n = 0; n < this.pool.length; ++n) {
        func.call(target, this.pool[n]);
      }
    }

    /**
     * Hibernate (status off) all objects in the pool.
     * @memberof module:zotohlab/asx/pool~XPool
     * @method deflate
     */

  }, {
    key: "reset",
    value: function reset() {
      R.forEach(function (z) {
        z.deflate();
      }, this.pool);
    }

    /**
     * @memberof module:zotohlab/asx/pool~XPool
     * @method constructor
     */

  }]);

  function XPool() {
    _classCallCheck(this, XPool);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(XPool).call(this));

    _this2.pool = [];
    return _this2;
  }

  return XPool;
}(sjs.ES6Claxx);

/** @alias module:zotohlab/asx/pool */


var xbox = {
  /**
   * @method reify
   * @return {XPool}
   */

  reify: function reify() {
    return new XPool();
  },

  /**
   * @property {XPool} XPool
   */
  XPool: XPool
};

sjs.merge(exports, xbox);

return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF