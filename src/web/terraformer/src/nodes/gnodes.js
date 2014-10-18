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
                            'zotohlab/asterix'],

  function (cobjs, sjs, sh) { "use strict";

    var xcfg = sh.xcfg,
    csts = xcfg.csts,
    undef,
    gns= {};

    //////////////////////////////////////////////////////////////////////////////
    //
    gns.ShipMotionNode = sh.Ashley.nodeDef({
      motion : cobjs.Motion,
      ship  : cobjs.Ship
    });

    return gns;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

