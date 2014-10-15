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

define('zotohlab/p/bgs', ['cherimoia/skarojs',
                         'zotohlab/asterix',
                         'zotohlab/asx/xcfg',
                         'zotohlab/asx/ccsx',
                         'zotohlab/asx/xlayers'],

  function(sjs, sh, xcfg, ccsx, layers) { "use strict";

    var csts = xcfg.csts,
    undef,
    BackSky = cc.Sprite.extend({
      active:true,
      ctor: function () {
        this._super(sh.getImagePath('bg01'));
        this.setAnchorPoint(0,0);
      },
      destroy:function () {
        this.visible = false;
        this.active = false;
      }
    });

    BackSky.create = function (par) {
      var bg = new BackSky();
      par.addChild(bg, -10);
      MW.CONTAINER.BACKSKYS.push(background);
      return background;
    };

    BackSky.getOrCreate = function () {
      var selChild = null;
      for (var j = 0; j < MW.CONTAINER.BACKSKYS.length; j++) {
          selChild = MW.CONTAINER.BACKSKYS[j];
          if (selChild.active == false) {
              selChild.visible = true;
              selChild.active = true;
              return selChild;
          }
      }
      selChild = BackSky.create();
      return selChild;
    };


BackSky.preSet = function () {
    var background = null;
    for (var i = 0; i < 2; i++) {
        background = BackSky.create();
        background.visible = false;
        background.active = false;
    }
};

var BackTileMapLvl1 = [
        "lvl1_map1.png",
        "lvl1_map2.png",
        "lvl1_map3.png",
        "lvl1_map4.png"
];

var BackTileMap = cc.Sprite.extend({
    active:true,
    ctor:function (frameName) {
        this._super("#"+frameName);
        this.anchorX = 0.5;
	    this.anchorY = 0;
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});

BackTileMap.create = function (frameName) {
    var backTileMap = new BackTileMap(frameName);
    g_sharedGameLayer.addChild(backTileMap, -9);
    MW.CONTAINER.BACKTILEMAPS.push(backTileMap);
    return backTileMap;
};

BackTileMap.getOrCreate = function () {
    var selChild = null;
    for (var j = 0; j < MW.CONTAINER.BACKTILEMAPS.length; j++) {
        selChild = MW.CONTAINER.BACKTILEMAPS[j];
        if (selChild.active == false) {
            selChild.visible = true;
            selChild.active = true;
            return selChild;
        }
    }
    selChild = BackTileMap.create(BackTileMapLvl1[0|Math.random()*4]);
    return selChild;
};


BackTileMap.preSet = function () {
    var backTileMap = null;
    for (var i = 0; i < BackTileMapLvl1.length; i++) {
        backTileMap = BackTileMap.create(BackTileMapLvl1[i]);
        backTileMap.visible = false;
        backTileMap.active = false;
    }
};

});

