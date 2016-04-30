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
 * @requires s/factory
 * @requires s/supervisor
 * @requires s/motions
 * @requires s/resolve
 * @module s/sysobjs
 */

import fact from 's/factory';
import v from 's/supervisor';
import m from 's/motions';
import res from 's/resolve';

/** @alias module:s/sysobjs */
const xbox = /** @lends xbox# */{

  Factory       : fact.EntityFactory,
  Supervisor    : v.Supervisor,
  Motions       : m.Motions,
  Resolve    : res.Resolve

};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

