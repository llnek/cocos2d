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

