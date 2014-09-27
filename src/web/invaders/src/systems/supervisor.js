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
ivs= sh.Invaders;


//////////////////////////////////////////////////////////////////////////////
//

ivs.GameSupervisor = Ash.System.extend({

  constructor: function(options) {
    this.factory= options.factory;
    this.state= options;
    this.inited=false;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
  },

  update: function (dt) {
    for (var node = this.nodeList.head; node; node = node.next) {
      if (! this.inited) {
        this.onceOnly(node,dt);
        this.inited=true;
      } else {
        this.process(node,dt);
      }
    }
  },

  onceOnly: function(node,dt) {
  },

  process: function(node,dt) {

  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




