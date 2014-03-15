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

(function(undef) { "use strict"; var global = this; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XGame = asterix.XState.extends({

  onCreate: function() {
    // foundation of screens, using the group heirarchy.
    this.root= this.add.group(undef, 'main-game-root-group');
    // add sound files.
    this.initSfx();
    // sets up screen objects.
    var firstScreen = this.preStart();
    var me=this;
    _.each(this.screens, function(s,k) {
      s.create(me.root,k);
    });
    this.floatTop(firstScreen);
  },

  onUpdate: function() {
    // we use the first ever update call as a start trigger
    if (! this.startFired) {
      this.startFired = true;
      this.doStart();
    } else {
      this.doFrame();
    }
  },

  onRender: function() {
    if (this.startFired) {
      this.doDraw();
    }
  },

  doFrame: function() {
    if (this.cur) {
      this.cur.update();
    }
  },

  doDraw: function() {
    if (this.cur) {
      this.cur.draw();
    }
  },

  doStart: function() {
    // kick start the state machine which controls the screen flows.
    sh.xcfg.smac.genesis();
  },

  preStart: function() {
    // sub class should do work here.
  },

  initSfx: function() {
    var me=this;
    _.each( sh.xcfg.assets.sounds, function(v,k) {
      me.sfxs[k] = me.add.audio(k);
    });
  },

  sfxPlay: function(p) {
    if (sh.xcfg.sound.open) {
      var a = this.sfxs[p];
      if (a) { a.play('',0, sh.xcfg.sound.volume); }
    }
  },

  invoke: function(screen, arg) {
    loggr.debug('invoking screen: ' + screen);
    var x= this.screens[screen];
    var options;
    if (_.isString(arg)) {
      options= { action: arg }
    }
    else
    if (_.isObject(arg)) {
      options=arg;
    }
    else {
      options= {};
    }
    if (x) {
      if (this.cur) {
        this.cur.loseFocus();
        x.setPrev(this.cur);
      }
      this.cur=x;
      this.floatTop(this.cur, options);
    }
  },

  // a detached pop up, like a confirm dialog.
  flyout: function(scr, options) {
    var p= new (scr)();
    p.create(this.root,'flyout');
    if (this.cur) {
      this.cur.loseFocus();
    }
    this.floatTop(p,options);
  },

  defly: function(s) {
    this.root.remove(s.group);
    s.loseFocus();
    if (this.cur) {
      this.floatTop(this.cur);
    }
  },

  floatTop: function(c, options) {
    this.root.bringToTop(c.group);
    c.focus(options || {});
  },

  ctor: function(g) {
    this.startFired = false;
    this.screens = {};
    this.sfxs= {};
    this.root = null;
    this.cur = null;
    this.parent(g);
    sh.main = this;
  }

});




}).call(this);


