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
</script>
`;

module.exports = gaTag;
