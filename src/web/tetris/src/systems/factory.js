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

define("zotohlab/p/s/factory", ['zotohlab/p/components',
                               'zotohlab/p/s/utils',
                               'cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/xcfg',
                               'zotohlab/asx/ccsx',
                               'ash-js'],
  function (cobjs, utils, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    EntityFactory = Ash.Class.extend({

      constructor: function(engine) {
        this.engine=engine;
      },

      createArena: function(layer, options) {
        var ent = new Ash.Entity();
        ent.add(new cobjs.FilledLines());
        ent.add(new cobjs.ShapeShell());
        ent.add(new cobjs.BlockGrid());
        ent.add(new cobjs.TileGrid());
        ent.add(new cobjs.Motion());
        ent.add(new cobjs.Dropper());
        ent.add(new cobjs.Pauser());
        return ent;
      },

      createShape: function(layer, options) {
        var ent = new Ash.Entity();

        ent.add(this.spawn(layer, options));
        utils.initDropper(options);

        return ent;
      },

      spawn: function(layer, options) {
        var info = options.nextShapeInfo,
        proto,
        comp,
        png,
        formID,
        wz = ccsx.screen();

        if (!!info) {
          formID = info.formID;
          png = info.png;
          proto = info.model;
        } else {
          proto = cobjs.Shapes[ sjs.rand(Shapes.length) ];
        }

        return new (proto)(5 * csts.TILE,
                          wz.height - csts.FIELD_TOP * csts.TILE,
                          formID,
                          png,
                          layer);
      }

    });

    return EntityFactory;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

