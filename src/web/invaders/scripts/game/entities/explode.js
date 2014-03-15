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

var asterix = global.ZotohLabs.Asterix;
var iv = asterix.Invaders;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;


asterix.Invaders.EntityExplode = asterix.XEntity.extend({

  animSheet: new ig.AnimationSheet('media/invaders/game/explode.png', 8, 8),
  size: { x: 8, y: 8 },
  type: ig.Entity.TYPE.NONE,

  update: function() {
    if (this.currentAnim.loopCount > 0) {
      this.kill();
    } else {
      this.parent();
    }
  },

  init: function(x, y, options) {
    this.parent(x, y, options);
    this.addAnim('show', 0.1, [0, 1, 2, 3]);
  }


});







}).call(this);


