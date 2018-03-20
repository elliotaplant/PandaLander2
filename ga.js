let keys = {};
try {
  keys = require('./keys.json');
} catch (e) {
  console.log('No keys file found. Assuming keys are in process.ENV');
}
const uuid = process.env.GOOGLE_ANALYTICS_ID || keys.googleAnalyticsId;

const gaTag = `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${uuid}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${uuid}');
</script>`

const tagManagerHead = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5XDCV4K');</script>
<!-- End Google Tag Manager -->
`;

const tagManagerBody = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5XDCV4K"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`

module.exports = {
  gaTag,
  tagManagerHead,
  tagManagerBody,
};
