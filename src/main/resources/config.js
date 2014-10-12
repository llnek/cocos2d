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

define("zotohlab/p/config", ['cherimoia/skarojs',
                            'zotohlab/asterix',
                            'zotohlab/asx/xcfg'],

  function (sjs, sh, xcfg) { "use strict";

    sjs.merge( xcfg, {

      appKey: '@@UUID@@',


      appid: '',
      color: '',

      csts: {
      },

      game: {
        size: {width:320, height:480, scale:1}
      },

      assets: {
        tiles: {
        },
        images: {
        },
        sounds: {
        },
        fonts: {
        }
      },

      levels: {
        "gamelevel1" : {
          tiles: {
          },
          images: {
          },
          sprites: {
          }
        }
      }

    });


    return xcfg;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

