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
 * @requires s/utils
 * @requires s/factory
 * @requires s/collision
 * @requires s/missiles
 * @requires s/motion
 * @requires s/moveastros
 * @requires s/movelasers
 * @requires s/movemissiles
 * @requires s/moveship
 * @requires s/supervisor
 * @requires s/resolution
 * @module s/sysobjs
 */

import sjs from 'cherimoia/skaro';
import u from 's/utils';
import f from 's/factory';
import co from 's/collision';
import mc from 's/missiles';
import mo from 's/motion';
import ma from 's/moveastros';
import ml from 's/movelasers';
import ms from 's/movemissiles';
import mp from 's/moveship';
import v from 's/supervisor';
import rs from 's/resolution';


/** @alias module:s/sysobjs */
const xbox = /** @lends xbox# */{
  /**
   * @property {SystemUtils}   SystemUtils
   */
  SystemUtils     : u,
  /**
   * @property {EntityFactory} Factory
   */
  Factory   : f.EntityFactory,
  /**
   * @property {Collisions} Collisions
   */
  Collisions      : co.CollisionSystem,
  /**
   * @property {MissileControl}  MissileControl
   */
  MissileControl  : mc.MissileControl,
  /**
   * @property {Motions}  Motions
   */
  Motions         : mo.MotionControls,
  /**
   * @property {MoveAsteroids}  MoveAsteroids
   */
  MoveAsteroids   : ma.MoveAsteroids,
  /**
   * @property {MoveLasers}   MoveLasers
   */
  MoveLasers      : ml.MoveBombs,
  /**
   * @property {MoveMissiles}   MoveMissiles
   */
  MoveMissiles    : ms.MoveMissiles,
  /**
   * @property {MovementShip}   MovementShip
   */
  MovementShip    : mp.MovementShip,
  /**
   * @property {Supervisor}   Supervisor
   */
  Supervisor      : v.GameSupervisor,
  /**
   * @property {Resolution}   Resolution
   */
  Resolution      : rs.Resolution
};




sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF


