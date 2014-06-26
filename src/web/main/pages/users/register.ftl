
<section id="register-section" class="intro-section login-section">

  <div class="container">
  <div class="row">
  <div class="col-lg-4 col-lg-offset-4">

    <form id="register-form" action="/wsapi/VpAaaGit-ncGP-4cPa-AAvQ-ti7YVpztQVan" method="POST" role="form">
    <fieldset>
      <input data-name="nonce_token" type="hidden" name="nonce_token" value="1"></input>
      <input data-name="csrf_token" type="hidden" name="csrf_token" value=""></input>

      <div class="login-feedback">
      </div>

      <div class="form-group">
        <input data-name= "principal" type="text" class="form-control" name="rego-user" placeholder="Enter UserId" autofocus></input>
      </div>

      <div class="form-group">
        <input data-name= "email" type="email" class="form-control" name="rego-email" placeholder="Enter email"></input>
      </div>

      <div class="form-group">
        <input data-name="credential" type="password" class="form-control" name="rego-password" placeholder="Password"></input>
      </div>

      <div class="form-group">
        <input data-name="captcha" type="text" class="form-control" name="rego-captcha" placeholder="What is 8 x 4 ?" ></input>
      </div>

      <button id="register-send" type="submit" class="btn btn-default">REGISTER</button>
    </fieldset>
    </form>

  </div>
  </div>
  </div>


</section>



<#include "/main/footer.ftl" >

<#import "/main/menu.ftl" as my>
<@my.btmenu_index />

