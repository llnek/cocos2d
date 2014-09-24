// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Cherimoia, LLC. All rights reserved.


(function (undef) { "use strict"; var global=this, _ = global._;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

bks.ShapeList = [bks.LineShape,
                 bks.BoxShape,
                 bks.StShape,
                 bks.ElShape,
                 bks.NubShape,
                 bks.StxShape,
                 bks.ElxShape ];

//////////////////////////////////////////////////////////////////////////////
//
bks.ShapeShell= Ash.Class.extend({

  constructor: function() {
    this.shape=null;
  }

});

//////////////////////////////////////////////////////////////////////////////
//
bks.Shape= Ash.Class.extend({

  constructor: function(x,y,options) {
    this.model= options.model;
    this.rot= options.rot;
    this.png = options.png;
    this.x = x;
    this.y = y;
    this.bricks=[];
  }

});

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF


