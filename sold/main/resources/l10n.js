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
 * @module p/l10n
 */

import sh from 'zotohlab/asx/asterix';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
undef;

/** @alias module:p/l10n */
const xbox = sjs.merge(xcfg.l10nTable, {

  "en" : {
  }

});

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

