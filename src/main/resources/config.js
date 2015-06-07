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

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires zotohlab/asx/cfg
 * @module p/config
 */

import sh from 'zotohlab/asx/asterix';
import xcfg from 'zotohlab/asx/cfg';

let sjs= sh.skarojs;

/** @alias module:p/config */
const xbox = sjs.merge( xcfg, {

  appKey: '@@UUID@@',

  appid: '',
  color: '',

  csts: {
  },

  game: {
    sd: {width:320, height:480 }
  },

  assets: {
    tiles: {
    },
    images: {
    },
    sounds: {
    },
    fonts: {
    }
  },

  levels: {
    "1" : {
      tiles: {
      },
      images: {
      },
      sprites: {
      },
      cfg {
      }
    }
  }

});

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

