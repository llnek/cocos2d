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
 * @requires n/cobjs
 * @requires n/gnodes
 * @requires s/utils
 * @requires s/factory
 * @requires s/clear
 * @requires s/generate
 * @requires s/motion
 * @requires s/move
 * @requires s/resolve
 * @requires s/stager
 * @module s/sysobjs
 */

import sh from 'zotohlab/asx/asterix';
import cobjs from 'n/cobjs';
import gnodes from 'n/gnodes';
import utils from 's/utils';
import f from 's/factory';
import c from 's/clear';
import g from 's/generate';
import mo from 's/motion';
import mv from 's/move';
import rs from 's/resolve';
import v from 's/stager';

const sjs= sh.skarojs,
/** @alias module:s/sysobjs */
xbox= /** @lends xbox# */{
  /**
   * @property {Array} systems
   */
  systems: [ c.Clear, g.Generate, mo.Motions, mv.Move,
    rs.Resolve, v.Stager, utils],
  /**
   * @method entityFactory
   * @param {Ash.Engine}
   * @return {EntityFactory}
   */
  entityFactory(engine) {
    sh.factory= new  f.EntityFactory(engine);
    return sh.factory;
  }
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

