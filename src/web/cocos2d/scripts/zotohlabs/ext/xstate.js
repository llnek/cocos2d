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

(function(undef) { "use strict"; var global = this; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XState = global.ZotohLabs.klass.extends({

  preload: function() {
    this.load.baseURL = sh.xcfg.urlPrefix;
    this.onPreload();
  },

  create: function() {
    this.onCreate();
  },

  update: function() {
    this.onUpdate();
  },

  render: function() {
    this.onRender();
  },

  anchor: function(obj, deltaX, deltaY) {
    obj.anchor.y = deltaY || 0.5;
    obj.anchor.x = deltaX || 0.5;
  },

  getCenter: function() {
    return { x: this.world.centerX, y: this.world.centerY };
  },

  getSize: function() {
    return { x: this.world.width, y: this.world.height };
  },

  onPreload: function() {
  },

  onCreate: function() {
  },

  onUpdate: function() {
  },

  onRender: function() {
  },

  setPrevious: function (last) {
    this.prevState = last;
  },

  getPrevious: function() {
    return this.prevState;
  },

  dbgPointer: function(ptr) {
    ptr = ptr || this.input.activePointer;
    loggr.debug("ptr.worldX,Y = " + ptr.worldX + "," + ptr.worldY );
    loggr.debug("ptr.x,y = " + ptr.x + "," + ptr.y);
    loggr.debug("ptr.pageX,Y = " + ptr.pageX + "," + ptr.pageY);
    loggr.debug("ptr.screenX,Y = " + ptr.screenX + "," + ptr.screenY );
    loggr.debug("ptr.clientX,Y = " + ptr.clientX + "," + ptr.clientY );
  },

  ctor: function(g) {
    this.prevState= null;
    this.game=g;
  }


});




}).call(this);


