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

define("zotohlab/p/s/motion", ['zotohlab/p/gnodes',
                              'cherimoia/skarojs',
                              'zotohlab/asterix'],

  function (gnodes, sjs,  sh) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    MotionCtrlSystem = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state = options;
      },

      removeFromEngine: function(engine) {
        this.nodeList=null;
      },

      addToEngine: function(engine) {
        this.nodeList= engine.getNodeList(gnodes.PaddleNode);
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

      update: function (dt) {
        for (var node= this.nodeList.head; node; node=node.next) {
          this.scanInput(node, dt);
        }
      },

      processKeys: function(node, dt) {
        var p= node.paddle,
        m= node.motion,
        cs = p.kcodes;

        if (sh.main.keyPoll(cs[0])) {
          m.left=true;
        }

        if (sh.main.keyPoll(cs[1])) {
          m.right=true;
        }

      }

    });

    return MotionCtrlSystem;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

