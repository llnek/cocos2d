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
 * @module zotohlab/p/l10n
 */
define("zotohlab/p/l10n",

       ['cherimoia/skarojs',
        'zotohlab/asterix'],

  function (sjs, sh) { "use strict";

    /** @alias module:zotohlab/p/l10n */
    let exports = {},
    xcfg = sh.xcfg,
    undef;

    exports = sjs.merge(xcfg.l10nTable, {

      "en" : {

        "%whosturn" : "{{who}}'s TURN...",
        "%whodraw" : "No one wins!",
        "%whowin" : "{{who}} Wins!",

        "%p2" : "P2",
        "%p1" : "P1"

      }

    });

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

