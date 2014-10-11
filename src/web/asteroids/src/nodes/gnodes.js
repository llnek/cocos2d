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

define('zotohlab/p/gnodes', ['zotohlab/p/components',
                            'cherimoia/skarojs',
                            'zotohlab/asterix',
                            'zotohlab/asx/xcfg',
                            'zotohlab/asx/ccsx',
                            'ash-js'],

  function (cobjs, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    ast= {};

    //////////////////////////////////////////////////////////////////////////
    //
    ast.AstroMotionNode = Ash.Class.extend({

      constructor: function(astro,rotn,velo) {
        this.velocity= velo;
        this.rotation= rotn;
        this.astro = astro;
      },

      pid: function() { return this.astro.sprite.getTag(); },
      rtti: function() { return "Asteroid"; },

      inflate: function() {
      },

      deflate: function() {
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.CannonCtrlNode = Ash.Node.create({
      looper    : cobjs.Looper,
      cannon    : cobjs.Cannon,
      ship      : cobjs.Ship
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.ShipMotionNode = Ash.Node.create({
      velocity    : cobjs.Velocity,
      rotation    : cobjs.Rotation,
      thrust      : cobjs.Thrust,
      motion      : cobjs.Motion,
      ship        : cobjs.Ship
    });

    return ast;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

