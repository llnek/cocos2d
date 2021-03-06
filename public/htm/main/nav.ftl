<!-- Navigation Bar -->
<div class="navbar navbar-fixed-top dark-menu">
  <div class="container">

    <div class="navbar-header">
      <a class="navbar-brand" href="/">
        <img class="logo" src="/public/res/main/ZotohLab_black_x100.png" alt="logo"></a>
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>


    <nav id="main-nav"
      <#if profile.session = true>
      class="navbar-collapse collapse user-in-session"
      <#else>
      class="navbar-collapse collapse"
      </#if>
      role="navigation">

      <ul class="nav navbar-nav">
        <li class="active"><a href="/">Home</a></li>
        <li><a href="/games">Browse</a></li>
        <li><a href="/games/toppicks">Top Picks</a></li>
        <li><a id="logout-mitem" href="/users/logout">Logout</a></li>
        <li><a id="login-mitem" href="/users/login">Login</a></li>
        <li><a id="rego-mitem" href="/users/register">Register</a></li>
      </ul>
    </nav><!--/.navbar-collapse -->

  </div>
</div>
<!-- End of Navigation Bar -->

