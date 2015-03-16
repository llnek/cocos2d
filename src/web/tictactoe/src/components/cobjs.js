// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define("zotohlab/p/components", ['zotohlab/p/s/utils',
                                'cherimoia/skarojs',
                                'zotohlab/asterix',
                                'zotohlab/asx/ccsx',
                                'zotohlab/asx/negamax',
                                'zotohlab/p/c/board'],

  function (utils, sjs, sh, ccsx, negax, GameBoard) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    lib= {
      GameBoard: GameBoard
    };

    //////////////////////////////////////////////////////////////////////////////
    lib.SmartAlgo = sh.Ashley.casDef({

      constructor: function(board) {
        this.algo= new negax.Algo(board);
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    lib.Board = sh.Ashley.casDef({

      constructor: function(size, goals) {
        this.GOALSPACE= goals;
        this.size=size;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    lib.Grid = sh.Ashley.casDef({

      constructor: function(size,seed) {
        //ignore seed for now
        this.values= sjs.makeArray(size * size, csts.CV_Z);
        this.size=size;
      }

    });

    lib.GridView = sh.Ashley.casDef({

      constructor: function(size, layer) {
        var sp = ccsx.createSpriteFrame('z.png'),
        sz= sp.getContentSize();
        //this.gridMap= sjs.makeArray(size * size, null);
        this.cells= sjs.makeArray(size * size, null);
        this.layer= layer;
        this.width= sz.width;
        this.height= sz.height;
        this.url= "";
        this.gridMap= utils.mapGridPos();
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    lib.NetPlay = sh.Ashley.casDef({

      constructor: function() {
        this.event= null;
      }

    });


    //////////////////////////////////////////////////////////////////////////////
    lib.Player = sh.Ashley.casDef({

      constructor: function(category,value,id,color,labels) {
        this.color= color;
        this.pnum=id;
        this.category= category;
        this.value= value;
        this.offset = id === 1 ? 0 : 1;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    lib.UISelection = sh.Ashley.casDef({

      constructor: function() {
        this.cell = -1;
        this.px = -1;
        this.py = -1;
      }

    });


    return lib;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

