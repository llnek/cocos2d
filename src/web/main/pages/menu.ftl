
<#macro btmenu_social>
  <ul>
    <li><a href="http://www.twitter.com/zotohlabs" class="bt-icon fa fa-twitter ">Twitter</a></li>
    <li><a href="https://plus.google.com/zotohlabs" class="bt-icon fa fa-google-plus ">Google+</a></li>
    <li><a href="http://www.facebook.com/pages/zotohlabs/1" class="bt-icon fa fa-facebook ">Facebook</a></li>
  </ul>
</#macro>

<#macro btmenu_index>

<nav id="bt-menu" class="bt-menu">
  <a href="#" class="bt-menu-trigger"><span>Menu</span></a>
  <ul>
    <li><a href="#">Login</a></li>
    <li><a href="#">Register</a></li>
  </ul>
  <@btmenu_social />
</nav>

</#macro>

<#macro btmenu_games>

<nav id="bt-menu" class="bt-menu">
  <a href="#" class="bt-menu-trigger"><span>Menu</span></a>
  <ul>
    <li><a href="#">Top Picks</a></li>
    <li><a href="#">Latest</a></li>
    <li><a href="/">Home</a></li>
  </ul>
  <@btmenu_social />
</nav>

</#macro>

