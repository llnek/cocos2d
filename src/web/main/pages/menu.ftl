
<#macro btmenu_social>
  <ul>
    <li><a href="http://www.twitter.com/zotohlab" class="bt-icon fa fa-twitter ">Twitter</a></li>
    <li><a href="https://plus.google.com/zotohlab" class="bt-icon fa fa-google-plus ">Google+</a></li>
    <li><a href="http://www.facebook.com/pages/zotohlab/1" class="bt-icon fa fa-facebook ">Facebook</a></li>
  </ul>
</#macro>

<#macro btmenu_index>

<nav id="bt-menu" class="bt-menu">
  <a href="#" class="bt-menu-trigger"><span>Menu</span></a>
  <ul>
    <li><a href="/users/login">Login</a></li>
    <li><a href="/users/register">Register</a></li>
  </ul>
  <@btmenu_social />
</nav>

</#macro>

<#macro btmenu_games>

<nav id="bt-menu" class="bt-menu">
  <a href="#" class="bt-menu-trigger"><span>Menu</span></a>
  <ul>
    <li><a href="/games/toppicks">Top Picks</a></li>
    <li><a href="/games">Latest</a></li>
    <li><a href="/">Home</a></li>
  </ul>
  <@btmenu_social />
</nav>

</#macro>

