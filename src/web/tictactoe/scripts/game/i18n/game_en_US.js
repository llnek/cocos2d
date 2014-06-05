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
var asterix= global.ZotohLab.Asterix;
var sh= asterix.Shell;
var loggr= global.ZotohLab.logger;

global.ZotohLab.klass.merge(global.ZotohLab.Asterix.Shell.xcfg.l10n, {

"en-US" : {

  "%whosturn" : "{{who}}'s TURN...",
  "%whodraw" : "Draw!",
  "%whowin" : "{{who}} Wins!",

  "%p2" : "P2",
  "%p1" : "P1"

}






});

loggr.info("Loading resource bundle");
sh.l10nInit(sh.xcfg.l10n);

}).call(this);

