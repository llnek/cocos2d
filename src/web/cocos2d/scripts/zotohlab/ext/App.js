App.toggleSoundEnabled = function() {
  this.enableSound(!this.isSoundEnabled());
};
App.isSoundEnabled = function() {
  return this._soundEnabled ? true : false;
};

//
// ###  App.playEffect
//
// Plays the sound effect with the given filename if sound is enabled.
//
App.playEffect = function(filename) {
  if (this.isSoundEnabled()) {
    return cc.audioEngine.playEffect(filename);
  }
  return -1;
};

//
// ###  App.stopEffect
//
// Stops the sound effect with the given id.
//
App.stopEffect = function(audioId) {
  cc.audioEngine.stopEffect(audioId);
};

//
// ###  App.playMusic
//
// Plays the music file with the given filename if sound is enabled.
//
App.playMusic = function(filename) {
  if (this.isSoundEnabled()) {
    cc.audioEngine.stopMusic();
    cc.audioEngine.playMusic(filename);
  }
};

//
// ###  App.getAnalyticsPlugin
//
// Get the analytics plugin. The first time this is called, the plugin is loaded and configured.
//
App.getAnalyticsPlugin = function() {
  var config, name;
  if (typeof this._analyticsPlugin === "undefined" && typeof plugin !== "undefined") {

    if (this.isHtml5() && !this._initializedAnalytics) {
      this._loadAnalyticsTries = (this._loadAnalyticsTries || 0);

      if (typeof FlurryAgent !== "undefined" &&
        typeof App.config !== "undefined"
      ) {
        if (this._loadAnalyticsTries > 0) {
          cc.log("Loaded analytics after " +
            this._loadAnalyticsTries + " tries");
        }
        this._initializedAnalytics = true;
      } else {
        /* Try to load plugin up to 10 times with a 250ms delay between tries. */
        if (this._loadAnalyticsTries < 10) {
          setTimeout(function(){
            App.getAnalyticsPlugin();
          }, 250);
        }
        return;
      }

      this._loadAnalyticsTries = this._loadAnalyticsTries + 1;
    }

    config = App.config["analytics-plugin"];
    name = config["name"];
    this._analyticsPlugin = plugin.PluginManager.getInstance().loadPlugin(name);

    if (this._analyticsPlugin === null) {
      this._analyticsPlugin = new plugin[name]();
      this._analyticsPlugin.init();
    }

    if (this._analyticsPlugin) {
      this._analyticsPlugin.setDebugMode(config["debug"]);
      if (config["api-key"] && config["api-key"].length) {
        this._analyticsPlugin.startSession(config["api-key"]);
        if (config["debug"]) {
          cc.log("Analytics plugin session started with API key: " +
            config["api-key"].substr(0,4) + "...");
        }
      } else {
        cc.log("Analytics plugin missing API key");
      }
    }
  }

  return this._analyticsPlugin;
};

//
// ###  App.getAdsPlugin
//
// Get the advertisements plugin. The first time this is called, the plugin is loaded and configured.
//
App.getAdsPlugin = function() {
  if (typeof this._adsPlugin === "undefined" && typeof plugin !== "undefined") {
    var name = App.config["ads-plugin"]["name"];

    this._adsPlugin = plugin.PluginManager.getInstance().loadPlugin(name);

    if (this._adsPlugin === null) {
      this._adsPlugin = new plugin[name]();
      this._adsPlugin.init();
    }

    if (this._adsPlugin) {
      this._adsPlugin.setDebugMode(App.config["ads-plugin"]["debug"]);
      this._adsPlugin.configDeveloperInfo({
        apiKey: App.config["ads-plugin"]["api-key"],
        mode: App.config["ads-plugin"]["mode"]
      });
    }
  }

  return this._adsPlugin;
};

//
// ###  App.getSocialPlugin
//
// Get the social networking plugin. The first time this is called, the plugin is loaded and configured.
//
App.getSocialPlugin = function() {
  var name;

  if (typeof this._socialPlugin === "undefined") {
    name = App.config["social-plugin"]["name"];
    if (plugin[name]) {
      this._socialPlugin = new plugin[name]();
      this._socialPlugin.setDebugMode(App.config["social-plugin"]["debug"]);
      this._socialPlugin.init({
        appId: App.config["social-plugin"]["app-id"],
        xfbml: false,
        status: true,
        cookie: true
      });
    }
  }

  return this._socialPlugin;
};

//
// ###  App.getEconomyPlugin
//
// Get the virtual economy plugin. The first time this is called, the plugin is loaded and configured.
//
App.getEconomyPlugin = function() {
  if (typeof this._economyPlugin === "undefined") {
    var storeConfig = {
        soomSec: App.config["economy-plugin"]["secret1"],
        customSecret: App.config["economy-plugin"]["secret2"],
        androidPublicKey: App.config["economy-plugin"]["android-public-key"]
      };

    this._economyPlugin = Soomla;

    if (Soomla.CCSoomlaNdkBridge.setDebug) {
      Soomla.CCSoomlaNdkBridge.setDebug(App.config["economy-plugin"]["debug"]);
    }

    if (storeConfig && storeConfig.soomSec && storeConfig.customSecret) {
      try{
        Soomla.StoreController.createShared(App.getStoreAssets(), storeConfig);
      } catch(e) {
        cc.log("Error creating store or getting store assets: " + e);
      }

      Soomla.CCSoomlaNdkBridge.buy = function(
        productId,
        successCallback,
        failureCallback
      ) {
        var social = App.getSocialPlugin();
        if (social && social.isCanvasMode()) {
          social.buy(productId, successCallback, failureCallback);
        }
        else {
          App.alert("Please play within Facebook to enable purchasing.");
          Soomla.CCSoomlaNdkBridge.onPaymentComplete();
        }
      };

      Soomla.CCSoomlaNdkBridge.onCurrencyUpdate = function() {
        App.getRunningLayer().onCurrencyUpdate();
      };

      Soomla.CCSoomlaNdkBridge.onPaymentComplete = function() {
        App.getRunningLayer().onPaymentComplete();
      };
    } else {
      cc.log("Soomla: Secret keys have not been set");
    }
  }

  return this._economyPlugin;
};

//
// ###  App.getStoreAssets
//
// Returns the store assets object. Configured in `App.config["economy-plugin"]`.
//
App.getStoreAssets = function() {
  var i,
    a,
    assets = {
      categories: [],
      currencies: [],
      currencyPacks: [],
      goods: {
        singleUse: [],
        lifetime: [],
        equippable: [],
        goodUpgrades: [],
        goodPacks: []
      },
      nonConsumables: [],
      version: 1
    },
    processItems = function(obj) {
      var key,
        func;

      key = "create_market_item";
      if (obj[key]) {
        func = Soomla.Models.PurchaseWithMarket.createWithMarketItem;
        obj.purchasableItem = func(obj[key][0], obj[key][1]);
        delete obj[key];
      }

      key = "create_virtual_item";
      if (obj[key]) {
        func = Soomla.Models.PurchaseWithVirtualItem.create;
        obj.purchasableItem = func({
          pvi_itemId: obj[key][0],
          pvi_amount: obj[key][1]
        });
        delete obj[key];
      }

      key = "create_nonconsumable_item";
      if (obj[key]) {
        func = Soomla.Models.PurchaseWithMarket.create;
        obj.purchasableItem = func({
          marketItem: Soomla.Models.MarketItem.create({
            productId: obj[key][0],
            consumable: 0,
            price: obj[key][1]
          })
        });
        delete obj[key];
      }

      return obj;
    };

  /* Currencies. */
  a = App.clone(App.config["economy-plugin"]["currencies"]);
  for (i = 0; i < a.length; i += 1) {
    assets.currencies.push(
      Soomla.Models.VirtualCurrency.create(a[i])
    );
  }

  /* Currency packs. */
  a = App.clone(App.config["economy-plugin"]["currency-packs"]);
  for (i = 0; i < a.length; i += 1) {
    assets.currencyPacks.push(
      Soomla.Models.VirtualCurrencyPack.create(processItems(a[i]))
    );
  }

  /* Single-use goods. */
  a = App.clone(App.config["economy-plugin"]["single-use-goods"]);
  for (i = 0; i < a.length; i += 1) {
    assets.goods.singleUse.push(
      Soomla.Models.SingleUseVG.create(processItems(a[i]))
    );
  }

  /* Lifetime goods. */
  a = App.clone(App.config["economy-plugin"]["lifetime-goods"]);
  for (i = 0; i < a.length; i += 1) {
    assets.goods.lifetime.push(
      Soomla.Models.LifetimeVG.create(processItems(a[i]))
    );
  }

  /* Equippable goods. */
  a = App.clone(App.config["economy-plugin"]["equippable-goods"]);
  for (i = 0; i < a.length; i += 1) {
    assets.goods.equippable.push(
      Soomla.Models.EquippableVG.create(processItems(a[i]))
    );
  }

  /* Good upgrades. */
  a = App.clone(App.config["economy-plugin"]["good-upgrades"]);
  for (i = 0; i < a.length; i += 1) {
    assets.goods.goodUpgrades.push(
      Soomla.Models.UpgradeVG.create(processItems(a[i]))
    );
  }

  /* Good packs. */
  a = App.clone(App.config["economy-plugin"]["good-packs"]);
  for (i = 0; i < a.length; i += 1) {
    assets.goods.goodPacks.push(
      Soomla.Models.SingleUsePackVG.create(processItems(a[i]))
    );
  }

  /* Non-consumables. */
  a = App.clone(App.config["economy-plugin"]["non-consumables"]);
  for (i = 0; i < a.length; i += 1) {
    assets.nonConsumables.push(
      Soomla.Models.NonConsumableItem.create(processItems(a[i]))
    );
  }

  /* Categories. */
  a = App.clone(App.config["economy-plugin"]["categories"]);
  for (i = 0; i < a.length; i += 1) {
    assets.categories.push(
      Soomla.Models.VirtualCategory.create(a[i])
    );
  }

  /*cc.log(JSON.stringify(assets));*/
  return Soomla.IStoreAssets.create(assets);
};

//
// ###  App.giveItem
//
// Give the player a certain amount of an item ID. Use a negative amount to take away.
//
App.giveItem = function(itemId, amount) {
  if (amount < 0) {
    Soomla.storeInventory.takeItem(itemId, Math.abs(amount));
  } else {
    Soomla.storeInventory.giveItem(itemId, amount);
  }
};

//
// ###  App.logCurrencyBalances
//
// Logs the balances of all currencies.
//
App.logCurrencyBalances = function() {
  var currencies, len, i, itemId, balance;

  if (Soomla && Soomla.storeInfo) {
    currencies = Soomla.storeInfo.getVirtualCurrencies();
    len = currencies.length || 0;
    cc.log("Checking " + len + " currency balances");

    for (i = 0; i < len; i += 1) {
      itemId = currencies[i].itemId;
      balance = Soomla.storeInventory.getItemBalance(itemId);
      cc.log("User has " + balance + " of " + itemId);
    }
  }
};

//
// ###   App.isInitialLaunch
//
// Returns true if this is the first time the app is being launched. It determines this based on whether the `uuid` key exists within local storage. Deleting this key will essentially reset the app into thinking it's the first run.
//
// Must be called before `App.getUUID()`, which creates the `uuid` key.
//
App.isInitialLaunch = function() {
  var v, key;

  /* Test local storage. */
  key = "testItem";
  v = "xyz";
  cc.sys.localStorage.setItem(key, v);
  if (cc.sys.localStorage.getItem(key) !== v) {
    cc.log("ERROR: Local storage test failed");
    this._localStorage = false;
    return true;
  } else {
    cc.log("Local storage test succeeded");
    cc.sys.localStorage.removeItem(key);
    this._localStorage = true;
  }

  /* Determine if initial launch. */
  v = cc.sys.localStorage.getItem("uuid");
  return (typeof v === "undefined" || v === null || v === "");
};

//
// ###  App.onInitialLaunch
//
// Called on the App's first launch. Used to set initial balances of virtual economy currencies.
//
App.onInitialLaunch = function() {
  var i,
    itemId,
    balance,
    initialBalances = App.config["economy-plugin"]["initial-balances"],
    currencies,
    len = 0,
    allZero = true;

  /* Get the currencies. */
  if (Soomla && Soomla.storeInfo) {
    currencies = Soomla.storeInfo.getVirtualCurrencies();
    len = currencies.length || 0;
  }

  /* Determine if inventory is all at zero. */
  for (i = 0; i < len; i += 1) {
    itemId = currencies[i].itemId;
    balance = Soomla.storeInventory.getItemBalance(itemId);
    if (balance > 0) {
      cc.log("User has " + balance + " of " + itemId);
      allZero = false;
      break;
    }
  }

  /* Set initial balances. */
  if (allZero) {
    for (i = 0; i < len; i += 1) {
      itemId = currencies[i].itemId;
      balance = (initialBalances ? initialBalances[itemId] : 0);
      cc.log("Setting initial balance " + balance + " for " + itemId);
      Soomla.storeInventory.giveItem(itemId, balance);
    }
  }
};

//
// ###  App.getUUID
//
// Gets or creates a unique identifier for the current device.
//
App.getUUID = function(length) {
  if (typeof this._uuid === "undefined") {
    this._uuid = cc.sys.localStorage.getItem("uuid") || "";

    if (this._uuid.length === 0) {
      length = length || 32;
      for (var i = 0; i < length; i += 1) {
        this._uuid += Math.floor(Math.random() * 16).toString(16);
      }
      cc.sys.localStorage.setItem("uuid", this._uuid);
      /*cc.log("Generated UUID for the first time: " + this._uuid);*/
    } else {
      /*cc.log("Already had UUID: " + this._uuid);*/
    }
  }
  return this._uuid;
};

//
// ###  App.getHttpQueryParams
//
// Return the HTTP query's GET parameters.
//
App.getHttpQueryParams = function() {
  var loc,
    i,
    len,
    query,
    aux;

  if (typeof this._GET === "undefined") {
    this._GET = {};
    loc = window.location.toString() || "";

    if (loc.indexOf("?") !== -1) {
      query = loc.replace(/^.*?\?/, "").split("&");
      len = query.length;

      for (i = 0; i < len; i += 1) {
        aux = decodeURIComponent(query[i]).split("=");
        this._GET[aux[0]] = aux[1];
      }
    }
  }

  return this._GET;
};

//
// ###  App.requestUrl
//
// Load the given URL and call the callback when finished. If the third parameter `binary` is truthy, then use binary transfer mode.
//
// Uses `XMLHttpRequest` (implemented natively on native platforms).
//
App.requestUrl = function(url, callback, binary) {
  var x,
    loc,
    pos;
  if (XMLHttpRequest) {
    x = new XMLHttpRequest();
  } else {
    x = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (url.indexOf("//") < 0) {
    cc.log("window.location = " + window.location);
    loc = window.location.toString() || "";
    pos = loc.indexOf("?");
    if (pos > 0) {
      loc = loc.substring(0, pos);
    }
    url = loc + url;
  }
  cc.log("Requesting URL: " + url);

  if (x != null) {
    if (!binary && x.overrideMimeType) {
      x.overrideMimeType("text/xml");
    }

    /* Call the callback when done. */
    x.onreadystatechange = function () {
      if (x.readyState == 4) { /* 4 == done. */
        var res = (binary ? x.response : x.responseText);
        callback(res || "", x.statusText);
        if (res) {
          x = null;
        }
      }
    };

    /* Make the request. */
    x.open("GET", url, true);
    if (binary) {
      x.responseType = "arraybuffer";
    }
    x.send(null);
  } else {
    throw "Your browser does not support XMLHTTPRequest.";
  }
};

//
// ###  App.between
//
// Return the substring of `string` between `prefix` and `suffix`.
//
App.between = function(string, prefix, suffix, start) {
  var startPos = string.indexOf(prefix, start || 0),
    endPos = string.indexOf(suffix, startPos + prefix.length);
  if (startPos > 0 && endPos > 0) {
    startPos += prefix.length;
    return string.substring(startPos, endPos);
  }
  return "";
};

//
// ###  App.insert
//
// Return the given `string` with `insert` inserted after `after`.
//
App.insert = function(string, after, insert) {
  var pos = string.indexOf(after) + after.length;
  if (pos > 0) {
    return string.substr(0, pos) + insert + string.substr(pos);
  }
  return string;
};

//
// ###  App.encodeURIComponents
//
// Return a URI string with components encoded given an object of associated key value pairs to encode.
//
App.encodeURIComponents = function(o) {
  var ret = "",
    count = 0;
  for (var key in o) {
    if (typeof o[key] !== "undefined") {
      ret += (count === 0 ? "?" : "&") +
        key + "=" + encodeURIComponent(o[key]);
      count += 1;
    }
  }
  return ret;
};

//
// ###  App.loadImage
//
// Loads an image asynchronously from the given URL, calling the callback when finished. Different for HTML5 versus native.
//
App.loadImage = function(url, callback) {
  if (url.indexOf("://") == 0) {
    cc.log("Not a URL: " + url);
    return;
  }

  /* Load image HTML5. */
  if (typeof Image !== "undefined") {
    var image = new Image();
    /* If anonymous doesn't work, try: */
    /* url = App.insert(url, "://", "www.corsproxy.com/"); */
    image.crossOrigin = "Anonymous";
    image.src = url;

    /*cc.log("Loading image: " + url);*/
    image.addEventListener("load", function(){
      this.removeEventListener("load", arguments.callee, false);
      if (image.width && image.height) {
        cc.textureCache.cacheImage(url, image);
        if (typeof callback === "function") {
          callback(url);
        }
      }
    }, false);

  /* Load image native. */
  } else {
    /*cc.log("Loading image from raw data: " + url);*/
    this.requestUrl(url, function(response, status) {
      var bytes = new Uint8Array(response);
      App.addImageData(url, bytes);
      if (typeof callback === "function") {
        callback(url);
      }
    }, true);
  }
};

//
// ###  App.boot
//
// Boot method. Different for HTML5 versus native. Called at the end of this file.
//
App.boot = function(global) {
  if (this.isHtml5()) {
    App.setCanvasSize();
    App.setCanvasSize(document.getElementById("gameDiv"),
      this._origCanvasSize.width, this._origCanvasSize.height);
  } else {
    /* Ensure plugin is defined. */
    global.plugin = global.plugin || {};
    if (!global.plugin.PluginManager) {
      global.plugin.PluginManager = {
        getInstance:function(){return {loadPlugin:function(){}}}
      };
    }

    /* Implement timers. */
    require("js/lib/timers.js");
    this.timerLoop = makeWindowTimer(global, function(ms){});
    cc.director.getScheduler().scheduleCallbackForTarget(this, this.timerLoop);

    /* Location. */
    require("js/ConfigServer.js");
    if (!global.location) {
      global.location = "http://" + App.serverAddress +
        (App.serverPort ? ":" + App.serverPort : "") + "/";
      /*cc.log("Got location: " + window.location);*/
    }
    if (!global.navigator) {
      /*http://stackoverflow.com/questions/8579019/how-to-get-the-user-agent-on-ios */
      global.navigator = {
        userAgent: "Apple-iPhone5C1/1001.525"
      };
    }

    /* Add some functionality to cc. */
    if (typeof cc.DEGREES_TO_RADIANS === "undefined") {
      cc.PI = Math.PI;
      cc.RAD = cc.PI / 180;
      cc.DEG = 180 / cc.PI;
      cc.DEGREES_TO_RADIANS = function(angle) {return angle * cc.RAD;};
      cc.RADIANS_TO_DEGREES = function(angle) {return angle * cc.DEG;};
    }
  }

  /*setTimeout(function(){cc.log("Confirmed setTimeout() works");}, 3333);*/

  /* Embed the equivalent of main.js for faster loading. */
  cc.game.onStart = function(){
    App.main();
  };

  /*
  Native client boot happens like this:
    1. cc.game.run() ->
    2. cc.game.prepare() ->
    3. jsb.js ->
    4. jsb_cocos2d.js, etc...
  */
  cc.game.run();
};

//
// ###  App.main
//
// The main method. Called by `cc.game.onStart`.
//
App.main = function() {
  var i,
    sheets,
    cacher,
    dirs = [],
    initialLaunch = this.isInitialLaunch();

  this.getUUID();
  this.loadSoundEnabled();

  cc.defineGetterSetter(App, "winSize", App.getWinSize);
  cc.director.setDisplayStats(cc.game.config[cc.game.CONFIG_KEY.showFPS]);

  if (this.isHtml5()) {
    cc.loader.loadJs("js/lib", ["screenfull.js"], function() {
      document.addEventListener(screenfull.raw.fullscreenchange, App.onWindowSizeChanged);
    });

    cc.view.setDesignResolutionSize(
      App.winSize.width,
      App.winSize.height,
      cc.ResolutionPolicy.NO_BORDER
    );
    cc.view.resizeWithBrowserSize(true);
    /*window.addEventListener("resize", App.onWindowSizeChanged, false);*/

    App.addImageData = function() {};
  } else {
    App.config["font"] = "res/" + App.config["font"] + ".ttf";
  }

  /* Load plugins. */
  this.getAnalyticsPlugin();
  this.getAdsPlugin();
  this.getSocialPlugin();
  this.getEconomyPlugin();

  /* Handle initial launch. */
  /* Call after loading plugins so initial currency balances can be set. */
  /*cc.log("Initial launch: " + initialLaunch);*/
  if (initialLaunch) {
    this.onInitialLaunch();
  }

  cc.director.setAnimationInterval(1.0 / this.getTargetFrameRate());
  cc.log(App.winSize.width + " x " + App.winSize.height
    + ", resource dir: " + App.getResourceDir()
    + ", language: " + App.getLanguageCode()
    + ", " + parseInt(1.0 / cc.director.getAnimationInterval()) + " fps");

  /* Show currency balances. */
  this.logCurrencyBalances();

  /* Preload. */
  if (this.isHtml5()) {
    cc.LoaderScene.preload(App.getResourcesToPreload(), App.runInitialScene, this);
  }
  else {
    App.runInitialScene();
  }
};

//
// ###  Boot
//
// Call `App.boot` passing in the global variable.
//
App.boot(this);
