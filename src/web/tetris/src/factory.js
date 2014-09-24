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
bks= sh.Bricks,
utils= bks.SystemUtils;

//////////////////////////////////////////////////////////////////////////////
//
bks.EntityFactory = Ash.Class.extend({

  constructor: function(engine) {
    this.engine=engine;
    return this;
  },

  createArena: function(options) {
    var ent = new Ash.Entity();
    ent.add(new bks.FilledLines());
    ent.add(new bks.ShapeShell());
    ent.add(new bks.BlockGrid());
    ent.add(new bks.TileGrid());
    ent.add(new bks.Dropper());
    ent.add(new bks.Pauser());
    return ent;
  },

  createShape: function(options) {
    var ent = new Ash.Entity();

    ent.add(this.spawn(options));

    sh.fireEvent('/game/hud/shape/next');
    utils.initDropper(options);

    return ent;
  },

  spawn: function(options) {
    var info = options.nextShapeInfo,
    csts= sh.xcfg.csts,
    proto,
    comp,
    png,
    formID,
    wz = ccsx.screen();

    if (info) {
      formID = info.formID;
      png = info.png;
      proto = info.model;
    } else {
      proto = Shapes[sjs.rand(Shapes.length) ];
    }

    comp= new (proto)(5 * csts.TILE,
                      wz.height - csts.FIELD_TOP * csts.TILE,
                      formID,
                      png,
                      sh.main);
    return comp;
  }



});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF


