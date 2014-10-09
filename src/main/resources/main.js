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

(function () { "use strict";

  function nativeInit() {
    if (cc.sys.isNative) {
      var searchPaths = jsb.fileUtils.getSearchPaths();
      searchPaths.push('script');
      if (cc.sys.os == cc.sys.OS_IOS ||
          cc.sys.os == cc.sys.OS_OSX) {
          searchPaths.push("res");
          searchPaths.push("src");
      }
      jsb.fileUtils.setSearchPaths(searchPaths);
    }
  }

  cc.game.onStart= function() { supplicate('zotohlab/p/boot'); };
  cc.game.run();

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

