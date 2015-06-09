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
 * @requires cherimoia/skaro
 * @requires s/factory
 * @requires s/collision
 * @requires s/networking
 * @requires s/rendering
 * @requires s/resolution
 * @requires s/supervisor
 * @requires s/motion
 * @requires s/movement
 * @module s/sysobjs
 */

import sjs from 'cherimoia/skaro';
import f from 's/factory';
import co from 's/collision';
import net from 's/networking';
import rd from 's/rendering';
import rs from 's/resolution';
import v from 's/supervisor';
import mo from 's/motion';
import mv from 's/movement';


/** @alias module:s/sysobjs */
const xbox= /** @lends xbox# */{

  /**
   * @property {Factory} Factory
   */
  Factory     : f.EntityFactory,
  /**
   * @property {Collisions} Collisions
   */
  Collisions        : co.CollisionSystem,
  /**
   * @property {Networking} Networking
   */
  Networking        : net.NetworkSystem,
  /**
   * @property {Rendering} Rendering
   */
  Rendering         : rd.RenderSystem,
  /**
   * @property {Resolution} Resolution
   */
  Resolution        : rs.Resolution,
  /**
   * @property {Supervisor} Supervisor
   */
  Supervisor        : v.GameSupervisor,
  /**
   * @property {Motions} Motions
   */
  Motions           : mo.MotionCtrlSystem,
  /**
   * @property {Movements} Movements
   */
  Movements         : mv.MovementSystem
};



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

