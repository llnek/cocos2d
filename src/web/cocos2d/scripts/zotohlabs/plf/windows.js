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

(function (undef) { "use strict"; var global = this; _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

//TODO need to set up logic for resizing the game correctly for win8, showing touch controls and winjs specific logic
sh.xcfg.setDeviceSizes({
    small: { width: 240, height: 160, scale: 2 },
    medium: { width: 240, height: 160, scale: 2 },
    large: { width: 240, height: 160, scale: 4 },
    default: { width: 240, height: 155, scale: 5 }
});
sh.xcfg.setGameSize('default');

var activation = Windows.ApplicationModel.Activation;
var app = WinJS.Application;

app.onactivated = function (args) {
  if (args.detail.kind === activation.ActivationKind.launch) {
    if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
          // TODO: This application has been newly launched. Initialize
          // your application here.
      ig.startNewGame();
    } else {
          // TODO: This application has been reactivated from suspension.
          // Restore application state here.
    }
    args.setPromise(WinJS.UI.processAll());
  }
};

ig.Input.inject({
  bindTouch: function (selector, action) {
    var element = ig.$(selector);
    var me = this;
    element.addEventListener('MSPointerDown', function (ev) {
      me.touchStart(ev, action);
    }, false);
    element.addEventListener('MSPointerUp', function (ev) {
      me.touchEnd(ev, action);
    }, false);
  },
});

WinJS.Application.onsettings = function (e) {
  loggr.debug("winjs: open settings", e);
  ig.game.togglePause(true);
    //Example adding help to the win8 charms
//          e.detail.applicationcommands = { "help": { title: "Help", href: "/html/help.html" } };
//          WinJS.UI.SettingsFlyout.populateSettings(e);
};




}).call(this);


