
<section id="login-section" class="intro-section login-section">

  <div class="container">
  <div class="row">
  <div class="col-lg-4 col-lg-offset-4">

    <form id="login-form" action="/wsapi/cVQYtatp-p7nG-4cut-vzpt-nv7niYa7VGvV" method="POST" role="form">
        <fieldset>
          <input data-name="nonce_token" type="hidden" name="nonce_token" value="1"></input>
          <input data-name="csrf_token" type="hidden" name="csrf_token" value=""></input>
          <input data-name="xref" type="hidden" name="xref" value=""></input>

          <div class="form-group">
            <input data-name="principal" type="email" class="form-control" name="login-email" placeholder="Enter email" autofocus></input>
          </div>

          <div class="form-group">
            <input data-name="credential" type="password" class="form-control" name="login-password" placeholder="Password"></input>
          </div>

          <div class="forg-pass pull-left">
          <a id="forgot-password" href="javascript:void(0)">Forgot your password?</a>
          </div>
          <button id="login-send" type="submit" class="btn btn-default">LOGIN</button>
        </fieldset>
    </form>

  </div>
  </div>
  </div>


</section>



<#include "/main/footer.ftl" >

<#import "/main/menu.ftl" as my>
<@my.btmenu_index />
