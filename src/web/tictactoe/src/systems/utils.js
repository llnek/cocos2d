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

(function () { "use strict"; var global=this, gDefine=global.define;
//////////////////////////////////////////////////////////////////////////////
//
function moduleFactory(sjs, sh, xcfg, ccsx) {
var csts= xcfg.csts,
undef;

//////////////////////////////////////////////////////////////////////////////
//
return {

  //pass in gridview
  drawSymbol: function(view, x,y,offset) {
    var s1= new cc.Sprite(view.url,
                          cc.rect(offset * view.width,
                                  0,
                                  view.width, view.height));
    s1.setAnchorPoint(ccsx.AnchorCenter);
    s1.setPosition(x,y);
    view.layer.addItem(s1);
    return s1;
  }

};


}

//////////////////////////////////////////////////////////////////////////////
// export
if (typeof module !== 'undefined' && module.exports) {}
else
if (typeof gDefine === 'function' && gDefine.amd) {

  gDefine("zotohlab/p/s/utils",

          ['cherimoia/skarojs',
           'zotohlab/asterix',
           'zotohlab/asx/xcfg',
           'zotohlab/asx/ccsx'],

          moduleFactory);

} else {
}

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF





