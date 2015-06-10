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
 * @requires s/utils
 * @requires s/supervisor
 * @requires s/motion
 * @requires s/movealiens
 * @requires s/movebombs
 * @requires s/movemissiles
 * @requires s/moveship
 * @requires s/cannon
 * @requires s/collision
 * @requires s/resolution
 * @module s/sysobjs
 */

import sjs from 'cherimoia/skaro';
import f from 's/factory';
import u from 's/utils';
import v from 's/supervisor';
import mo from 's/motion';
import aliens from 's/movealiens';
import bombs from 's/movebombs';
import mi from 's/movemissiles';
import ship from 's/moveship';
import cn from 's/cannon';
import co from 's/collision';
import rs from 's/resolution';


/** @alias module:s/sysobjs */
const xbox = /** @lends xbox# */{

  /**
   * @property {EntityFactory} EntityFactory
   */
  Factory       : f.EntityFactory,
  /**
   * @property {SystemUtils} SystemUtils
   */
  SystemUtils         : u,
  /**
   * @property {Supervisor} Supervisor
   */
  Supervisor          : v.GameSupervisor,
  /**
   * @property {Motions} Motions
   */
  Motions             : mo.MotionCtrlSystem,
  /**
   * @property {MovementAliens} MovementAliens
   */
  MovementAliens      : aliens.MovementAliens,
  /**
   * @property {MovementBombs} MovementBombs
   */
  MovementBombs       : bombs.MovementBombs,
  /**
   * @property {MovementMissiles} MovementMissiles
   */
  MovementMissiles    : mi.MovementMissiles,
  /**
   * @property {MovemenyShip} MovemenyShip
   */
  MovementShip        : ship.MovementShip,
  /**
   * @property {CannonControl} CannonControl
   */
  CannonControl       : cn.CannonControl,
  /**
   * @property {CollisionSystem} CollisionSystem
   */
  CollisionSystem     : co.CollisionSystem,
  /**
   * @property {Resolution} Resolution
   */
  Resolution          : rs.Resolution
};




sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

