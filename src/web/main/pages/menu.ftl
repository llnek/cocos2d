<!-- social icons =============================================== -->

<#macro btmenu_social>
  <ul>
    <li><a href="http://www.twitter.com/zotohlab" class="bt-icon fa fa-twitter ">Twitter</a></li>
    <li><a href="https://plus.google.com/zotohlab" class="bt-icon fa fa-google-plus ">Google+</a></li>
    <li><a href="http://www.facebook.com/pages/zotohlab/1" class="bt-icon fa fa-facebook ">Facebook</a></li>
  </ul>
</#macro>

<!-- index page =============================================== -->

<#macro btmenu_index>

<nav id="bt-menu" class="bt-menu">
  <a href="#" class="bt-menu-trigger"><span>Menu</span></a>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/games/toppicks">Top Picks</a></li>
    <li><a href="/games">Browse</a></li>
    <li><a id="logout-btn" href="javascript:void(0)">Logout</a></li>
    <li><a id="login-btn" href="/users/login">Login</a></li>
    <li><a id="register-btn" href="/users/register">Register</a></li>
  </ul>
  <@btmenu_social />
</nav>

</#macro>

<!-- browse page =============================================== -->

<#macro btmenu_games>

<nav id="bt-menu" class="bt-menu">
  <a href="#" class="bt-menu-trigger"><span>Menu</span></a>
  <ul>
    <li><a href="/games/toppicks">Top Picks</a></li>
    <li><a href="/games">Browse</a></li>
    <li><a href="/">Home</a></li>
  </ul>
  <@btmenu_social />
</nav>

</#macro>


<!-- arena page =============================================== -->

<#macro btmenu_arena>

<nav id="bt-menu" class="bt-menu">
  <a href="#" class="bt-menu-trigger"><span>Menu</span></a>
  <ul>
    <li><a href="/games/toppicks">Top Picks</a></li>
    <li><a href="/games">Browse</a></li>
    <li><a href="/">Home</a></li>
  </ul>
  <@btmenu_social />
</nav>

</#macro>




