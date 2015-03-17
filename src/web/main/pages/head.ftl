<!--  head stuff ================================================================= -->


<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta charset="${encoding}" />

<#list metatags?keys as mt>
<meta name="${mt}" ${metatags[mt]}/>
</#list>

<link rel="shortcut icon" type="image/png" href="/public/ig/res/main/favicon.png" />
<title>${title}</title>

<link href='//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,600,700,800,300' rel='stylesheet' />
<link href='//fonts.googleapis.com/css?family=Titillium+Web:400,400italic,600,600italic,700,700italic,300italic,300,200italic,200' rel='stylesheet' />
<link href='//fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' />
<link href='//fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' />
<!--
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" />
<link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet" />
-->

<link rel="stylesheet" href="/public/vendors/font-awesome/css/font-awesome.min.css" />

<#list stylesheets as csspath>
<link rel="stylesheet" href="${csspath}"/>
</#list>

<link rel="stylesheet" href="/public/vendors/codrops/modal-win.css"/>
<link rel="stylesheet" href="/public/vendors/codrops/btmenu.css"/>
<link rel="stylesheet" href="/public/styles/main/site.css"/>

<script src="/public/vendors/modernizr/modernizr.custom.js"></script>
<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
  <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
  <script src="/public/vendors/airve/respond.min.js"></script>
<![endif]-->
<script type="text/javascript" async="" src="//www.google-analytics.com/ga.js"></script>
<script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', '']);
    _gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = '//www.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
</script>

