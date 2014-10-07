/**
 * @license almond 0.3.0 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */
var requirejs,require,define;var global=(function(e){var h,a,l,m,d={},c={},s={},p={},k=Object.prototype.hasOwnProperty,i=[].slice,j=/\.js$/;function t(u,v){return k.call(u,v)}function n(x,v){var F,B,z,C,G,y,I,J,E,D,A,H=v&&v.split("/"),w=s.map,u=(w&&w["*"])||{};if(x&&x.charAt(0)==="."){if(v){H=H.slice(0,H.length-1);x=x.split("/");G=x.length-1;if(s.nodeIdCompat&&j.test(x[G])){x[G]=x[G].replace(j,"")}x=H.concat(x);for(E=0;E<x.length;E+=1){A=x[E];if(A==="."){x.splice(E,1);E-=1}else{if(A===".."){if(E===1&&(x[2]===".."||x[0]==="..")){break}else{if(E>0){x.splice(E-1,2);E-=2}}}}}x=x.join("/")}else{if(x.indexOf("./")===0){x=x.substring(2)}}}if((H||u)&&w){F=x.split("/");for(E=F.length;E>0;E-=1){B=F.slice(0,E).join("/");if(H){for(D=H.length;D>0;D-=1){z=w[H.slice(0,D).join("/")];if(z){z=z[B];if(z){C=z;y=E;break}}}}if(C){break}if(!I&&u&&u[B]){I=u[B];J=E}}if(!C&&I){C=I;y=J}if(C){F.splice(0,y,C);x=F.join("/")}}return x}function r(u,v){return function(){var w=i.call(arguments,0);if(typeof w[0]!=="string"&&w.length===1){w.push(null)}return a.apply(e,w.concat([u,v]))}}function o(u){return function(v){return n(v,u)}}function f(u){return function(v){d[u]=v}}function g(v){if(t(c,v)){var u=c[v];delete c[v];p[v]=true;h.apply(e,u)}if(!t(d,v)&&!t(p,v)){throw new Error("No "+v)}return d[v]}function q(v){var w,u=v?v.indexOf("!"):-1;if(u>-1){w=v.substring(0,u);v=v.substring(u+1,v.length)}return[w,v]}l=function(v,u){var w,y=q(v),x=y[0];v=y[1];if(x){x=n(x,u);w=g(x)}if(x){if(w&&w.normalize){v=w.normalize(v,o(u))}else{v=n(v,u)}}else{v=n(v,u);y=q(v);x=y[0];v=y[1];if(x){w=g(x)}}return{f:x?x+"!"+v:v,n:v,pr:x,p:w}};function b(u){return function(){return(s&&s.config&&s.config[u])||{}}}m={require:function(u){return r(u)},exports:function(u){var v=d[u];if(typeof v!=="undefined"){return v}else{return(d[u]={})}},module:function(u){return{id:u,uri:"",exports:d[u],config:b(u)}}};h=function(v,F,E,D){var y,C,z,u,x,A=[],w=typeof E,B;D=D||v;if(w==="undefined"||w==="function"){F=!F.length&&E.length?["require","exports","module"]:F;for(x=0;x<F.length;x+=1){u=l(F[x],D);C=u.f;if(C==="require"){A[x]=m.require(v)}else{if(C==="exports"){A[x]=m.exports(v);B=true}else{if(C==="module"){y=A[x]=m.module(v)}else{if(t(d,C)||t(c,C)||t(p,C)){A[x]=g(C)}else{if(u.p){u.p.load(u.n,r(D,true),f(C),{});A[x]=d[C]}else{throw new Error(v+" missing "+C)}}}}}}z=E?E.apply(d[v],A):undefined;if(v){if(y&&y.exports!==e&&y.exports!==d[v]){d[v]=y.exports}else{if(z!==e||!B){d[v]=z}}}}else{if(v){d[v]=E}}};requirejs=require=a=function(x,y,u,v,w){if(typeof x==="string"){if(m[x]){return m[x](y)}return g(l(x,y).f)}else{if(!x.splice){s=x;if(s.deps){a(s.deps,s.callback)}if(!y){return}if(y.splice){x=y;y=u;u=null}else{x=e}}}y=y||function(){};if(typeof u==="function"){u=v;v=w}if(v){h(e,x,y,u)}else{setTimeout(function(){h(e,x,y,u)},4)}return a};a.config=function(u){return a(u)};requirejs._defined=d;define=function(u,v,w){if(!v||!v.splice){w=v;v=[]}if(!t(d,u)&&!t(c,u)){c[u]=[u,v,w]}};define.amd={jQuery:true};return this}).call(this);define("global/window",[],function(){return global});


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

//////////////////////////////////////////////////////////////////////////////
//
function nativeInit() {
  if (cc.sys.isNative) {
      var searchPaths = jsb.fileUtils.getSearchPaths();
      searchPaths.push('script');
      if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX) {
          searchPaths.push("res");
          searchPaths.push("src");
      }
      jsb.fileUtils.setSearchPaths(searchPaths);
  }
}

function pvLoadSound(sh, xcfg, k,v) { return sh.sanitizeUrl( v + '.' + xcfg.game.sfx ); }
function pvLoadSprite(sh, xcfg, k, v) { return sh.sanitizeUrl(v[0]); }
function pvLoadImage(sh, xcfg, k,v) { return sh.sanitizeUrl(v); }
function pvLoadTile(sh, xcfg, k,v) { return sh.sanitizeUrl(v); }
function pvLoadAtlas(sh, xcfg, k,v) {
  return [sh.sanitizeUrl( v + '.plist'),
          sh.sanitizeUrl( v + '.png') ];
}

//////////////////////////////////////////////////////////////////////////////
//
function pvLoadLevels(sjs, sh, xcfg) {
  var R = sjs.ramda,
  rc = [],
  f1= function(k) {
    return function(v,n) {
      var a = sjs.reduceObj( function(memo, item, key) {
        var z= k + '.' + n + '.' + key;
        switch (n) {
          case 'sprites':
            memo.push( pvLoadSprite( sh, xcfg, z, item));
            xcfg.assets.sprites[z] = item;
          break;
          case 'images':
            memo.push( pvLoadImage( sh, xcfg, z, item));
            xcfg.assets.images[z] = item;
          break;
          case 'tiles':
            memo.push( pvLoadTile(sh, xcfg,  z, item));
            xcfg.assets.tiles[z] = item;
          break;
        }
        return memo;
      }, [], v);
      rc = rc.concat(a);
    };
  };

  sjs.eachObj(function(v,k) {
    sjs.eachObj(f1(k), v);
  },
  xcfg.levels);

  return rc;
}

/////////////////////////////////////////////////////////////////////////////
//
function pvGatherPreloads(sjs, sh, xcfg) {
  var assets= xcfg.assets,
  R= sjs.ramda,
  p;
  var rc= [

    R.values(R.mapObj.idx(function(v,k) {
      return pvLoadSprite(sh,xcfg,k,v);
    }, assets.sprites)),

    R.values(R.mapObj.idx(function(v,k) {
      return pvLoadImage(sh,xcfg,k,v);
    }, assets.images)),

    R.values(R.mapObj.idx(function(v,k) {
      return pvLoadSound(sh,xcfg,k,v);
    }, assets.sounds)),

    sjs.reduceObj(function(memo, v,k) {
      // value is array of [ path, image , xml ]
      p= sh.sanitizeUrl(v[0]);
      return memo.concat([p+'/'+v[1], p+'/'+v[2]]);
    }, [], assets.fonts),

    sjs.reduceObj(function(memo, v,k) {
      return memo.concat( pvLoadAtlas(sh, xcfg, k,v));
    }, [], assets.atlases),

    R.values(R.mapObj.idx(function(v,k) {
      return pvLoadTile(sh, xcfg, k,v);
    }, assets.tiles)),

    xcfg.game.preloadLevels ? pvLoadLevels(sjs, sh, xcfg) : []
  ];

  return R.reduce(function(memo,v) {
    sjs.loggr.info('Loading ' + v);
    memo.push( v );
    return memo;
  }, [], R.flatten(rc));
}

//////////////////////////////////////////////////////////////////////////////
//
function preLaunchApp(sjs, sh, xcfg, ldr,  ss1) {
  var sz = xcfg.game.size,
  dirc = cc.director,
  eglv = cc.view;

  eglv.setDesignResolutionSize(sz.width, sz.height,
                               cc.ResolutionPolicy.SHOW_ALL);
  eglv.resizeWithBrowserSize(true);
  eglv.adjustViewPort(true);

  cc.director.setProjection(cc.Director.PROJECTION_2D);

  //dirc.setAnimationInterval(1 / sh.xcfg.game.frameRate);
  if (xcfg.game.debug) {
    dirc.setDisplayStats(xcfg.game.showFPS);
  }

  ldr.preload(pvGatherPreloads(sjs, sh, xcfg), function () {
    xcfg.runOnce();
    dirc.runScene( sh.protos[ss1].create() );
  });

}

//////////////////////////////////////////////////////////////////////////////
//
function moduleFactory(sjs, sh, xcfg, xloader) { "use strict";

  var ss1= 'StartScreen';
  nativeInit();

  sjs.loggr.info("About to create Cocos2D HTML5 Game");
  preLaunchApp(sjs, sh, xcfg, xloader, ss1);

  sh.l10nInit(),
  sh.sfxInit();

  //sjs.merge(me.xcfg.game, global.document.ccConfig);
  sjs.loggr.debug(JSON.stringify(xcfg.game));
  sjs.loggr.info("Registered game start state - " + ss1);
  sjs.loggr.info("Loaded and running. OK");

}

//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("zotohlab/p/main",

            ['cherimoia/skarojs',
             'zotohlab/asterix',
             'zotohlab/asx/xcfg',
             'zotohlab/asx/xloader',
             'zotohlab/p/config',
             'zotohlab/p/l10n',
             'zotohlab/p/protodefs'],

            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

  cc.game.onStart= function() {
    global.require('zotohlab/p/main');
  };
  cc.game.run();


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

