// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define('zotohlab/p/s/motions',

       ['zotohlab/p/s/priorities',
        'zotohlab/p/gnodes',
       'cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx'],

  function (pss, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    MotionCtrlSystem = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.alienMotions = undef;
        this.shipMotions = undef;
      },

      addToEngine: function(engine) {
        this.alienMotions = engine.getNodeList(gnodes.AlienMotionNode);
        this.shipMotions = engine.getNodeList(gnodes.ShipMotionNode);
      },

      update: function (dt) {
        var node = this.alienMotions.head;
        if (this.state.running &&
           !!node) {
          this.processAlienMotions(node,dt);
        }

        node=this.shipMotions.head;
        if (this.state.running &&
           !!node) {
          this.scanInput(node, dt);
        }
      },

      scanInput: function(node, dt) {
        if (cc.sys.capabilities['keyboard'] &&
            !cc.sys.isNative) {
          this.processKeys(node,dt);
        }
        else
        if (cc.sys.capabilities['mouse']) {
        }
        else
        if (cc.sys.capabilities['touches']) {
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

        if (sh.main.keyPoll(cc.KEY.right)) {
          m.right=true;
        }
        if (sh.main.keyPoll(cc.KEY.left)) {
          m.left=true;
        }
      }

    });

    MotionCtrlSystem.Priority= pss.Motion;
    return MotionCtrlSystem;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

