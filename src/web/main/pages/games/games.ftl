
<section id="games-list" class="games-list-section">
  <div class="container">
    <h1 class="box-heading">Latest</h1>

    <ul>

    <#list body.games as gg >
    <#if gg.status = true >
    <li class="game-item">

      <div class="row">
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
          <div class="ratings">
              <p class="pull-right">15 reviews</p>
              <p>
                  <span class="glyphicon glyphicon-star"></span>
                  <span class="glyphicon glyphicon-star"></span>
                  <span class="glyphicon glyphicon-star"></span>
                  <span class="glyphicon glyphicon-star"></span>
                  <span class="glyphicon glyphicon-star"></span>
              </p>
          </div>
          <div class="caption">
            <h3>${gg.name}</h3>
            <p>${gg.desc}</p>
            <a class="btn btn-primary" href="${gg.uri}"><i class="fa fa-play"></i>&nbsp; Play</a>
          </div>
        </div>
      </div>

    </li>
    </#if>
    </#list>

    </ul>

  </div>
</section>

<#include "/main/footer.ftl" >

<#import "/main/menu.ftl" as my>
<@my.btmenu_games />

