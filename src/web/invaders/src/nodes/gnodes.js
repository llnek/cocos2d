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

define("zotohlab/p/gnodes", ['zotohlab/p/components',
                            'cherimoia/skarojs',
                            'zotohlab/asterix',
                            'zotohlab/asx/xcfg',
                            'ash-js'],

  function (cobjs, sjs, sh, xcfg, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    ivs= {};

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.AlienMotionNode = Ash.Node.create({
      aliens  : cobjs.AlienSqad,
      looper  : cobjs.Looper
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.CannonCtrlNode = Ash.Node.create({
      looper  : cobjs.Looper,
      cannon  : cobjs.Cannon,
      ship    : cobjs.Ship
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.ShipMotionNode = Ash.Node.create({
      velocity  : cobjs.Velocity,
      motion    : cobjs.Motion,
      ship      : cobjs.Ship
    });

    return ivs;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

