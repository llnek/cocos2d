
<!-- Register Section -->
<section id="register" class="acctxxxx-section dark-content light-section">
  <div class="container">

      <div class="col-md-4 col-md-offset-4">

        <div class="acctxxx-result"></div>


        <form id="register_form" class="acctxxxx-form" action="/wsapi/479beddc-f21d-48c6-a19f-66f317d10f14" method="POST" role="form">

          <input data-name="nonce_token" type="hidden" name="nonce_token" value="1"></input>
          <input data-name="csrf_token" type="hidden" name="csrf_token" value="${body.csrf}"></input>

          <div class="form-group">
            <input data-name= "principal" type="text" class="form-control input-lg" name="rego-user" placeholder="Enter UserId" autofocus></input>
          </div>

          <div class="form-group">
            <input data-name= "email" type="email" class="form-control input-lg" name="rego-email" placeholder="Enter email"></input>
          </div>

          <div class="form-group">
            <input data-name="credential" type="password" class="form-control input-lg" name="rego-password" placeholder="Password"></input>
          </div>

          <div class="form-group">
            <input data-name="captcha" type="text" class="form-control input-lg" name="rego-captcha" placeholder="What is 8 x 4 ?" ></input>
          </div>

          <div class="form-group">
            <button id="register-send" type="submit" class="btn btn-big btn-outline-white">Register</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</section>
<!-- End of Register Section -->


