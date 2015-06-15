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
 * @requires s/factory
 * @requires s/stager
 * @requires s/motion
 * @requires s/aliens
 * @requires s/move
 * @requires s/collide
 * @requires s/resolve
 * @module s/sysobjs
 */

import sh from 'zotohlab/asx/asterix';
import f from 's/factory';
import v from 's/stager';
import mo from 's/motion';
import a from 's/aliens';
import mv from 's/move';
import co from 's/collide';
import rs from 's/resolve';


const sjs = sh.skarojs,
/** @alias module:s/sysobjs */
xbox = /** @lends xbox# */{

  /**
   * @property {Array} systems
   */
  systems : [ v.Stager, mo.Motions, a.Aliens, mv.Move,
  co.Collide, rs.Resolve ],

  /**
   * @method entityFactory
   * @param {Ash.Engine}
   * @return {EntityFactory}
   */
  entityFactory(engine, options) {
    sh.factory = new f.EntityFactory(engine, options);
    return sh.factory;
  }
};




sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

