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

define("zotohlab/p/s/utils", ['cherimoia/skarojs',
                             'zotohlab/asterix',
                             'zotohlab/asx/ccsx'],

  function (sjs, sh, ccsx) { "use strict";

    var xcfg= sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    return {

      mapGridPos: function (gsz, scale) {
        gsz = gsz || csts.GRID_SIZE;
        scale = scale || 1;
        // memorize the co-ordinates of each cell on the board, so
        // we know which cell the user has clicked on.
        var sp = ccsx.createSpriteFrame('z.png'),
        csz = cc.size(sp.getContentSize().width * scale,
                      sp.getContentSize().height * scale),
        cells= gsz * gsz,
        ro= 8/72 * scale,
        gh = csz.height * ro,
        gw = csz.width * ro,
        zh= gsz * csz.height + (gsz-1) * gh,
        zw= gsz * csz.width + (gsz-1) * gw,
        cw = ccsx.center(),
        gridMap=[],
        x2,y2,
        x0 = cw.x - zw * 0.5,
        y0 = cw.y + zh * 0.5,
        x1= x0,
        y1=y0;

        for (var n=0; n < cells; ++n) { gridMap.push(null); }
        for (var r=0; r < gsz; ++r) {
          for (var c= 0; c < gsz; ++c) {
            y2 = y1 - csz.height;
            x2 = x1 + csz.width;
            gridMap[r * gsz + c] = { left: x1, top: y1, right: x2, bottom: y2};
            x1 = x2 + gw;
          }
          y1 = y2 - gh;
          x1 = x0;
        }
        return gridMap;
      },

      pkFlip: function(img,flip) {
        if (flip) {
          return img + ".i.png";
        } else {
          return img + ".png";
        }
      },

      xrefImg: function(value) {
        switch (value) {
          case csts.CV_X: return 'x';
          case csts.CV_O: return 'o';
          case csts.CV_Z: return 'z';
        }
      },

      //pass in gridview
      drawSymbol: function(view, x,y,value,flip) {
        var frame = this.pkFlip(this.xrefImg(value),flip),
        s1= ccsx.createSpriteFrame(frame);
        s1.setAnchorPoint(ccsx.AnchorCenter);
        s1.setPosition(x,y);
        view.layer.addAtlasItem('game-pics', s1);
        return s1;
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF





