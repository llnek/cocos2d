<!-- Picks Section -->
<section id="toppicks" class="toppicks-section dark-section">
  <div class="container">

    <h1 class="special-heading dark-special">Top Picks</h1>

    <div class="row">

      <div class="col-md-6 col-md-offset-3">
      <div class="owl-carousel">

        <#list body.picks as pick>
        <#if pick.status = true >

          <div>
            <a href="${pick.uri}"><span class="game-logo">
              <img src="/public/ig/res/${pick.gamedir}/${pick.image}"
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

    </div>


  </div>
</section>
<!-- End of Picks Section -->






