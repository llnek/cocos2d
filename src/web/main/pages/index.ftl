
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

    <form id="register-form" action="/" method="POST" role="form">
      <input type="hidden" name="csrf" value=""></input>

      <div class="form-group">
        <!--
        <label for="useremail">Email address</label>
        -->
        <input type="email" class="form-control" id="useremail" placeholder="Enter email"></input>
      </div>

      <div class="form-group">
        <!--
        <label for="userpassword">Password</label>
        -->
        <input type="password" class="form-control" id="userpassword" placeholder="Password"></input>
      </div>

      <button type="submit" class="btn btn-default">REGISTER</button>
    </form>

    <form id="login-form" action="/" method="POST" role="form">
      <input type="hidden" name="csrf" value=""></input>
      <input type="hidden" name="ref" value=""></input>

      <div class="form-group">
        <!--
        <label for="useremail">Email address</label>
        -->
        <input type="email" class="form-control" id="useremail" placeholder="Enter email"></input>
      </div>

      <div class="form-group">
        <!--
        <label for="userpassword">Password</label>
        -->
        <input type="password" class="form-control" id="userpassword" placeholder="Password"></input>
      </div>

      <div class="forg-pass">
      <a href="http://wallbase.cc/user/forgot_pass" class="fp-link">Forgot your password?</a>
      </div>
      <button type="submit" class="btn btn-default">LOGIN</button>
    </form>

    <form id="forgot-form" action="/" method="POST" role="form">
      <div class="back2login"><a href="" class="fp-link">&laquo; back to login screen</a></div>

      <input type="hidden" name="csrf" value=""></input>
      <div class="form-group">
        <label for="useremail">Email address</label>
        <input type="email" class="form-control" id="useremail" placeholder="Enter email"></input>
      </div>

      <div class="text">
        An e-mail will be sent to the address you provided when you registered to wallbase. Please follow the instructions in the message.
      </div>

      <button type="submit" class="btn btn-default">SUBMIT</button>
    </form>

  </section>

</div>


<#include "/main/footer.ftl" >

<#import "/main/menu.ftl" as my>
<@my.btmenu_index />

