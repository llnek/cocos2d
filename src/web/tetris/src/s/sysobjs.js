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
 * @requires nodes/cobjs
 * @requires nodes/gnodes
 * @requires s/utils
 * @requires s/factory
 * @requires s/clearance
 * @requires s/generator
 * @requires s/motion
 * @requires s/movement
 * @requires s/rendering
 * @requires s/resolution
 * @requires s/supervisor
 * @module s/sysobjs
 */

import sjs from 'cherimoia/skaro';
import cobjs from 'nodes/cobjs';
import gnodes from 'nodes/gnodes';
import utils from 's/utils';
import f from 's/factory';
import c from 's/clearance';
import g from 's/generator';
import mo from 's/motion';
import mv from 's/movement';
import rd from 's/rendering';
import rs from 's/resolution';
import v from 's/supervisor';

/** @alias module:s/sysobjs */
const xbox= /** @lends xbox# */{

  /**
   * @property {Factory} EntityFactory
   */
  Factory   : f.EntityFactory,
  /**
   * @property {RowClearance} RowClearance
   */
  RowClearance    : c.RowClearance,
  /**
   * @property {Generator} Generator
   */
  Generator       : g.ShapeGenerator,
  /**
   * @property {MotionControl} MotionControl
   */
  MotionControl   : mo.MotionCtrlSystem,
  /**
   * @property {Movements} Movements
   */
  Movements       : mv.MovementSystem,
  /**
   * @property {Rendering} Rendering
   */
  Rendering       : rd.RenderSystem,
  /**
   * @property {Resolution} Resolution
   */
  Resolution      : rs.ResolutionSystem,
  /**
   * @property {Supervisor} Supervisor
   */
  Supervisor      : v.GameSupervisor
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

