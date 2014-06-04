
<section id="games-list" class="games-list-section">
  <div class="container">
    <h1 class="box-heading">Top Picks</h1>

      <div class="owl-carousel">

        <#list body.picks as pick>

          <div>
            <a href="index.html#"><span class="game-logo">
              <img src="/public/ig/media/${pick.gamedir}/${pick.image}"
                <#if pick.image_alt??>
                    alt="${pick.image_alt}"
                <#else>
                    alt="${pick.name}"
                </#if>
                /></span>
            </a>
          </div>

        </#list>

      </div>

  </div>
</section>

<#include "/main/footer.ftl" >

<#import "/main/menu.ftl" as my>
<@my.btmenu_games />

