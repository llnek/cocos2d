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

define('zotohlab/p/s/factory', [
                               'cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/xcfg',
                               'zotohlab/asx/ccsx',
                               'ash-js'],

  function (sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    EntityFactory = Ash.Class.extend({

      constructor: function(engine) {
        this.engine=engine;
      },

      createBackSky: function(layer, options) {
        var bg = ccsx.createSpriteFrame('bg01.png');
        bg.setAnchorPoint(0,0);
        bg.setVisible(false);
        layer.addItem(bg, -10);

        if (! options.backSkyDim) {
          options.backSkyDim= cc.size(bg.getContentSize());
        }

        return {
          sprite: bg,
          active: false
        }
      }

    });

    return EntityFactory;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

