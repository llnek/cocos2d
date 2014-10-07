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

function moduleFactory(cobjs, Ash) { "use strict";
var lib= {},
undef;

//////////////////////////////////////////////////////////////////////////////
//
lib.BoardNode = Ash.Node.create({
  selection: cobjs.UISelection,
  board: cobjs.Board,
  robot: cobjs.SmartAlgo,
  grid: cobjs.Grid,
  view: cobjs.GridView
});

//////////////////////////////////////////////////////////////////////////////
//
lib.GUINode = Ash.Node.create({
  selection: cobjs.UISelection,
  view: cobjs.GridView
});

//////////////////////////////////////////////////////////////////////////////
//
lib.NetPlayNode = Ash.Node.create({
  playcmd: cobjs.NetPlay,
  grid: cobjs.Grid
});





return lib;
}

//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("zotohlab/p/gnodes",

            ['zotohlab/p/components',
             'ash-js'],

            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

