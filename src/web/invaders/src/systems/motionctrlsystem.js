// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef){ "use strict"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
ccsx= asterix.CCS2DX,
sjs= global.SkaroJS,
sh= asterix,
ivs= sh.Invaders;


//////////////////////////////////////////////////////////////////////////////
//

ivs.MotionCtrlSystem = Ash.System.extend({

  constructor: function(options) {
    this.state= options;
    return this;
  },

  removeFromEngine: function(engine) {
  },

  addToEngine: function(engine) {
    this.alienMotions = engine.getNodeList(ivs.AlienMotionNode);
    this.shipMotions = engine.getNodeList(ivs.ShipMotionNode);
  },

  update: function (dt) {
    var node;
    for (node=this.alienMotions.head;node;node=node.next) {
      this.processAlienMotions(node,dt);
    }
    for (node=this.shipMotions.head;node;node=node.next) {
      if (cc.sys.capabilities['keyboard']) {
        this.processKeys(node,dt);
      }
      else
      if (cc.sys.capabilities['mouse']) {
      }
      else
      if (cc.sys.capabilities['touches']) {
      }
    }
  },

  processAlienMotions: function(node,dt) {
    var lpr = node.looper,
    sqad= node.aliens;

    if (! sjs.echt(lpr.timers[0])) {
      lpr.timers[0]= ccsx.createTimer(sh.main,1);
    }

    if (! sjs.echt(lpr.timers[1])) {
      lpr.timers[1]= ccsx.createTimer(sh.main,2);
    }
  },

  processKeys: function(node,dt) {
    var s= node.ship,
    m= node.motion;

    if (sh.main.keyboard[cc.KEY.right]) {
      m.right=true;
    }
    if (sh.main.keyboard[cc.KEY.left]) {
      m.left=true;
    }

  }


});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




