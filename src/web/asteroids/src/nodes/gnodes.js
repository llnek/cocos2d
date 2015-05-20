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
 * @requires zotohlab/p/components
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/gnodes
 */
define('zotohlab/p/gnodes',

       ['zotohlab/p/components',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (cobjs, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/gnodes */
    var exports={},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    ast= {};

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class CannonCtrlNode
     */
    exports.CannonCtrlNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~CannonCtrlNode
       * @property {Looper} looper
       * @static
       */
      looper    : cobjs.Looper,
      cannon    : cobjs.Cannon,
      ship      : cobjs.Ship
    });

    //////////////////////////////////////////////////////////////////////////////
    ast.ShipMotionNode = sh.Ashley.nodeDef({
      velocity    : cobjs.Velocity,
      rotation    : cobjs.Rotation,
      thrust      : cobjs.Thrust,
      motion      : cobjs.Motion,
      ship        : cobjs.Ship
    });

    return ast;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

