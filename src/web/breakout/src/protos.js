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
 * @requires zotohlab/asx/online
 * @requires zotohlab/asx/msgbox
 * @requires zotohlab/asx/ynbox
 * @requires zotohlab/asterix
 * @requires zotohlab/p/splash
 * @requires zotohlab/p/mmenu
 * @requires zotohlab/p/arena
 * @module zotohlab/p/protodefs
 */
define("zotohlab/p/protodefs",

       ['zotohlab/asx/online',
        'zotohlab/asx/msgbox',
        'zotohlab/asx/ynbox',
        'zotohlab/asterix',
        'zotohlab/p/splash',
        'zotohlab/p/mmenu',
        'zotohlab/p/arena'],

  function (online, msgbox, ynbox,
            sh, splash, mmenu, arena) { "use strict";

    let ps= [online, splash, mmenu, msgbox, ynbox, arena],
    protos= sh.protos,
    sjs= sh.skarojs,
    /** @alias module:zotohlab/p/protodefs */
    exports=protos,
    R = sjs.ramda,
    undef;

    R.forEach((obj) => {
      protos[obj.rtti]= obj;
    }, ps);

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

