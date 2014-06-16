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
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.
 ??*/
(function(document, undef){ "use strict"; var global = this, _ = global._ , $ = global.jQuery;
var skaro = global.SkaroJS;

/////////////////////////////////////////////

///////////////////////////////////////////
//
function paintDoors() {
  var intro= $('#intro');
  var len= 6, ptr=1;
  if (intro && intro.length > 0) {} else { return; }
  global.setInterval(function() {
    $('#intro img').removeClass('open-door');
    ++ptr;
    if (ptr > len) { ptr=1; }
    $('#intro #door' + ptr).addClass('open-door');
  }, 1500);
}

function initOverlay() {
  var regBtn= $('#register-btn'),
  loginBtn= $('#login-btn' ),
  regForm=$('#register-form'),
  loginForm=$('#login-form'),
  overlay = document.querySelector( 'div.fs-overlay' ),
  closeBtn = $( 'button.fs-overlay-close' ),
  transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
  },
  transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
  support = { transitions : Modernizr.csstransitions };

  function toggleOverlay() {
    if ( classie.has( overlay, 'open' )) {
      classie.remove( overlay, 'open' );
      classie.add( overlay, 'close' );
      var onEndTransitionFn = function(ev) {
        if (support.transitions) {
          if (ev.propertyName !== 'visibility') { return; }
          this.removeEventListener( transEndEventName, onEndTransitionFn );
        }
        classie.remove( overlay, 'close' );
      };
      if (support.transitions) {
        overlay.addEventListener( transEndEventName, onEndTransitionFn );
      } else {
        onEndTransitionFn();
      }
    }
    else if( !classie.has( overlay, 'close' ) ) {
      classie.add( overlay, 'open' );
    }
  }
  function onklick(reg,login,z) {
    if (z) {
      AnimatedBorderMenu.FinzBorderMenu();
    }
    loginForm.css('display', login);
    regForm.css('display', reg);
    toggleOverlay();
  }

  loginBtn.on( 'click', function() {
    onklick('none','block',true);
  });
  regBtn.on( 'click', function() {
    onklick('block','none',true);
  });
  closeBtn.on('click', function() {
    onklick('none','none',false);
  });
}

function initCarousel() {
  var el = $("#picks-list .owl-carousel");
  if (el === null || el.length === 0) {} else {

    el.owlCarousel({
      singleItem: true,
      items: 1,
      navigation: true,
      navigationText: ["<", ">"]
    });

  }
}

function boot() {

  var em = $('html');
  if (skaro.isSafari() ) { em.addClass('is-safari'); } else {
    em.removeClass('is-safari');
  };

  $('.navbar-toggle').on('click', function(){
    var em2= $('.navbar-collapse');
    var em = $('.navbar');
    if ( ! em2.hasClass("in")) {
      em.addClass('darken-menu');
    }
    else
    if ( em2.hasClass("in")) {
      em.removeClass('darken-menu');
    }
  });

  $('.nav a').on('click', function () {
    $('#main-nav').removeClass('in').addClass('collapse');
  });

  $('.XXXnavbar-nav li a').on('click', function(evt) {
    var place = $(this).attr('href');
    var off = $(place).offset().top;
    $('html, body').animate({ scrollTop: off }, 1200, 'easeInOutCubic');
    skaro.pde(evt);
  });

  // minimize and darken the menu bar
  $('body').waypoint( function (dir) {
    $('.navbar').toggleClass('minified dark-menu');
  }, { offset: '-200px' });


  AnimatedBorderMenu.InitBorderMenu();
  initCarousel();
  initOverlay();
  paintDoors();

  // show "back to top" button
  $(document).scroll( function () {
    var headerHt = $('#welcome').outerHeight();
    var pos = $(document).scrollTop();
    var em= $('.scrolltotop');
    if (pos >= headerHt - 100){
      em.addClass('show-to-top');
    } else {
      em.removeClass('show-to-top');
    }
  });

  // scroll on top
  $('.scrolltotop, .XXXnavbar-brand').on('click', function(e) {
    $('html, body').animate({scrollTop: '0'}, 1200, 'easeInOutCubic');
    skaro.pde(e);
  });



}

$(document).ready(boot);

}).call(this,document);


