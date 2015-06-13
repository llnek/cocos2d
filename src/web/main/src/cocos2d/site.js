// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

"use strict";/**
 * @requires global/window
 * @requires cherimoia/skaro
 * @requires cherimoia/caesar
 * @module cocos2d/site
 */

import global from 'global/window';
import sjs from 'cherimoia/skaro';
import caesar from 'cherimoia/caesar';


let ModalWindow=global.ModalWindow,
document=global.document,
undef,
$= global.jQuery;

/////////////////////////////////////////////
//
const toggleNavMenuItems = () => {
  const uid= $.cookie('__u982i');
  if (sjs.isstr(uid) && uid.length > 0) {
    $('#rego-mitem').parent().hide();
    $('#login-mitem').parent().hide();
    $('#logout-mitem').parent().show();
  } else {
    $('#rego-mitem').parent().show();
    $('#login-mitem').parent().show();
    $('#logout-mitem').parent().hide();
  }
}

///////////////////////////////////////////
//
const paintDoors = () => {
  const doors= $('#intro img');
  if (doors === null ||
      doors.length <= 0) {
    return;
  }
  let len= doors.length,
  ptr=0;

  $(doors[0]).addClass('open-door');

  global.setInterval(function() {
    doors.removeClass('open-door');
    ++ptr;
    if (ptr >= len) { ptr=0; }
    $(doors[ptr]).addClass('open-door');
  }, 1500);
}

///////////////////////////////////////////
//
const initOverlay = () => {
  let regBtn= $('#rego-mitem'),
  logoutBtn= $('#logout-mitem' ),
  loginBtn= $('#login-mitem' ),

  regForm=$('#register_form'),
  loginForm=$('#login_form'),
  forgForm=$('#forgotpwd_form'),

  forgPwd=$('#forgot-password'),
  backLogin=$('#backto-login'),

  regoSend=$('#register-send'),
  loginSend=$('#login-send'),
  forgSend=$('#forgot-send');

  forgPwd.on('click', () => {
    document.location.href= document.location.origin + "/users/forgotlogin";
  });
  backLogin.on('click', () => {
    document.location.href= document.location.origin + "/users/login";
  });

  const packFormAsJson= (formObj) => {
    const nonce= $('#pg-footer').attr('data-ref') || '';
    return sjs.R.reduce((memo, obj) => {
      let pobj=$(obj),
      dn= pobj.attr("data-name"),
      dv= pobj.val() || '';
      if ( (dn === 'credential'|| dn=== 'principal') && dv && nonce) {
        dv= caesar.encrypt(sjs.base64_encode(dv), 13);
      }
      memo[dn] = dv;
      return memo;
    }, {}, $('input', formObj));
  }

  const postToServer = (formId,ok,error, uid,pwd) => {
    let form= $(formId),
    extras={},
    json= packFormAsJson(form),
    url= form.attr('action');
    if (sjs.echt(uid)) {
      let rc= sjs.toBasicAuthHeader(
                $('input[name="'+uid+'"]', form).val(),
                $('input[name="'+pwd+'"]', form).val());
      extras[rc[0]] = rc[1];
    }
    $.ajax(url,{
      contentType: 'application/json',
      headers: extras,
      data: sjs.jsonfy(json),
      type: 'POST',
      dataType: 'json'

    }).done(ok).fail(error);

  }

  const getToServer = (url,ok,error) => {
    $.ajax(url,{
    }).done(ok).fail(error);
  }

  regoSend.on('click', (evt) => {
    let fb= $('#register .acctxxx-result');
    sjs.pde(evt);
    const ecb = (xhr) => {
      let reason= "Bad request.";
      if (xhr.status === 409) {
        reason= "Account with same id already exist.";
      }
      let xxx= '<p>Account creation failed: ' + reason + '</p>';
      fb.empty().html(xxx);
      fb.show();
    }
    const ok = () => {
      let xxx= '<div class="login-actions"><p>Account created successfully.<br/>'+
        '<a href="/users/login">Continue to login?</a>' +
        '</p></div>';
      fb.empty().html(xxx);
      fb.show();
    }
    postToServer('#register_form',ok,ecb);
  });

  logoutBtn.on('click', (evt) => {
    const ecb = (xhr) => {
      alert('Logout failed');
    }
    const ok = () => {
      document.location.href= document.location.origin;
    }
    getToServer('/users/logout', ok, ecb);
  });

  loginSend.on('click', (evt) => {
    let fb= $('#login .acctxxxx-result');
    sjs.pde(evt);
    const ecb = (xhr) => {
      fb.empty().html('<p>Login failed.  Did you mistype?</p>');
      fb.show();
    }
    const ok = () => {
      document.location.href= document.location.origin + "/games/toppicks";
    }
    fb.hide();
    postToServer('#login_form', ok, ecb, 'login-email','login-password');
  });

  forgSend.on('click', (evt) => {
    let fb= $('#forgotpwd .acctxxxx-result');
    sjs.pde(evt);
    const ecb = (xhr) => {
      fb.empty().html('<p>Failed to send message.  Please try again later.</p>');
      fb.show();
    }
    const ok = () => {
      fb.empty().html('<p>Message sent.</p>');
      fb.show();
    }
    fb.hide();
    postToServer('#forgotpwd_form', ok, ecb);
  });
}

const initCarousel = () => {
  const el = $("#toppicks .owl-carousel");
  if (el === null || el.length === 0) {} else {

    el.owlCarousel({
      singleItem: true,
      items: 1,
      navigation: true,
      navigationText: ["<", ">"]
    });

  }
}

const boot = () => {

  let em = $('html');
  if (sjs.isSafari() ) { em.addClass('is-safari'); } else {
    em.removeClass('is-safari');
  };

  $('.navbar-toggle').on('click', () => {
    let em2= $('.navbar-collapse'),
    em = $('.navbar');
    if ( ! em2.hasClass("in")) {
      em.addClass('darken-menu');
    }
    else
    if ( em2.hasClass("in")) {
      em.removeClass('darken-menu');
    }
  });

  $('.nav a').on('click', () => {
    $('#main-nav').removeClass('in').addClass('collapse');
  });

  $('.intro-section .scroll-more').click((evt) => {
    let place = $('body').children('section').eq(1);
    // var offsetTop = $('.navbar').outerHeight();
    $('html, body').animate({scrollTop: $(place).offset().top}, 1200, 'easeInOutCubic');
    sjs.pde(evt);
  });

  // minimize and darken the menu bar
  $('body').waypoint( (dir) => {
    $('.navbar').toggleClass('minified dark-menu');
  }, { offset: '-200px' });

  initCarousel();
  initOverlay();
  paintDoors();

  // show "back to top" button
  $(document).scroll( () => {
    let headerHt = $('#intro').outerHeight(),
    pos = $(document).scrollTop(),
    em= $('.scrolltotop');
    if (pos >= headerHt - 100){
      em.addClass('show-to-top');
    } else {
      em.removeClass('show-to-top');
    }
  });

  toggleNavMenuItems();
}

$(document).ready(boot);




