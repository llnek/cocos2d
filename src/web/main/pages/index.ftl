
<section id="intro" class="intro-section">
  <div class="container">
    <div class="content-wrapper">
      <div class="intro-content">
        <a href="/games/toppicks">
          <img class= "main-door open-door" id="door1" src="/public/ig/media/main/doors/magenta_door.png" alt="entry"/>
          <img class= "main-door" id="door2" src="/public/ig/media/main/doors/amber_door.png" alt="entry"/>
          <img class= "main-door" id="door3" src="/public/ig/media/main/doors/blue_door.png" alt="entry"/>
          <img class= "main-door" id="door4" src="/public/ig/media/main/doors/green_door.png" alt="entry"/>
          <img class= "main-door" id="door5" src="/public/ig/media/main/doors/purple_door.png" alt="entry"/>
          <img class= "main-door" id="door6" src="/public/ig/media/main/doors/red_door.png" alt="entry"/>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- register+login -->
<div class="fs-overlay fs-overlay-slidedown">
  <button type="button" class="fs-overlay-close">Close</button>
  <section class="login-section">
    <div class="container">
    <div class="row">
    <div class="col-lg-4 col-lg-offset-4">

    <form id="register-form" action="/users/register" method="POST" role="form">
    <fieldset>
      <input type="hidden" name="csrf_token" value=""></input>

      <div class="form-group">
        <input type="email" class="form-control" name="rego-email" placeholder="Enter email" autofocus></input>
      </div>

      <div class="form-group">
        <input type="password" class="form-control" name="rego-password" placeholder="Password"></input>
      </div>

      <div class="form-group">
        <input type="text" class="form-control" name="rego-captcha" placeholder="What is 8 x 4 ?" ></input>
      </div>

      <button id="register-send" type="submit" class="btn btn-default">REGISTER</button>
    </fieldset>
    </form>

    <form id="login-form" action="/users/login" method="POST" role="form">
    <fieldset>
      <input type="hidden" name="csrf_token" value=""></input>
      <input type="hidden" name="ref" value=""></input>

      <div class="form-group">
        <input type="email" class="form-control" name="login-email" placeholder="Enter email" autofocus></input>
      </div>

      <div class="form-group">
        <input type="password" class="form-control" name="login-password" placeholder="Password"></input>
      </div>

      <div class="forg-pass pull-left">
      <a id="forgot-password" href="javascript:void(0)">Forgot your password?</a>
      </div>
      <button id="login-send" type="submit" class="btn btn-default">LOGIN</button>
    </fieldset>
    </form>

    <form id="forgot-form" action="/users/forgotpassword" method="POST" role="form">
    <fieldset>
        <div class="forg-pass pull-left">
          <a id="backto-login" href="javascript:void(0)">&laquo; Back to login screen</a>
        </div>
        <input type="hidden" name="csrf_token" value=""></input>
        <div class="form-group">
          <input type="email" class="form-control" name="forgot-email" placeholder="Enter email" autofocus></input>
        </div>

        <div class="form-group">
          <input type="text" class="form-control" name="rego-captcha" placeholder="What is 3 x 6 ?" ></input>
        </div>

        <button id="forgot-send" type="submit" class="btn btn-default">FORGOT PASSWORD</button>
    </fieldset>
    </form>

  </div>
  </div>
  </div>




  </section>

</div>


<#include "/main/footer.ftl" >

<#import "/main/menu.ftl" as my>
<@my.btmenu_index />

