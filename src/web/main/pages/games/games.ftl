<!-- Browse Games Section -->
<section id="games" class="games-section light-section dark-content">

  <div class="container">

    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <h1 class="special-heading dark-special">Games</h1>
      </div>
    </div>


    <div class="main">
      <ul id="og-grid" class="og-grid">

      <#list body.games as gg >
      <#if gg.status = true >

        <li class="games-item visible-item" data-id="">
        <a href="${gg.uri}" data-largesrc="${gg.uri}"
          data-category="" data-date="" data-title="" data-description="">
            <img src="/public/ig/res/${gg.gamedir}/${gg.image}" 
                 <#if gg.image_alt?? >
                      alt= "${gg.image_alt}"
                 <#else>
                      alt= "${gg.name}"
                 </#if>
            />
            <div class="overlay-content">
              <h4>${gg.name}</h4>
              <p>${gg.description}</p>
            </div>
          </a>
        </li>

      </#if>
      </#list>

      </ul>
    </div>
  </div>
</section>
<!-- End of games Section -->




