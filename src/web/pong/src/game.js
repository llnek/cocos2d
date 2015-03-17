// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013, Ken Leung. All rights reserved.

define("zotohlab/p/arena",

       ['zotohlab/p/components',
       'zotohlab/p/sysobjs',
       'cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx',
       'zotohlab/asx/odin',
       'zotohlab/asx/xlayers',
       'zotohlab/asx/xscenes',
       'zotohlab/asx/xmmenus',
       'zotohlab/p/hud'],

  function(cobjs, sobjs, sjs, sh, ccsx,
           odin, layers, scenes, mmenus, huds) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    evts= odin.Events,
    R= sjs.ramda,
    undef,

    GameLayer = layers.XGameLayer.extend({

      // get an odin event, first level callback
      onevent: function(topic, evt) {

        sjs.loggr.debug(evt);

        switch (evt.type) {
          case evts.NETWORK_MSG:
            this.onNetworkEvent(evt);
          break;
          case evts.SESSION_MSG:
            this.onSessionEvent(evt);
          break;
        }
      },

      onStop: function(evt) {
      },

      onNetworkEvent: function(evt) {
        switch (evt.code) {
          case evts.C_RESTART:
            sjs.loggr.debug("restarting a new game...");
            this.play(false);
          break;
          case evts.C_STOP:
            sjs.loggr.debug("game will stop");
            this.onStop(evt);
          break;
          default:
            //TODO: fix this hack
            this.onSessionEvent(evt);
          break;
        }
      },

      onSessionEvent: function(evt) {
        if (!sjs.isObject(evt.source)) { return; }
        switch (evt.code) {
          case evts.C_POKE_MOVE:
            sjs.loggr.debug("activate arena, start to rumble!");
            if (this.options.pnum === evt.source.pnum) {
              this.options.poked=true;
            } else {
              sjs.loggr.error("Got POKED but with wrong player number. " +
                              evt.source.pnum);
            }
          break;
          case evts.C_SYNC_ARENA:
            sjs.loggr.debug("synchronize ui as defined by server.");
            this.options.netQ.push(evt);
            this.options.poked=true;
          break;
        }
      },

      replay: function() {
        if (sjs.isObject(this.options.wsock)) {

          // request server to restart a new game
          this.options.wsock.send({
            type: evts.SESSION_MSG,
            code: evts.C_REPLAY
          });
        } else {
          this.play(false);
        }
      },

      play: function(newFlag) {
        var pss = sobjs.Priorities,
        p1ids,
        p2ids;

        // sort out names of players
        sjs.eachObj(function(v,k) {
          if (v[0] === 1) {
            p1ids= [k, v[1] ];
          } else {
            p2ids= [k, v[1] ];
          }
        }, this.options.ppids);

        // start with a clean slate
        this.reset(newFlag);
        this.cleanSlate();

        //
        sh.factory= new sobjs.Factory(this.engine);
        this.options.world = this.getEnclosureBox();
        this.options.netQ= [];
        this.options.running=true;
        this.options.poked=false;

        this.initPlayers();

        this.getHUD().regoPlayers(csts.P1_COLOR,p1ids,
                                  csts.P2_COLOR,p2ids);

        if (this.options.wsock) {
          this.options.wsock.unsubscribeAll();
          this.options.wsock.subscribeAll(this.onevent,this);
        }

        R.forEach(function(z) {
          this.engine.addSystem(new (z[0])(this.options), z[1]);
        }.bind(this),
        [ [sobjs.Supervisor, pss.PreUpdate],
          [sobjs.Networking, pss.Net],
          [sobjs.Motions, pss.Motion],
          [sobjs.Movements, pss.Move],
          [sobjs.Resolution, pss.Resolve],
          [sobjs.Collisions, pss.Collision],
          [sobjs.Rendering, pss.Render] ] );
      },

      onNewGame: function(mode) {
        //sh.xcfg.sfxPlay('start_game');
        this.setGameMode(mode);
        this.play(true);
      },

      reset: function(newFlag) {
        if (!sjs.isEmpty(this.atlases)) {
          sjs.eachObj(function(v){ v.removeAllChildren(); }, this.atlases);
        } else {
          this.regoAtlas('game-pics');
          this.regoAtlas('lang-pics');
        }
        R.forEach(function(z) {
          if (z) { z.dispose(); }
        }, this.players);
        if (newFlag) {
          this.getHUD().resetAsNew();
        } else {
          this.getHUD().reset();
        }
        this.players.length=0;
      },

      operational: function() {
        return this.options.running;
      },

      initPlayers: function() {
        var p2cat,p1cat,
        p2,p1;

        switch (this.options.mode) {
          case sh.ONLINE_GAME:
            p2cat = csts.NETP;
            p1cat = csts.NETP;
          break;
          case sh.P1_GAME:
            p1cat= csts.HUMAN;
            p2cat= csts.BOT;
          break;
          case sh.P2_GAME:
            p2cat= csts.HUMAN;
            p1cat= csts.HUMAN;
          break;
        }
        p1= new cobjs.Player(p1cat, csts.CV_X, 1, csts.P1_COLOR);
        p2= new cobjs.Player(p2cat, csts.CV_O, 2, csts.P2_COLOR);
        this.options.players = [null, p1, p2];
        this.options.colors={};
        this.options.colors[csts.P1_COLOR] = p1;
        this.options.colors[csts.P2_COLOR] = p2;
      },

      // scores is a map {'o': 0, 'x': 0}
      updatePoints: function(scores) {
        this.getHUD().updateScores(scores);
      },

      onWinner: function(p,score) {
        this.getHUD().updateScore(p,score || 1);
        var rc= this.getHUD().isDone();
        if (rc[0]) {
          this.doDone( rc[1] );
        } else {
        }
      },

      doDone: function(p) {
        this.getHUD().drawResult(p);
        this.getHUD().endGame();
        //this.removeAll();
        sh.sfxPlay('game_end');

        this.options.running=false;
      },

      setGameMode: function(mode) {
        this._super(mode);
        this.getHUD().setGameMode(mode);
      },

      getEnclosureBox: function() {
        return ccsx.vbox();
      }

    });

    return {

      'GameArena' : {

        create: function(options) {

          var scene = new scenes.XSceneFactory([
            huds.BackLayer,
            huds.HUDLayer,
            GameLayer
          ]).create(options);

          scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
            mmenus.XMenuLayer.onShowMenu();
          });
          scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
            sh.main.replay();
          });

          scene.ebus.on('/game/hud/score/update',function(t,msg) {
            sh.main.onWinner(msg.color, msg.score);
          });

          scene.ebus.on('/game/hud/score/sync',function(t,msg) {
            sh.main.updatePoints(msg.points);
          });

          scene.ebus.on('/game/hud/end',function(t,msg) {
            sh.main.doDone(msg.winner);
          });

          return scene;
        }

      }
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

