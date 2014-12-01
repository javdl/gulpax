/*
*		Async load cross-site CSS, mostly interesting for production.
*
*		Used as shown by Critical CSS loader by Addy Osmani
*		
*		https://github.com/addyosmani/critical
*		https://github.com/addyosmani/critical-path-css-demo
*/

function loadCSS(e,t,n){'use strict';var i=window.document.createElement('link');var o=t||window.document.getElementsByTagName('script')[0];i.rel='stylesheet';i.href=e;i.media='only x';o.parentNode.insertBefore(i,o);setTimeout(function(){i.media=n||'all';});}
    loadCSS('/styles/site.css');