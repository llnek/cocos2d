// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/asx/xloader
 */
define("zotohlab/asx/xloader",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/asx/xloader */
    var exports = {},
    _instance= null,
    CHUNK=36,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class XLoader
     */
    var XLoader = cc.Scene.extend({

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/xloader~XLoader
       * @method ctor
       */
      ctor: function () {
        this._super();
        // black back-ground
        this.bgLayer = new cc.LayerColor(cc.color(0,0,0, 255));
        this.bgLayer.setPosition(0, 0);
        this.addChild(this.bgLayer);
      },

      /**
       * Sets up the loader, runs once.
       *
       * @memberof module:zotohlab/asx/xloader~XLoader
       * @method pkLoad
       * @private
       */
      pkLoad: function () {
        var cw = ccsx.center(),
        pfx='/public/ig/res/',
        s1,s2;

        if (cc.sys.isNative) { pfx= '';  }
        this.unschedule(this.pkLoad);

        // logo
        this.logoSprite = new cc.Sprite(pfx + 'cocos2d/pics/ZotohLab.png');
        //this.logoSprite.setScale( cc.contentScaleFactor());
        this.logoSprite.setPosition(cw);
        this.bgLayer.addChild(this.logoSprite);

        // progress bar
        this.progress = new cc.ProgressTimer(
                          new cc.Sprite(pfx+'cocos2d/pics/preloader_bar.png'));
        this.progress.setType(cc.ProgressTimer.TYPE_BAR);
        this.progress.setScaleX(0.8);
        this.progress.setScaleY(0.3);
        //this.progress.setOpacity(0);
        //this.progress.setPercentage(0);
        this.progress.setPosition(this.logoSprite.getPositionX(), // - 0.5 * this.logo.width / 2 ,
                                  cw.y - this.logoSprite.getContentSize().height * 0.6 );//- 10);
        //this.progress.setMidpoint(cc.p(0,0));
        this.bgLayer.addChild(this.progress);

        //this.scheduleOnce(this.pkStartLoading);
        this.pkStartLoading();
      },

      onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this.schedule(this.pkLoad, 0.3);
      },

      onExit: function () {
        cc.Node.prototype.onExit.call(this);
      },

      initWithResources: function (resources, selector, target) {
        this.resources = resources;
        this.selector = selector;
        this.target = target;
      },

      niceFadeOut: function() {
        this.unscheduleUpdate();
        this.logoSprite.runAction(cc.Sequence.create(
                                          cc.FadeOut.create(1.2),
                                          cc.CallFunc.create(this.selector, this.target)));
      },

      // we have to load chunk by chunk because the array of resources
      // can't be too big, else jsb complains
      loadChunk: function() {
        var res = this.resources,
        me=this,
        s= this._pres[0],
        e= this._pres[1];

        //cc.log('start s = ' + s + ', e = ' + e);

        cc.loader.load(res.slice(s, e), function(result, total, cnt) {
          //cc.log('total = ' + total + ', cnt = ' + cnt);
          me._count += 1;
        }, function() {
          me._pres[2] = true;
        });
      },

      // loading. step1
      pkStartLoading: function () {
        var res = this.resources,
        me=this;

        // [head, tail, state] snapshot info used by
        // each iteration as we chunk up the unput
        this._pres= [0, Math.min(CHUNK, res.length), false];
        this._count=0;

        this.schedule(this.update, 0.25);
        this.loadChunk();
      },

      update: function () {
        var len = this.resources.length,
        cnt = this._count,
        ratio = cnt / len,
        s,e,
        perc= Math.min(ratio * 100, 100);

        this.progress.setPercentage(perc);
        if (cnt >= len) {
          // done
          this.unscheduleUpdate();
          this.niceFadeOut();
        }
        else
        if (this._pres[2]) {
          s= this._pres[1];
          e= s+ Math.min(CHUNK, len - s);
          this._pres[0]=s;
          this._pres[1]=e;
          this._pres[2]=false;
          this.loadChunk();
        }
      }

    });


    //////////////////////////////////////////////////////////////////////////////
    /**
     * @memberof module:zotohlab/asx/xloader~XLoader
     * @method preload
     * @static
     * @param {Array} resources
     * @param {Function} selector
     * @param {Object} target
     * @return {XLoader} - the XLoader singleton.
     */
    XLoader.preload = function (resources, selector, target) {
      var director = cc.director;

      if (!_instance) { _instance = new XLoader(); }

      _instance.initWithResources(resources, selector, target);
      director.runScene(_instance);

      return _instance;
    };

    /**
     * @property {XLoader.Class} XLoader
     * @final
     */
    exports.XLoader = XLoader;

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

