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
bko= sh.BreakOut;


//////////////////////////////////////////////////////////////////////////////
//
ivs.EntityFactory = Ash.Class.extend({

  constructor: function(engine) {
    this.engine=engine;
    return this;
  },

  createBricks: function(options) {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    cw= ccsx.center(),
    candies= csts.CANDIES,
    cs= csts.LEVELS["1"],
    b, w, r, c,
    x,
    y= wz.height - csts.TOP_ROW * csts.TILE ;

    for (r=0; r < csts.ROWS; ++r) {
      x= csts.TILE + csts.LEFT_OFF + sh.hw(options.candySize);
      for (c=0; c < csts.COLS; ++c) {
        b= new bko.EntityBrick(x,y, {
          color: candies[cs[r]]
        });
        this.addItem(b.create());
        this.bricks.push(b);
        x += options.candySize.width + 1;
      }
      y -= options.candySize.height - 2;
    }

  }

});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF


