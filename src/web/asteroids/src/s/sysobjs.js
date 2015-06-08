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
 * @requires s/utils
 * @requires s/factory
 * @requires s/collisions
 * @requires s/missilecontrol
 * @requires s/motions
 * @requires s/moveasteroids
 * @requires s/movelasers
 * @requires s/movemissiles
 * @requires s/moveship
 * @requires s/supervisor
 * @requires s/resolution
 * @module s/sysobjs
 */

import u from 's/utils';
import f from 's/factory';
import co from 's/collisions';
import mc from 's/missilecontrol';
import mo from 's/motions';
import ma from 's/moveasteroids';
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
  Collisions      : co.Collisions,
  /**
   * @property {MissileControl}  MissileControl
   */
  MissileControl  : mc.MissileControl,
  /**
   * @property {Motions}  Motions
   */
  Motions         : mo.Motions,
  /**
   * @property {MoveAsteroids}  MoveAsteroids
   */
  MoveAsteroids   : ma.MoveAsteroids,
  /**
   * @property {MoveLasers}   MoveLasers
   */
  MoveLasers      : ml.MoveLasers,
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


