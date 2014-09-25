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
png= sh.Pong;


//////////////////////////////////////////////////////////////////////////////
//
png.Paddle = Ash.Class.extend({

  constructor: function(layer, x,y,color,speed) {
    this.color= color;
    this.speed= speed;

    if (ccsx.isPortrait()) {

      if (this.color === 'X') {
        this.resid = 'gamelevel1.images.p.paddle1';
        this.kcodes = [cc.KEY.right, cc.KEY.left];
      } else {
        this.resid = 'gamelevel1.images.p.paddle2';
        this.kcodes = [cc.KEY.d, cc.KEY.a];
      }

    } else {

      if (this.color === 'X') {
        this.resid = 'gamelevel1.images.l.paddle1';
        this.kcodes = [cc.KEY.up, cc.KEY.down];
      } else {
        this.resid = 'gamelevel1.images.l.paddle2';
        this.kcodes = [cc.KEY.w, cc.KEY.s];
      }
    }

    if (this.color === 'X') {
      this.snd= 'x_hit';
    } else {
      this.snd= 'o_hit';
    }

    this.sprite = new cc.Sprite(sh.getImagePath(this.resid));
    this.sprite.setPosition(x,y);
    layer.addItem(this.sprite);

    return this;
  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF



