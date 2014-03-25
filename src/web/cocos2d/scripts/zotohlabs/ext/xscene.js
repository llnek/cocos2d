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

(function(undef) { "use stricts"; var global = this, _ = global._ ,
asterix= global.ZotohLabs.Asterix,
sh = asterix.Shell,
klass= global.ZotohLabs.klass,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XSceneFactory = global.ZotohLabs.klass.extends({

  createLayers: function(scene) {
    var a = options.layers || [],
    x=[],
    w={},
    rc,
    obj;
    _.each(a, function(proto) {
      obj= new (proto)(options);
      w[ obj.rtti() ] = obj;
      x.push(obj);
    });
    _.each(x, function(z) {
      z.setSiblings(w);
    });
    rc= _.some(x, function(z) {
      return ! z.init();
    });
    return a.length > 0 && rc===false;
  },

  create: function(options) {
    this.options = klass.merge(this.options, options || {} );
    var scene = cc.Scene.create();
    return this.createLayers(scene) ? scene : null;
  },

  ctor: function(options) {
    this.options= options || {};
  }

});



}).call(this);

