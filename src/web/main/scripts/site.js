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
var ModalWindow=global.ModalWindow;
var skaro = global.SkaroJS;

/////////////////////////////////////////////
//
function toggleMenuItems() {
  var uid= $.cookie('__u982i');
  if (_.isString(uid) && uid.length > 0) {
    $('#register-btn').parent().hide();
    $('#login-btn').parent().hide();
    $('#logout-btn').parent().show();
  } else {
    $('#register-btn').parent().show();
    $('#login-btn').parent().show();
    $('#logout-btn').parent().hide();
  }
}

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
  logoutBtn= $('#logout-btn' ),
  loginBtn= $('#login-btn' ),
  regForm=$('#register-form'),
  loginForm=$('#login-form'),
  forgForm=$('#forgot-form'),
  forgPwd=$('#forgot-password'),
  backLogin=$('#backto-login'),
  regoSend=$('#register-send'),
  loginSend=$('#login-send'),
  forgSend=$('#forgot-send'),
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
  function onklick(reg,login,forgot,finz,toggle) {
    if (finz) {
      AnimatedBorderMenu.FinzBorderMenu();
    }
    loginForm.css('display', login);
    regForm.css('display', reg);
    forgForm.css('display', forgot);
    if (toggle===false) {} else {
      toggleOverlay();
    }
  }

  /*
  loginBtn.on( 'click', function() {
    onklick('none','block','none',true);
  });
  regBtn.on( 'click', function() {
    onklick('block','none','none',true);
  });
  closeBtn.on('click', function() {
    onklick('none','none','none',false);
  });
  */

  backLogin.on('click',function(){
    document.location.href= document.location.origin + "/users/login";
  });
  forgPwd.on('click',function(){
    document.location.href= document.location.origin + "/users/forgotlogin";
  });

  function packFormAsJson(formObj) {
    var nonce= $('#pgfooter').attr('data-ref') || '';
    return _.reduce($('input',formObj), function(memo, obj) {
      var pobj=$(obj);
      var dn= pobj.attr("data-name");
      var dv= pobj.val() || '';
      if ( (dn === 'credential'|| dn=== 'principal') && dv && nonce) {
        dv= SkaroJS.caesarEncrypt(SkaroJS.base64_encode(dv), 13);
      }
      memo[dn] = dv;
      return memo;
    }, {});
  }

  function postToServer(formId,ok,error, uid,pwd) {
    var form= $(formId),
    extras={},
    json= packFormAsJson(form),
    url= form.attr('action');
    if (SkaroJS.echt(uid)) {
      var rc= SkaroJS.toBasicAuthHeader(
                $('input[name="'+uid+'"]', form).val(),
                $('input[name="'+pwd+'"]', form).val());
      extras[rc[0]] = rc[1];
    }
    $.ajax(url,{
      contentType: 'application/json',
      headers: extras,
      data: JSON.stringify(json),
      type: 'POST',
      dataType: 'json'

    }).done(ok).fail(error);

  }

  function getToServer(url,ok,error) {
    $.ajax(url,{
    }).done(ok).fail(error);
  }

  regoSend.on('click',function(evt){
    var fb= $('.login-feedback');
    skaro.pde(evt);
    function ecb(xhr) {
      var reason= "Bad request.";
      if (xhr.status === 409) {
        reason= "Account with same id already exist.";
      }
      var xxx= '<p>Account creation failed: ' + reason + '</p>';
      fb.empty().html(xxx);
      fb.show();
    }
    function ok() {
      var xxx= '<div class="login-actions"><p>Account created successfully.<br/>'+
        '<a href="/users/login">Continue to login?</a>' +
        '</p></div>';
      fb.empty().html(xxx);
      fb.show();
    }
    postToServer('#register-form',ok,ecb);
  });

  logoutBtn.on('click',function(evt){
    function ecb(xhr) {
      alert('Logout failed');
    }
    function ok() {
      document.location.href= document.location.origin;
    }
    getToServer('/users/logout', ok, ecb);
  });

  loginSend.on('click',function(evt){
    var fb= $('.login-feedback');
    skaro.pde(evt);
    function ecb(xhr) {
      fb.empty().html('<p>Login failed.  Did you mistype?</p>');
      fb.show();
    }
    function ok() {
      document.location.href= document.location.origin + "/games/toppicks";
    }
    fb.hide();
    postToServer('#login-form', ok, ecb, 'login-email','login-password');
  });

  forgSend.on('click',function(evt){
    var fb= $('.login-feedback');
    skaro.pde(evt);
    function ecb(xhr) {
      fb.empty().html('<p>Failed to send message.  Please try again later.</p>');
      fb.show();
    }
    function ok() {
      fb.empty().html('<p>Message sent.</p>');
      fb.show();
    }
    fb.hide();
    postToServer('#forgot-form', ok, ecb);
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


  toggleMenuItems();
}

$(document).ready(boot);

}).call(this,document);


