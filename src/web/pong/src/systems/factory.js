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
                               'cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/ccsx'],

  function (cobjs, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    EntityFactory = sh.Ashley.casDef({

      constructor: function(engine) {
        this.engine=engine;
      },

      createPaddles: function(layer, options) {

        this.createOnePaddle(layer, options.players[1],
                             options.p1,
                             options.paddle.speed,
                             options);

        this.createOnePaddle(layer, options.players[2],
                             options.p2,
                             options.paddle.speed,
                             options);
      },

      createBall: function(layer, options) {
        var ent = sh.Ashley.newEntity(),
        info = options.ball,
        vy = info.speed * sjs.randSign(),
        vx = info.speed * sjs.randSign(),
        sp;

        if (options.mode === sh.ONLINE_GAME) {
          vx = vy = 0;
        }

        sp= new cc.Sprite(sh.getImagePath('gamelevel1.images.ball'));
        sp.setPosition(info.x, info.y);
        layer.addItem(sp);

        ent.add(new cobjs.Ball(sp, info.speed));
        ent.add(new cobjs.Velocity(vx, vy));
        this.engine.addEntity(ent);
      },

      createOnePaddle: function(layer, p, info, speed, options) {
        var res1 = 'gamelevel1.images.p.paddle1',
        res2= 'gamelevel1.images.p.paddle2',
        ent = sh.Ashley.newEntity(),
        res,
        sp, lp;

        if (p.color === csts.P1_COLOR) {
          res= res1;
        } else {
          res= res2;
        }

        sp = new cc.Sprite(sh.getImagePath(res));
        sp.setPosition(info.x, info.y);
        layer.addItem(sp);

        ent.add(new cobjs.Paddle(sp, p.color, speed));
        ent.add(p);

        if (ccsx.isPortrait()) { lp = info.x; } else { lp= info.y; }
        ent.add(new cobjs.Position(lp));

        if (options.wsock && options.pnum !== p.pnum) {
          ent.add(new cobjs.Faux());
          //only simulate move
        }
        else
        if (p.category === csts.BOT) {
          ent.add(new cobjs.Faux());
        } else {
          ent.add(new cobjs.Motion());
        }

        this.engine.addEntity(ent);
      }

    });

    return EntityFactory;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

