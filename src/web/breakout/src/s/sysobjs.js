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
 * @requires s/collisions
 * @requires s/factory
 * @requires s/motions
 * @requires s/moveball
 * @requires s/movepaddle
 * @requires s/supervisor
 * @module s/sysobjs
 */

import co from 's/collisions';
import f from 's/factory';
import mo from 's/motions';
import mb from 's/moveball';
import mp from 's/movepaddle';
import v from 's/supervisor';


/** @alias module:s/sysobjs */
const xbox= /** @lends xbox# */{

  /**
   * @property {Collisions} Collisions
   */
  Collisions        : co.Collisions,
  /**
   * @property {EntityFactory} Factory
   */
  Factory     : f.EntityFactory,
  /**
   * @property {Motions} Motions
   */
  Motions           : mo.Motions,
  /**
   * @property {MovementBall} MovementBall
   */
  MovementBall      : mb.MovementBall,
  /**
   * @property {MovementPaddle} MovementPaddle
   */
  MovementPaddle    : mp.MovementPaddle,
  /**
   * @property {Supervisor} Supervisor
   */
  Supervisor        : v.GameSupervisor
};



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

