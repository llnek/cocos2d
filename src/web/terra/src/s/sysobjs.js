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
 * @requires s/supervisor
 * @requires s/levelmgr
 * @requires s/motions
 * @requires s/movemissiles
 * @requires s/movebombs
 * @requires s/moveship
 * @requires s/collisions
 * @requires s/resolution
 * @requires s/rendering
 * @module s/sysobjs
 */

import u from 's/utils';
import f from 's/factory';
import v from 's/supervisor';
import lm from 's/levelmgr';
import mo from 's/motions';
import ms from 's/movemissiles';
import bs from 's/movebombs';
import sp from 's/moveship';
import co from 's/collisions';
import rs from 's/resolution';
import rd from 's/rendering';

/** @alias module:s/sysobjs */
const xbox = /** @lends xbox# */{

  /**
   * @property {EntityFactory}  EntityFactory
   */
  EntityFactory       : f.EntityFactory,
  /**
   * @property {Utils}    Utils
   */
  Utils               : u,
  /**
   * @property {Supervisor}   Supervisor
   */
  Supervisor          : v.Supervisor,
  /**
   * @property {LevelManager}   LevelManager
   */
  LevelManager        : lm.LevelManager,
  /**
   * @property {Motions}      Motions
   */
  Motions             : mo.Motions,
  /**
   * @property {MoveMissiles}     MoveMissiles
   */
  MoveMissiles        : ms.MoveMissiles,
  /**
   * @property {MoveBombs}      MoveBombs
   */
  MoveBombs           : bs.MoveBombs,
  /**
   * @property {MoveShip}     MoveShip
   */
  MoveShip            : sp.MoveShip,
  /**
   * @property {Collisions}     Collisions
   */
  Collisions       : co.Collisions,
  /**
   * @property {Resolution}     Resolution
   */
  Resolution       : rs.Resolution,
  /**
   * @property {Rendering}      Rendering
   */
  Rendering        : rd.Rendering
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

