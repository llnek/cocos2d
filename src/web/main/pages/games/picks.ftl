
<section id="picks-list" class="picks-list-section">
  <div class="container">
    <h1 class="box-heading">Top Picks</h1>

      <div class="owl-carousel">

        <#list body.picks as pick>
        <#if pick.status = true >

          <div>
            <a href="${pick.uri}"><span class="game-logo">
              <img src="/public/ig/media/${pick.gamedir}/${pick.image}"
                <#if pick.image_alt??>
                    alt="${pick.image_alt}"
                <#else>
                    alt="${pick.name}"
                </#if>
                /></span>
            </a>
          </div>

        </#if>
        </#list>

      </div>

  </div>
</section>


