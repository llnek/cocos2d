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
 * @requires s/utils
 * @requires s/factory
 * @requires s/stager
 * @requires s/aliens
 * @requires s/motion
 * @requires s/move
 * @requires s/collide
 * @requires s/resolve
 * @requires s/render
 * @module s/sysobjs
 */

import sh from 'zotohlab/asx/asterix';
import u from 's/utils';
import f from 's/factory';
import v from 's/stager';
import lm from 's/aliens';
import mo from 's/motion';
import ms from 's/move';
import co from 's/collide';
import rs from 's/resolve';
import rd from 's/render';

const sjs=sh.skarojs,
/** @alias module:s/sysobjs */
xbox = /** @lends xbox# */{

  /**
   * @property {Array} systems
   */
  systems: [ v.Stager, lm.Aliens, mo.Motions, ms.MoveXXX,
  co.Collide, rs.Resolve, rd.Render],

  /**
   * @method entityFactory
   * @param {Ash.Engine}
   * @return {EntityFactory}
   */
  entityFactory(engine) {
    sh.factory = new f.EntityFactory(engine);
    return sh.factory;
  }
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

