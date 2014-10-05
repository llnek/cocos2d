/*
 *
 *  name: dbg
 *
 *  description: A bad ass little console utility, check the README for deets
 *
 *  license: MIT-style license
 *
 *  author: Amadeus Demarzi
 *
 *  provides: window.dbg
 *
 */
(function(undef) { "use strict"; var global=this, gDefine=global.define;

  // Get the real console or set to null for easy boolean checks
  var realConsole = global.console || null,

  // Backup / Disabled Lambda
  fn = function(){},
  DBG= {},

  // Supported console methods
  methodNames = ['log', 'error', 'warn', 'info', 'count', 'debug', 'profileEnd', 'trace', 'dir', 'dirxml', 'assert', 'time', 'profile', 'timeEnd', 'group', 'groupEnd'],

  // Disabled Console
  disabledConsole = {

    // Enables dbg, if it exists, otherwise it just provides disabled
    enable: function(quiet){
      DBG = realConsole ? realConsole : disabledConsole;
    },

    // Disable dbg
    disable: function(){
      DBG = disabledConsole;
    }

  }, name, i;

  // Setup disabled console and provide fallbacks on the real console
  for (i = 0; i < methodNames.length;i++){
    name = methodNames[i];
    disabledConsole[name] = fn;
    if (realConsole && !realConsole[name])
      realConsole[name] = fn;
  }

  // Add enable/disable methods
  if (realConsole) {
    realConsole.disable = disabledConsole.disable;
    realConsole.enable = disabledConsole.enable;
  }

  // Enable dbg
  disabledConsole.enable();

//kenl
//exports to multiple environments
if(typeof gDefine === 'function' && gDefine.amd){ //AMD
    gDefine('console/dbg',[], function() { return DBG; });
} else if (typeof module !== 'undefined' && module.exports){ //node
    module.exports = DBG;
} else { //browser
    global['dbg'] = DBG;
}

}).call(this);



