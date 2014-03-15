// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
//
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global = this; var _ = global._ ;

// monkey patch stuff that we want to extend

cc.Director.prototype.getSceneStackLength = function() {
  return this._scenesStack.length;
};

cc.Director.prototype.replaceRootScene = function(scene) {
  this.popToRootScene();
  if (this._scenesStack.length !== 1) {
    throw new Error("scene stack is screwed up");
  }
  var cur = this._scenesStack.pop();
  if (cur.isRunning()) {
      cur.onExitTransitionDidStart();
      cur.onExit();
  }
  cur.cleanup();
  this._runningScene=null;
  this._nextScene = null;
  this.runWithScene(scene);
};

}).call(this);


