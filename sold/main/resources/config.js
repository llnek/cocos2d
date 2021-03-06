/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright (c) 2013-2016, Kenneth Leung. All rights reserved. */


"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires zotohlab/asx/cfg
 * @module p/config
 */

import sh from 'zotohlab/asx/asterix';
import xcfg from 'zotohlab/asx/cfg';

const sjs= sh.skarojs,
/** @alias module:p/config */
xbox = sjs.merge( xcfg, {

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

