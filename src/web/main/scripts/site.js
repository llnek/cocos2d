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
(function(undef){ "use strict"; var global = this, _ = global._ , $ = global.jQuery;
var skaro = global.SkaroJS;

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

function initCarousel() {
  // games list carousel
  $('.carousel').slick({
    infinite: true,
    slidesToShow: 2,//4,
    slidesToScroll: 1,
    slide: 'div',
    dots: true,
    easing: 'easeInOutQuart',
    speed: 800,
    responsive: [{
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        easing: 'easeInOutQuart',
        speed: 800,
      }
    },{
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        easing: 'easeInOutQuart',
        speed: 800,
      }
    },{
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        easing: 'easeInOutQuart',
        speed: 800,
      }
    }]
  });

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


  initCarousel();
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

}).call(this);


