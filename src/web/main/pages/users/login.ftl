<!-- Login Section -->
<section id="login" class="acctxxxx-section dark-content light-section">
  <div class="container">

      <div class="col-md-4 col-md-offset-4">

        <div class="acctxxxx-result"></div>


        <form id="login_form" class="acctxxxx-form" action="/wsapi/4447e5ad-ec05-4e69-a8c7-d696f2450f70" method="POST" role="form">
          <input data-name="nonce_token" type="hidden" name="nonce_token" value="1"></input>
          <input data-name="csrf_token" type="hidden" name="csrf_token" value="${body.csrf}"></input>
          <input data-name="xref" type="hidden" name="xref" value=""></input>

          <div class="form-group">
            <input data-name="principal" type="text" class="form-control input-lg" name="login-user" placeholder="Enter UserId" autofocus></input>
          </div>

          <div class="form-group">
            <input data-name="credential" type="password" class="form-control input-lg" name="login-password" placeholder="Password"></input>
          </div>

          <div class="form-group">
            <button id="login-send" type="submit" class="btn btn-outline-white btn-big">Login</button>
          </div>

          <div class="pull-left">
            <a id="forgot-password" href="javascript:void(0)">Forgot your password?</a>
          </div>
        </form>


      </div>
    </div>
  </div>
</section>
<!-- End of Login Section -->


