
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

//////////////////////////////////////////////////////////////////////////////
//
bks.SystemUtils = {

  initDropper: function(options) {
    options.dropSpeed=1000;
    options.dropper = ccsx.createTimer(sh.main,
                                       options.dropRate / options.dropSpeed);
  }


};



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF


