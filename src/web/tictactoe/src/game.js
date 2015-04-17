// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define("zotohlab/p/arena", ['cherimoia/skarojs',
                           'zotohlab/asterix',
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xlayers',
                           'zotohlab/asx/xscenes',
                           'zotohlab/asx/xmmenus',
                           'zotohlab/asx/odin',
                           'zotohlab/p/hud',
                           'zotohlab/p/components',
                           'zotohlab/p/sysobjs'],

  function (sjs, sh, ccsx, layers, scenes,
            mmenus, odin, huds, cobjs, sobjs) { "use strict";

    var prrs= sobjs.Priorities,
    evts= odin.Events,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    var GameLayer = layers.XGameLayer.extend({

      onStop: function(evt) { this.options.netQ.push(evt); },

      replay: function() {
        if (sjs.isObject(this.options.wsock)) {
          // request server to restart a new game
          this.options.wsock.send({
            type: evts.MSG_SESSION,
            code: evts.REPLAY
          });
        } else {
          this.play(false);
        }
      },

      play: function(newFlag) {

        var p1ids, p2ids;

        csts.CELLS = this.options.size*this.options.size;
        csts.GRID_SIZE= this.options.size;

        // sort out names of players
        sjs.eachObj(function(v,k) {
          if (v[0] === 1) {
            p1ids= [k, v[1] ];
          } else {
            p2ids= [k, v[1] ];
          }
        }, this.options.ppids);

        // clean slate
        this.reset(newFlag);
        this.cleanSlate();

        sh.factory= new sobjs.Factory(this.engine);
        this.options.running=true;
        this.initPlayers();

        this.options.selQ = [];
        this.options.netQ = [];
        this.options.msgQ = [];

        R.forEach(function(z) {
          this.engine.addSystem(new (z)(this.options), z.Priority);
        }.bind(this),
        [sobjs.GameSupervisor,
         sobjs.SelectionSystem,
         sobjs.NetworkSystem,
         sobjs.TurnBaseSystem,
         sobjs.ResolutionSystem,
         sobjs.RenderSystem
        ]);

        if (this.options.wsock) {
          this.options.wsock.unsubscribeAll();
          this.options.wsock.subscribeAll(this.onevent,this);
        }

        this.getHUD().regoPlayers(csts.P1_COLOR, p1ids,
                                  csts.P2_COLOR, p2ids);
      },

      onNewGame: function(mode) {
        //sh.sfxPlay('start_game');
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
        if (newFlag) {
          this.getHUD().resetAsNew();
        } else {
          this.getHUD().reset();
        }
      },

      onclicked: function(mx,my) {
        if (this.options.running &&
            this.options.selQ.length === 0) {
          //sjs.loggr.debug("selection made at pos = " + mx + "," + my);
          this.options.selQ.push({ x: mx, y: my, cell: -1 });
        }
      },

      updateHUD: function() {
        if (this.options.running) {
          this.getHUD().drawStatus(this.actor);
        } else {
          this.getHUD().drawResult(this.lastWinner);
        }
      },

      playTimeExpired: function(msg) {
        this.options.msgQ.push("forfeit");
      },

      setGameMode: function(mode) {
        this._super(mode);
        this.getHUD().setGameMode(mode);
      },

      initPlayers: function() {
        var p2cat, p1cat,
        p2, p1;

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
        this.options.players = [null,p1,p2];
        this.options.colors={};
        this.options.colors[csts.P1_COLOR] = p1;
        this.options.colors[csts.P2_COLOR] = p2;
      },

      onevent: function(topic, evt) {
        //sjs.loggr.debug(evt);
        switch (evt.type) {
          case evts.MSG_NETWORK:
            this.onNetworkEvent(evt);
          break;
          case evts.MSG_SESSION:
            this.onSessionEvent(evt);
          break;
        }
      },

      onNetworkEvent: function(evt) {
        switch (evt.code) {
          case evts.RESTART:
            sjs.loggr.debug("restarting a new game...");
            this.getHUD().killTimer();
            this.play(false);
          break;
          case evts.STOP:
            sjs.loggr.debug("game will stop");
            this.getHUD().killTimer();
            this.onStop(evt);
          break;
          default:
            //TODO: fix this hack
            this.onSessionEvent(evt);
          break;
        }
      },

      onSessionEvent: function(evt) {
        this.options.netQ.push(evt);
        /*
        if (_.isNumber(evt.source.pnum) &&
            _.isObject(evt.source.cmd) &&
            _.isNumber(evt.source.cmd.cell)) {
          sjs.loggr.debug("action from server " + JSON.stringify(cmd));
          this.options.netQ.push(evt);
        }
        switch (evt.code) {
          case evts.POKE_MOVE:
          case evts.POKE_WAIT:
          break;
        }

    */
      }

    });

    return {

      'GameArena' : {

        create: function(options) {
          var scene = new scenes.XSceneFactory([
            huds.BackLayer,
            GameLayer,
            huds.HUDLayer
          ]).create(options);

          scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
            mmenus.XMenuLayer.onShowMenu();
          });
          scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
            sh.main.replay();
          });
          scene.ebus.on('/game/hud/timer/show',function(t,msg) {
            sh.main.getHUD().showTimer();
          });
          scene.ebus.on('/game/hud/timer/hide',function(t,msg) {
            sh.main.getHUD().killTimer();
          });
          scene.ebus.on('/game/hud/score/update',function(t,msg) {
            sh.main.getHUD().updateScore(msg.color, msg.score);
          });
          scene.ebus.on('/game/hud/end',function(t,msg) {
            sh.main.getHUD().endGame(msg.winner);
          });
          scene.ebus.on('/game/hud/update',function(t,msg) {
            sh.main.getHUD().update(msg.running, msg.pnum);
          });
          scene.ebus.on('/game/player/timer/expired',function(t,msg) {
            sh.main.playTimeExpired(msg);
          });

          return scene;
        }
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

