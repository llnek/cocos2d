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
 * @requires zotohlab/asx/online
 * @requires zotohlab/asx/msgbox
 * @requires zotohlab/asx/ynbox
 * @requires zotohlab/asx/asterix
 * @requires p/splash
 * @requires p/mmenu
 * @requires p/game
 * @module p/protos
 */

import online from 'zotohlab/asx/online';
import msgbox from 'zotohlab/asx/msgbox';
import ynbox from 'zotohlab/asx/ynbox';
import sh from 'zotohlab/asx/asterix';
import splash from 'p/splash';
import mmenu from 'p/mmenu';
import arena from 'p/game';

let ps= [online, splash, mmenu, msgbox, ynbox, arena],
protos= sh.protos,
sjs= sh.skarojs,
R = sjs.ramda,
undef;

R.forEach((obj) => {
  protos[obj.rtti] = obj;
}, ps);

/** @alias module:p/protos */
const xbox = protos;

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

