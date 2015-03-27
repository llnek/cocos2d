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

define("cocos2d/site", ['global/window', 'cherimoia/skarojs','cherimoia/caesar'],

  function (global, sjs, caesar) { "use strict";
    var ModalWindow=global.ModalWindow,
    document=global.document,
    undef,
    $= global.jQuery;

    /////////////////////////////////////////////
    //
    function toggleNavMenuItems() {
      var uid= $.cookie('__u982i');
      if (sjs.isString(uid) && uid.length > 0) {
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
    function paintDoors() {
      var doors= $('#intro img')
      if (doors === null || doors.length <= 0) { return; }
      var len= doors.length, ptr=0;

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
    function initOverlay() {
      var regBtn= $('#rego-mitem'),
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

      forgPwd.on('click',function(){
        document.location.href= document.location.origin + "/users/forgotlogin";
      });
      backLogin.on('click',function(){
        document.location.href= document.location.origin + "/users/login";
      });

      function packFormAsJson(formObj) {
        var nonce= $('#pg-footer').attr('data-ref') || '';
        return sjs.R.reduce(function(memo, obj) {
          var pobj=$(obj);
          var dn= pobj.attr("data-name");
          var dv= pobj.val() || '';
          if ( (dn === 'credential'|| dn=== 'principal') && dv && nonce) {
            dv= caesar.encrypt(sjs.base64_encode(dv), 13);
          }
          memo[dn] = dv;
          return memo;
        }, {}, $('input', formObj));
      }

      function postToServer(formId,ok,error, uid,pwd) {
        var form= $(formId),
        extras={},
        json= packFormAsJson(form),
        url= form.attr('action');
        if (sjs.echt(uid)) {
          var rc= sjs.toBasicAuthHeader(
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

      regoSend.on('click',function(evt) {
        var fb= $('#register .acctxxx-result');
        sjs.pde(evt);
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
        postToServer('#register_form',ok,ecb);
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
        var fb= $('#login .acctxxxx-result');
        sjs.pde(evt);
        function ecb(xhr) {
          fb.empty().html('<p>Login failed.  Did you mistype?</p>');
          fb.show();
        }
        function ok() {
          document.location.href= document.location.origin + "/games/toppicks";
        }
        fb.hide();
        postToServer('#login_form', ok, ecb, 'login-email','login-password');
      });

      forgSend.on('click',function(evt){
        var fb= $('#forgotpwd .acctxxxx-result');
        sjs.pde(evt);
        function ecb(xhr) {
          fb.empty().html('<p>Failed to send message.  Please try again later.</p>');
          fb.show();
        }
        function ok() {
          fb.empty().html('<p>Message sent.</p>');
          fb.show();
        }
        fb.hide();
        postToServer('#forgotpwd_form', ok, ecb);
      });
    }

    function initCarousel() {
      var el = $("#toppicks .owl-carousel");
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
      if (sjs.isSafari() ) { em.addClass('is-safari'); } else {
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

      $('.intro-section .scroll-more').click(function(evt) {
        var place = $('body').children('section').eq(1);
        // var offsetTop = $('.navbar').outerHeight();
        $('html, body').animate({scrollTop: $(place).offset().top}, 1200, 'easeInOutCubic');
        sjs.pde(evt);
      });

      // minimize and darken the menu bar
      $('body').waypoint( function (dir) {
        $('.navbar').toggleClass('minified dark-menu');
      }, { offset: '-200px' });

      initCarousel();
      initOverlay();
      paintDoors();

      // show "back to top" button
      $(document).scroll( function () {
        var headerHt = $('#intro').outerHeight();
        var pos = $(document).scrollTop();
        var em= $('.scrolltotop');
        if (pos >= headerHt - 100){
          em.addClass('show-to-top');
        } else {
          em.removeClass('show-to-top');
        }
      });

      toggleNavMenuItems();
    }

    $(document).ready(boot);

});

supplicate('cocos2d/site');

