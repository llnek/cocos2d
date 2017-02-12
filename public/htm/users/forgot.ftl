<!-- Forgot Section -->
<section id="forgotpwd" class="acctxxxx-section dark-section">
  <div class="container">

      <div class="col-md-4 col-md-offset-4">

        <div class="acctxxxx-result"></div>

        <form id="forgotpwd_form" class="acctxxxx-form" action="/wsapi/2284fc6c40d14e528fb820ee0f7a992f" method="POST" role="form">

          <input data-name="csrf_token" type="hidden" name="csrf_token" value="${body.csrf}"></input>

          <div class="form-group">
            <input data-name="email" type="email" class="form-control input-lg" name="forgot-email" placeholder="Enter email" autofocus></input>
          </div>

          <div class="form-group">
            <input data-name="captcha" type="text" class="form-control input-lg" name="forgot-captcha" placeholder="What is 3 x 6 ?" ></input>
          </div>

          <div class="form-group">
            <button id="forgot-send" type="submit" class="btn btn-big btn-outline-white">Forgot Password</button>
          </div>

          <div class="pull-left">
            <a id="backto-login" href="javascript:void(0)">&laquo; Back to login screen</a>
          </div>
        </form>


      </div>
    </div>
  </div>
</section>
<!-- End of Forgot Section -->


