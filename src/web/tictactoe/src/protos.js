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
 * @requires zotohlab/asx/onlineplay
 * @requires zotohlab/asx/msgbox
 * @requires zotohlab/asx/ynbox
 * @requires zotohlab/p/splash
 * @requires zotohlab/p/mmenu
 * @requires zotohlab/p/arena
 * @module zotohlab/p/protodefs
 */
define("zotohlab/p/protodefs",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/onlineplay',
        'zotohlab/asx/msgbox',
        'zotohlab/asx/ynbox',
        'zotohlab/p/splash',
        'zotohlab/p/mmenu',
        'zotohlab/p/arena'],

  function (sjs, sh, online,
            msgbox, ynbox, splash, mmenu, arena) { "use strict";

    var ps= [online, splash, mmenu, msgbox, ynbox, arena],
    /** @alias module:zotohlab/p/protodefs */
    exports = {},
    protos= sh.protos,
    xcfg = sh.xcfg,
    R = sjs.ramda,
    undef;

    R.forEach(function(obj) {
      protos[obj.rtti] = obj.ctor;
    }, ps);

    exports= protos;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

