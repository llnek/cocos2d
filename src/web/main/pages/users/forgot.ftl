
<section id="forgotlogin-section" class="intro-section login-section">

  <div class="container">
  <div class="row">
  <div class="col-lg-4 col-lg-offset-4">

    <form id="forgot-form" action="/wsapi/zYiYPtaY-Pvz7-4t7c-iaVY-vcaunnGtpVcP" method="POST" role="form">
        <fieldset>

            <input data-name="csrf_token" type="hidden" name="csrf_token" value=""></input>

            <div class="login-feedback">
            </div>

            <div class="login-actions pull-left">
              <a id="backto-login" href="javascript:void(0)">&laquo; Back to login screen</a>
            </div>
            <div class="form-group">
              <input data-name="email" type="email" class="form-control" name="forgot-email" placeholder="Enter email" autofocus></input>
            </div>

            <div class="form-group">
              <input data-name="captcha" type="text" class="form-control" name="forgot-captcha" placeholder="What is 3 x 6 ?" ></input>
            </div>

            <button id="forgot-send" type="submit" class="btn btn-default">FORGOT PASSWORD</button>
        </fieldset>
    </form>

  </div>
  </div>
  </div>


</section>



<#include "/main/footer.ftl" >

<#import "/main/menu.ftl" as my>
<@my.btmenu_index />

