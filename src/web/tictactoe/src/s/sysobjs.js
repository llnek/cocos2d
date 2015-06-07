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
 * @requires cherimoia/skarojs
 * @requires s/utils
 * @requires s/factory
 * @requires s/rendering
 * @requires s/resolution
 * @requires s/supervisor
 * @requires s/turnbase
 * @requires s/motion
 * @module s/sysobjs
 */

import sjs from 'cherimoia/skarojs';
import utils from 's/utils';
import fact from 's/factory';
import render from 's/rendering';
import res from 's/resolution';
import visor from 's/supervisor';
import turn from 's/turnbase';
import motion from 's/motion';

/** @alias module:s/sysobjs */
const xbox= /** @lends xbox# */{
  /**
   * @property {Factory} Factory
   */
  Factory: fact.EntityFactory,
  /**
   * @property {GameSupervisor} GameSupervisor
   */
  GameSupervisor: visor.GameSupervisor,
  /**
   * @property {Motions} Motions
   */
  Motions: motion.Motions,
  /**
   * @property {TurnBaseSystem} TurnBaseSystem
   */
  TurnBaseSystem: turn.TurnBaseSystem,
  /**
   * @property {ResolutionSystem} ResolutionSystem
   */
  ResolutionSystem: res.ResolutionSystem,
  /**
   * @property {RenderSystem} RenderSystem
   */
  RenderSystem: render.RenderSystem,
  /**
   * @property {SystemUtils} SystemUtils
   */
  SystemUtils: utils

};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

