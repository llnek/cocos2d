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
ivs= sh.Invaders,
utils= ivs.SystemUtils;


//////////////////////////////////////////////////////////////////////////////
//

ivs.MovementBombs = Ash.System.extend({

  constructor: function(options) {
    this.state= options;
    return this;
  },

  removeFromEngine: function(engine) {
  },

  addToEngine: function(engine) {
  },

  update: function (dt) {
    var csts= sh.xcfg.csts,
    aa=[],
    pos,
    y;
    _.each(sh.pools[csts.P_LBS],function(b) {
      pos= b.sprite.getPosition();
      y = pos.y + dt * b.vel.y;
      b.sprite.setPosition(pos.x, y);
      if (ccsx.getBottom(b.sprite) <= csts.TILE) {
        pos= b.sprite.getPosition();
        b.sprite.setPosition(pos.x,csts.TILE);
        aa.push(b);
      }
    },this);
    _.each(aa,function(b) {
      this.killBomb(b);
    },this);
  },

  killBomb: function(b) {
    var csts = sh.xcfg.csts,
    p = sh.pools[csts.P_LBS],
    ent,
    tag= b.sprite.getTag(),
    pos = b.sprite.getPosition();

    delete p[tag];
    sjs.loggr.debug('put back one bomb into pool');
    sh.pools[csts.P_BS].add(b);
    // explosion?
    if (true) {
      this.showExplosion(pos.x,pos.y);
    }
  },

  showExplosion: function(x,y) {
    var csts = sh.xcfg.csts,
    p= sh.pools[csts.P_ES],
    ent = p.get();

    if (! sjs.echt(ent)) {
      utils.createExplosions();
      ent= p.get();
    }
    ent.revive(x,y);
    sh.sfxPlay('xxx-explode');
  }


});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




