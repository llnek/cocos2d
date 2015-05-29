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
 * @requires zotohlab/p/elements
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/gnodes
 */
define('zotohlab/p/gnodes',

       ['zotohlab/p/elements',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (cobjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/gnodes */
    let exports={},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    ast= {};

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class CannonCtrlNode
     */
    CannonCtrlNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~CannonCtrlNode
       * @property {Looper} looper
       */
      looper    : cobjs.Looper,
      /**
       * @memberof module:zotohlab/p/gnodes~CannonCtrlNode
       * @property {Cannon} cannon
       */
      cannon    : cobjs.Cannon,
      /**
       * @memberof module:zotohlab/p/gnodes~CannonCtrlNode
       * @property {Ship} ship
       */
      ship      : cobjs.Ship
    });
    /**
     * @property {CannonCtrlNode} CannonCtrlNode
     */
    exports.CannonCtrlNode = CannonCtrlNode;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class ShipMotionNode
     */
    ShipMotionNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~ShipMotionNode
       * @property {Velocity} velocity
       */
      velocity    : cobjs.Velocity,
      /**
      * @memberof module:zotohlab/p/gnodes~ShipMotionNode
      * @property {Rotation} rotation
      */
      rotation    : cobjs.Rotation,
      /**
      * @memberof module:zotohlab/p/gnodes~ShipMotionNode
      * @property {Thrust} thrust
      */
      thrust      : cobjs.Thrust,
      /**
      * @memberof module:zotohlab/p/gnodes~ShipMotionNode
      * @property {Motion} motion
      */
      motion      : cobjs.Motion,
      /**
      * @memberof module:zotohlab/p/gnodes~ShipMotionNode
      * @property {Ship} ship
      */
      ship        : cobjs.Ship
    });
    /**
     * @property {ShipMotionNode} ShipMotionNode
     */
    exports.ShipMotionNode = ShipMotionNode;


    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

