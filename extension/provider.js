import './gtag.js';

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// IMPORTANT: 'check_protocol' must be false for extensions
gtag('config', 'G-95WR054WF1', {
  'check_protocol': false
});
