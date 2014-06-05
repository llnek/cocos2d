
<section id="games-list" class="games-list-section">
  <div class="container">
    <h1 class="box-heading">Latest</h1>

    <#list body.games as gg >
    <#if gg.status = true >

      <div class="row game-item">
        <div class="col-lg-7 col-md-7">
          <a href="${gg.uri}">
            <img class="img-responsive"
                 src="/public/ig/media/${gg.gamedir}/${gg.image}"
                 <#if gg.image_alt?? >
                      alt= "${gg.image_alt}"
                 <#else>
                      alt= "${gg.name}"
                 </#if>
            ></a>
        </div>
        <div class="col-lg-5 col-md-5">
          <h3>${gg.name}</h3>
          <p>${gg.desc}</p>
          <a class="btn btn-primary" href="${gg.uri}"><i class="fa fa-play"></i>&nbsp; Play</a>
        </div>
      </div>

    </#if>
    </#list>

  </div>
</section>

<#include "/main/footer.ftl" >

<#import "/main/menu.ftl" as my>
<@my.btmenu_games />

