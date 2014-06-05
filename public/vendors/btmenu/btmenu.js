/*??
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
 ??*/
(function(undef) { var global = this;

function borderMenu() {

  // courtesy of http://tympanus.net/codrops/

  var eventtype = jQuery.browser.mobile ? 'touchstart' : 'click',
  menu = document.getElementById( 'bt-menu' ),
  trigger = menu.querySelector( 'a.bt-menu-trigger' ),
  overlay = document.createElement('div'),
  resetMenu = function() {
    classie.remove( menu, 'bt-menu-open' );
    classie.add( menu, 'bt-menu-close' );
  },
  closeClickFn = function(ev) {
    resetMenu();
    overlay.removeEventListener( eventtype, closeClickFn );
  };

  classie.add(overlay, 'bt-overlay');
  menu.appendChild( overlay );

  trigger.addEventListener( eventtype, function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    if ( classie.has( menu, 'bt-menu-open' )) {
      resetMenu();
    } else {
      classie.remove( menu, 'bt-menu-close' );
      classie.add( menu, 'bt-menu-open' );
      overlay.addEventListener( eventtype, closeClickFn );
    }
  });

}

global.AnimatedBorderMenu = { InitBorderMenu: borderMenu };

}).call(this);



