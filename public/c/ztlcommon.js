//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,w=Object.keys,_=i.bind,j=function(n){return n instanceof j?n:this instanceof j?void(this._wrapped=n):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.6.0";var A=j.each=j.forEach=function(n,t,e){if(null==n)return n;if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a=j.keys(n),u=0,i=a.length;i>u;u++)if(t.call(e,n[a[u]],a[u],n)===r)return;return n};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var O="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},j.find=j.detect=function(n,t,r){var e;return k(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var k=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:k(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,j.property(t))},j.where=function(n,t){return j.filter(n,j.matches(t))},j.findWhere=function(n,t){return j.find(n,j.matches(t))},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);var e=-1/0,u=-1/0;return A(n,function(n,i,a){var o=t?t.call(r,n,i,a):n;o>u&&(e=n,u=o)}),e},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);var e=1/0,u=1/0;return A(n,function(n,i,a){var o=t?t.call(r,n,i,a):n;u>o&&(e=n,u=o)}),e},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e},j.sample=function(n,t,r){return null==t||r?(n.length!==+n.length&&(n=j.values(n)),n[j.random(n.length-1)]):j.shuffle(n).slice(0,Math.max(0,t))};var E=function(n){return null==n?j.identity:j.isFunction(n)?n:j.property(n)};j.sortBy=function(n,t,r){return t=E(t),j.pluck(j.map(n,function(n,e,u){return{value:n,index:e,criteria:t.call(r,n,e,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=E(r),A(t,function(i,a){var o=r.call(e,i,a,t);n(u,o,i)}),u}};j.groupBy=F(function(n,t,r){j.has(n,t)?n[t].push(r):n[t]=[r]}),j.indexBy=F(function(n,t,r){n[t]=r}),j.countBy=F(function(n,t){j.has(n,t)?n[t]++:n[t]=1}),j.sortedIndex=function(n,t,r,e){r=E(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:0>t?[]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var M=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):M(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return M(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.partition=function(n,t){var r=[],e=[];return A(n,function(n){(t(n)?r:e).push(n)}),[r,e]},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.contains(t,n)})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var R=function(){};j.bind=function(n,t){var r,e;if(_&&n.bind===_)return _.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));R.prototype=n.prototype;var u=new R;R.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){for(var r=0,e=t.slice(),u=0,i=e.length;i>u;u++)e[u]===j&&(e[u]=arguments[r++]);for(;r<arguments.length;)e.push(arguments[r++]);return n.apply(this,e)}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:j.now(),a=null,i=n.apply(e,u),e=u=null};return function(){var l=j.now();o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u),e=u=null):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u,i,a,o,c=function(){var l=j.now()-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u),i=u=null))};return function(){i=this,u=arguments,a=j.now();var l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u),i=u=null),o}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return j.partial(t,n)},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=function(n){if(!j.isObject(n))return[];if(w)return w(n);var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},j.pairs=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},j.invert=function(n){for(var t={},r=j.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o)&&"constructor"in n&&"constructor"in t)return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.constant=function(n){return function(){return n}},j.property=function(n){return function(t){return t[n]}},j.matches=function(n){return function(t){if(t===n)return!0;for(var r in n)if(n[r]!==t[r])return!1;return!0}},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},j.now=Date.now||function(){return(new Date).getTime()};var T={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};T.unescape=j.invert(T.escape);var I={escape:new RegExp("["+j.keys(T.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(T.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(I[n],function(t){return T[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}}),"function"==typeof define&&define.amd&&define("underscore",[],function(){return j})}).call(this);
// # sourceMappingURL=underscore-min.map
/*! @source http://purl.eligrey.com/github/l10n.js/blob/master/l10n.js*/
(function(){"use strict";var q="undefined",a="string",m=window.navigator,o=String,l=Object.prototype.hasOwnProperty,z={},B={},t=!1,k=!0,s=/^\s*application\/(?:vnd\.oftn\.|x-)?l10n\+json\s*(?:$|;)/i,p,A="locale",j="defaultLocale",r="toLocaleString",e="toLowerCase",x=Array.prototype.indexOf||function(E){var C=this.length,D=0;for(;D<C;D++){if(D in this&&this[D]===E){return D}}return -1},b=function(C){var i=new p();i.open("GET",C,t);i.send(null);if(i.status!==200){setTimeout(function(){var D=new Error("Unable to load localization data: "+C);D.name="Localization Error";throw D},0);return{}}else{return JSON.parse(i.responseText)}},n=o[r]=function(D){if(arguments.length>0&&typeof D!=="number"){if(typeof D===a){n(b(D))}else{if(D===t){B={}}else{var i,E,C;for(i in D){if(l.call(D,i)){E=D[i];i=i[e]();if(!(i in B)||E===t){B[i]={}}if(E===t){continue}if(typeof E===a){if(o[A][e]().indexOf(i)===0){E=b(E)}else{if(!(i in z)){z[i]=[]}z[i].push(E);continue}}for(C in E){if(l.call(E,C)){B[i][C]=E[C]}}}}}}}return Function.prototype[r].apply(o,arguments)},h=function(E){var D=z[E],F=0,C=D.length,G;for(;F<C;F++){G={};G[E]=b(D[F]);n(G)}delete z[E]},u,w=o.prototype[r]=function(){if(typeof this===q){return this}var E=u,G=o[E?j:A],H=G[e]().split("-"),F=H.length,D=this.valueOf(),C;u=t;do{C=H.slice(0,F).join("-");if(C in z){h(C)}if(C in B&&D in B[C]){return B[C][D]}}while(F-->1);if(!E&&o[j]){u=k;return w.call(D)}return D};if(typeof XMLHttpRequest===q&&typeof ActiveXObject!==q){var f=ActiveXObject;p=function(){try{return new f("Msxml2.XMLHTTP.6.0")}catch(C){}try{return new f("Msxml2.XMLHTTP.3.0")}catch(i){}try{return new f("Msxml2.XMLHTTP")}catch(D){}throw new Error("XMLHttpRequest not supported by this browser.")}}else{p=XMLHttpRequest}o[j]=o[j]||"";o[A]=m&&(m.language||m.userLanguage)||"";if(typeof document!==q){var y=document.getElementsByTagName("link"),v=y.length,g;while(v--){var d=y[v],c=(d.getAttribute("rel")||"")[e]().split(/\s+/);if(s.test(d.type)){if(x.call(c,"localizations")!==-1){n(d.getAttribute("href"))}else{if(x.call(c,"localization")!==-1){g={};g[(d.getAttribute("hreflang")||"")[e]()]=d.getAttribute("href");n(g)}}}}}}());
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (root, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else {
    var mustache = {};
    factory(mustache);
    if (typeof define === "function" && define.amd) {
      define(mustache); // AMD
    } else {
      root.Mustache = mustache; // <script>
    }
  }
}(this, function (mustache) {

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var RegExp_test = RegExp.prototype.test;
  function testRegExp(re, string) {
    return RegExp_test.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var Object_toString = Object.prototype.toString;
  var isArray = Array.isArray || function (object) {
    return Object_toString.call(object) === '[object Array]';
  };

  function isFunction(object) {
    return typeof object === 'function';
  }

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function escapeTags(tags) {
    if (!isArray(tags) || tags.length !== 2) {
      throw new Error('Invalid tags: ' + tags);
    }

    return [
      new RegExp(escapeRegExp(tags[0]) + "\\s*"),
      new RegExp("\\s*" + escapeRegExp(tags[1]))
    ];
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate(template, tags) {
    tags = tags || mustache.tags;
    template = template || '';

    if (typeof tags === 'string') {
      tags = tags.split(spaceRe);
    }

    var tagRes = escapeTags(tags);
    var scanner = new Scanner(template);

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length) {
          delete tokens[spaces.pop()];
        }
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(tagRes[0]);
      if (value) {
        for (var i = 0, len = value.length; i < len; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push(['text', chr, start, start + 1]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(tagRes[0])) break;
      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(tagRes[1]);
      } else if (type === '{') {
        value = scanner.scanUntil(new RegExp('\\s*' + escapeRegExp('}' + tags[1])));
        scanner.scan(curlyRe);
        scanner.scanUntil(tagRes[1]);
        type = '&';
      } else {
        value = scanner.scanUntil(tagRes[1]);
      }

      // Match the closing tag.
      if (!scanner.scan(tagRes[1])) {
        throw new Error('Unclosed tag at ' + scanner.pos);
      }

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection) {
          throw new Error('Unopened section "' + value + '" at ' + start);
        }
        if (openSection[1] !== value) {
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
        }
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        tagRes = escapeTags(tags = value.split(spaceRe));
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();
    if (openSection) {
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
    }

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (match && match.index === 0) {
      var string = match[0];
      this.tail = this.tail.substring(string.length);
      this.pos += string.length;
      return string;
    }

    return "";
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var index = this.tail.search(re), match;

    switch (index) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context(view, parentContext) {
    this.view = view == null ? {} : view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function (name) {
    var value;
    if (name in this.cache) {
      value = this.cache[name];
    } else {
      var context = this;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;

          var names = name.split('.'), i = 0;
          while (value != null && i < names.length) {
            value = value[names[i++]];
          }
        } else {
          value = context.view[name];
        }

        if (value != null) break;

        context = context.parent;
      }

      this.cache[name] = value;
    }

    if (isFunction(value)) {
      value = value.call(this.view);
    }

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer() {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null) {
      tokens = cache[template] = parseTemplate(template, tags);
    }

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function (tokens, context, partials, originalTemplate) {
    var buffer = '';

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    var self = this;
    function subRender(template) {
      return self.render(template, context, partials);
    }

    var token, value;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
        value = context.lookup(token[1]);
        if (!value) continue;

        if (isArray(value)) {
          for (var j = 0, jlen = value.length; j < jlen; ++j) {
            buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
          }
        } else if (typeof value === 'object' || typeof value === 'string') {
          buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
        } else if (isFunction(value)) {
          if (typeof originalTemplate !== 'string') {
            throw new Error('Cannot use higher-order sections without the original template');
          }

          // Extract the portion of the original template that the section contains.
          value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

          if (value != null) buffer += value;
        } else {
          buffer += this.renderTokens(token[4], context, partials, originalTemplate);
        }

        break;
      case '^':
        value = context.lookup(token[1]);

        // Use JavaScript's definition of falsy. Include empty arrays.
        // See https://github.com/janl/mustache.js/issues/186
        if (!value || (isArray(value) && value.length === 0)) {
          buffer += this.renderTokens(token[4], context, partials, originalTemplate);
        }

        break;
      case '>':
        if (!partials) continue;
        value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
        if (value != null) buffer += this.renderTokens(this.parse(value), context, partials, value);
        break;
      case '&':
        value = context.lookup(token[1]);
        if (value != null) buffer += value;
        break;
      case 'name':
        value = context.lookup(token[1]);
        if (value != null) buffer += mustache.escape(value);
        break;
      case 'text':
        buffer += token[1];
        break;
      }
    }

    return buffer;
  };

  mustache.name = "mustache.js";
  mustache.version = "0.8.1";
  mustache.tags = [ "{{", "}}" ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function (template, view, partials) {
    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  mustache.to_html = function (template, view, partials, send) {
    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));
/*
 *
 *	name: dbg
 *
 *	description: A bad ass little console utility, check the README for deets
 *
 *	license: MIT-style license
 *
 *	author: Amadeus Demarzi
 *
 *	provides: window.dbg
 *
 */

(function(){

	var global = this,

		// Get the real console or set to null for easy boolean checks
		realConsole = global.console || null,

		// Backup / Disabled Lambda
		fn = function(){},

		// Supported console methods
		methodNames = ['log', 'error', 'warn', 'info', 'count', 'debug', 'profileEnd', 'trace', 'dir', 'dirxml', 'assert', 'time', 'profile', 'timeEnd', 'group', 'groupEnd'],

		// Disabled Console
		disabledConsole = {

			// Enables dbg, if it exists, otherwise it just provides disabled
			enable: function(quiet){
				global.dbg = realConsole ? realConsole : disabledConsole;
			},

			// Disable dbg
			disable: function(){
				global.dbg = disabledConsole;
			}

		}, name, i;

	// Setup disabled console and provide fallbacks on the real console
	for (i = 0; i < methodNames.length;i++){
		name = methodNames[i];
		disabledConsole[name] = fn;
		if (realConsole && !realConsole[name])
			realConsole[name] = fn;
	}

	// Add enable/disable methods
	if (realConsole) {
		realConsole.disable = disabledConsole.disable;
		realConsole.enable = disabledConsole.enable;
	}

	// Enable dbg
	disabledConsole.enable();

}).call(this);
// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global= this, _ = global._ ;
var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
var ZEROS= "00000000000000000000000000000000";  //32

if (typeof HTMLElement === 'undefined') {
  // fake a type.
  global.HTMLElement= function HTMLElement() {};
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
function _echt (obj) {
  return typeof obj !== 'undefined' && obj !== null;
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// js inheritance - lifted from impact.js
//----------------------------------------------------------------------------
//
var monkeyPatch = function(prop) {
  var proto = this.prototype,
  name,
  parent = {};
  for ( name in prop ) {
    if ( typeof(proto[name]) == "function" &&
         typeof(prop[name]) == "function" &&
         fnTest.test(prop[name])) {
      parent[name] = proto[name]; // save original function
      proto[name] = (function(name, fn){
        return function() {
          var tmp = this._super;
          this._super = parent[name];
          var ret = fn.apply(this, arguments);
          this._super = tmp;
          return ret;
        };
      })( name, prop[name] );

    } else {
      proto[name] = prop[name];
    }
  }
};

var klass= function() {};
var initing = false;
klass.xtends = function (other) {
  var name, parent = this.prototype;
  initing = true;
  var proto = new this();
  initing = false;
  for (name in other ) {
    if ( typeof(parent[name]) === "function" &&
         typeof(other[name]) === "function" &&
         fnTest.test(other[name])) {
      proto[name] = (function(name, fn){
        return function() {
          var tmp = this._super;
          this._super = parent[name];
          var ret = fn.apply(this, arguments);
          this._super = tmp;
          return ret;
        };
      })( name, other[name] );

    } else {
      proto[name] = other[name];
    }
  }
  function Claxx() {
    if ( !initing ) {
      // If this class has a staticInstantiate method, invoke it
      // and check if we got something back. If not, the normal
      // constructor (ctor) is called.
      if (_echt(this.staticInstantiate)) {
        var obj = this.staticInstantiate.apply(this, arguments);
        if (_echt(obj)) { return obj; }
      }
      if (_echt(this.ctor)) {
        this.ctor.apply(this, arguments);
      }
    }
    return this;
  }

  Claxx.prototype = proto;
  Claxx.prototype.constructor = Claxx;
  Claxx.xtends = klass.xtends;
  Claxx.inject = monkeyPatch;

  return Claxx;
};


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var SkaroJS = {

  padstr: function(str, len, s) {
    return (len -= str.length) > 0
          ? (s = new Array(Math.ceil(len / s.length) + 1).join(s)).substr(0, s.length) + str + s.substr(0, len - s.length)
          : str;
  },

  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  randomRange: function(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  },

  //xmod: function(m, n) { return ((m % n) + n) % n; },
  xmod: function(x, N) {
    if (x < 0) {
     return x - (-1 * (Math.floor(-x / N) * N + N));
    } else {
      return x % N;
    }
  },

  makeArray: function(len, value) {
    var n, arr=[];
    for (n=0; n < len; ++n) { arr.push(value); }
    return arr;
  },

  echt: _echt,

  prettyNumber: function (num, digits) {
    var len= Number(num).toString().length;
    if (digits > 32) { throw new Error("Too many digits to prettify."); }
    var s= ZEROS.substring(0,digits);
    if (len < digits) {
      return s.substring(0, digits - len)  + num;
    } else {
      return "" + num;
    }
  },

  getWebSockProtocol: function() {
    return this.isSSL() ? "wss://" : "ws://";
  },

  nowMillis: function() {
    if (Date.now) {
      return Date.now();
    } else {
      return new Date().getMilliseconds();
    }
  },

  boolify: function(v) {
    return v ? true : false;
  },

  dropArgs: function(args,num) {
    return args.length > num ? Array.prototype.slice(args,num) : [];
  },

  isSSL: function() {
    if (window && window.location) {
      return window.location.protocol.indexOf('https') >= 0;
    } else {
      return undef;
    }
  },

  fmtUrl: function (scheme, uri) {
    if (window && window.location) {
      return scheme + window.location.host + uri;
    } else {
      return "";
    }
  },

  isMobile: function (navigator) {
    if (navigator) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    } else {
      return false;
    }
  },

  isSafari: function(navigator) {
    if (navigator) {
      return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    } else {
      return false;
    }
  },

  pde: function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  },

  randomSign: function() {
    if (this.rand(10) % 2 === 0) {
      return -1;
    } else {
      return 1;
    }
  },

  randArrayItem: function(arr) {
    return arr.length === 0 ? null : arr.length === 1 ? arr[0] : arr[ Math.floor(Math.random() * arr.length) ];
  },

  randPercentage: function() {
    var pc = [0.1,0.9,0.3,0.7,0.6,0.5,0.4,0.8,0.2];
    return this.randArrayItem(pc);
  },

  rand: function(limit) {
    return Math.floor(Math.random() * limit);
  },

  toBasicAuthHeader: function(user,pwd) {
    var str='Basic ' + this.base64_encode(""+user+":"+pwd);
    return [ 'Authorization', str ];
  },

  toUtf8: function(s) {
    return CryptoJS.enc.Utf8.stringify( CryptoJS.enc.Utf8.parse(s));
  },

  base64_encode: function(s) {
    return CryptoJS.enc.Base64.stringify( CryptoJS.enc.Utf8.parse(s));
  },

  base64_decode: function(s) {
    return CryptoJS.enc.Utf8.stringify( CryptoJS.enc.Base64.parse(s));
  },

  mergeEx:function(original,extended) {
    return this.merge(this.merge({},original), extended);
  },

  merge: function(original, extended) {
    for( var key in extended ) {
      var ext = extended[key];
      if ( typeof(ext) !== 'object' ||
           ext instanceof klass ||
           ext instanceof HTMLElement ||
           ext === null ) {
        original[key] = ext;
      } else {
        if( !original[key] || typeof(original[key]) !== 'object' ) {
          original[key] = (ext instanceof Array) ? [] : {};
        }
        this.merge( original[key], ext );
      }
    }
    return original;
  },

  removeFromArray: function(arr, item) {
    if (_.isArray(arr)) {
      var index = arr.indexOf(item);
      while (index !== -1) {
        arr.splice(index,1);
        index = arr.indexOf(item);
      }
    }
  },

  logger: global.dbg,
  loggr: global.dbg,
  Class : klass
};


/////////////////////////////////////////////////////////
//// export your stuff
/////////////////////////////////////////////////////////
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' &&  module.exports) {
    exports = module.exports = SkaroJS;
  }
  exports.SkaroJS= SkaroJS;
} else {
  global.SkaroJS= SkaroJS;
}

}).call(this);

(function(undef) { var global= this, _ = global._ , SkaroJS = global.SkaroJS;

 /////////////////////////////////////////////////////////////////////////////
 //
var VISCHS= " @N/\\Ri2}aP`(xeT4F3mt;8~%r0v:L5$+Z{'V)\"CKIc>z.*" +
            "fJEwSU7juYg<klO&1?[h9=n,yoQGsW]BMHpXb6A|D#q^_d!-";
var VISCHS_LEN=  VISCHS.length;

/////////////////////////////////////////////////////////////////////////////
 //
function identifyChar( pos) {
  return VISCHS.charAt(pos);
}

function locateChar(ch) {
  var n;
  for (n= 0; n < VISCHS_LEN; ++n) {
    if (ch === VISCHS.charAt(n)) {
      return n;
    }
  }
  return -1;
}

function slideForward(delta, cpos) {
  var ptr= cpos + delta;
  var np;
  if (ptr >= VISCHS_LEN) {
    np = ptr - VISCHS_LEN;
  } else {
    np = ptr;
  }
  return identifyChar(np);
}

function slideBack(delta, cpos) {
  var ptr= cpos - delta;
  var np;
  if (ptr < 0) {
    np= VISCHS_LEN + ptr;
  } else {
    np= ptr;
  }
  return identifyChar(np);
}

function shiftEnc( shiftpos, delta, cpos) {
  if (shiftpos < 0) {
    return slideForward( delta, cpos);
  } else {
    return slideBack( delta, cpos);
  }
}

function shiftDec( shiftpos, delta, cpos) {
  if ( shiftpos <  0) {
    return slideBack( delta, cpos);
  } else {
    return slideForward( delta, cpos);
  }
}

/////////////////////////////////////////////////////////////////////////////
 //
/* string */ function caesarEncrypt (str,shiftpos) {

  if (_.isString(str) && str.length > 0 && shiftpos !== 0) {} else {
    return "";
  }
  var delta =  SkaroJS.xmod(Math.abs(shiftpos), VISCHS_LEN);
  var p, ch, n, len= str.length;
  var out=[];
  for (n=0; n < len; ++n) {
    ch = str.charAt(n);
    p= locateChar(ch);
    if (p < 0) {
      //ch
    } else {
      ch= shiftEnc(shiftpos, delta, p);
    }
    out.push(ch);
  }
  return out.join('');
}

/////////////////////////////////////////////////////////////////////////////
 //
/* string */ function caesarDecrypt(cipherText,shiftpos) {

  if (_.isString(cipherText) && cipherText.length > 0 && shiftpos !== 0) {} else {
    return "";
  }
  var delta = SkaroJS.xmod(Math.abs(shiftpos),VISCHS_LEN);
  var ch, n, len= cipherText.length;
  var p, out=[];
  for (n=0; n < len; ++n) {
    ch= cipherText.charAt(n);
    p= locateChar(ch);
    if (p < 0) {
      //ch
    } else {
      ch= shiftDec(shiftpos, delta, p);
    }
    out.push(ch);
  }
  return out.join('');
}


SkaroJS.caesarDecrypt= caesarDecrypt;
SkaroJS.caesarEncrypt= caesarEncrypt;


}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global= this, _ = global._ ;

var ZotohLab = {
};


/////////////////////////////////////////////////////////
//// export your stuff
/////////////////////////////////////////////////////////
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' &&  module.exports) {
    exports = module.exports = ZotohLab;
  }
  exports.ZotohLab= ZotohLab;
} else {
  global.ZotohLab= ZotohLab;
}

}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global= this, _ = global._ ;

var Mustache=global.Mustache,
sjs= global.SkaroJS;


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
global.ZotohLab.Asterix = {

  l10nInit: function(table) {
    //String.defaultLocale="en-US";
    String.defaultLocale= this.lang;
    String.toLocaleString(table ||
                          this.xcfg.l10nTable);
    sjs.loggr.info("loaded l10n strings.  locale = " + String.locale);
  },

  l10n: function(s,pms) {
    var t= s.toLocaleString();
    return _.isObject(pms) ? Mustache.render(t,pms) : t;
  },

  lang: cc.sys.language || 'en',

  protos: {},
  pools: {},

  xcfg: undef,
  main: undef,

  fireEvent: function(topic, msg) {
    var r= cc.director.getRunningScene();
    if (r) {
      r.ebus.fire(topic,msg);
    }
  },

  // tests if 2 rectangles intersect.
  isIntersect: function(a1,a2) {
    return ! (a1.left > a2.right ||
              a2.left > a1.right ||
              a1.top < a2.bottom ||
              a2.top < a1.bottom);
  },

  outOfBound: function(a,B) {
    return a.right > B.right ||
           a.bottom < B.bottom ||
           a.left < 0 ||
           a.top > B.top;
  },

  calcXY: function(angle,hypot) {
  // quadrants =  3 | 4
  //             --------
  //              2 | 1
    var theta, q, x, y;
    if (angle >= 0 && angle <= 90) {
      theta = this.degToRad(90 - angle);
      x = Math.cos(theta);
      y = Math.sin(theta);
      q=1;
    }
    else
    if (angle >= 90 && angle <= 180 ) {
      theta = this.degToRad(angle - 90);
      x = Math.cos(theta);
      y =  - Math.sin(theta);
      q=2;
    }
    else
    if (angle >= 180 && angle <= 270) {
      theta = this.degToRad(270 - angle);
      x = - Math.cos(theta);
      y = - Math.sin(theta);
      q=3;
    }
    else
    if (angle >= 270 && angle <= 360) {
      theta= this.degToRad(angle - 270);
      x = - Math.cos(theta);
      y = Math.sin(theta);
      q=4;
    }
    else {
    }

    return [ x * hypot, y * hypot, q ];
  },

  XXcalcXY: function(angle,hypot) {
  // quadrants =  3 | 4
  //             --------
  //              2 | 1
    var theta, q, x, y;
    if (angle >= 90 && angle <= 180) {
      theta= this.degToRad(180 - angle);
      x = - Math.cos(theta);
      y = Math.sin(theta);
      q=2;
    }
    else
    if (angle >= 180 && angle <= 270) {
      theta = this.degToRad(angle - 180);
      x = - Math.cos(theta);
      y = - Math.sin(theta);
      q=3;
    }
    else
    if (angle >= 270 && angle <= 360) {
      theta = this.degToRad(360 - angle);
      x = Math.cos(theta);
      y = - Math.sin(theta);
      q=4;
    } else {
      theta = this.degToRad(angle);
      x = Math.cos(theta);
      y = Math.sin(theta);
      q=1;
    }
    return [ x * hypot, y * hypot, q ];
  },

  normalizeDeg: function(deg) {
    if (deg > 360) { return deg % 360; }
    else if (deg < 0) { return 360 + deg % 360; }
    else { return deg; }
  },

  radToDeg: function(rad) {
    return 180 * rad / Math.PI;
  },

  degToRad: function(deg) {
    return deg * Math.PI / 180;
  },

  getImagePath: function(key) {
    var url = this.xcfg.assets.images[key] || '';
    return this.sanitizeUrl(url);
  },

  getPListPath: function(key) {
    var url = this.xcfg.assets.atlases[key] || '';
    return this.sanitizeUrl(url + '.plist');
  },

  getAtlasPath: function(key) {
    var url = this.xcfg.assets.atlases[key] || '';
    return this.sanitizeUrl(url + '.png');
  },

  getSfxPath: function(key) {
    var url = this.xcfg.assets.sounds[key];
    return url ? this.sanitizeUrl( url + '.' + this.xcfg.game.sfx) : '';
  },

  getSpritePath: function(key) {
    var obj = this.xcfg.assets.sprites[key];
    return obj ? this.sanitizeUrl(obj[0]) : '';
  },

  getTilesPath: function(key) {
    var url = this.xcfg.assets.tiles[key] || '';
    return this.sanitizeUrl(url);
  },

  getFontPath: function(key) {
    var obj = this.xcfg.assets.fonts[key];
    return obj ? this.sanitizeUrl(obj[0]) + obj[2] : '';
  },

  setGameSize: function(sz) {
    if (_.isString(sz)) {
      this.xcfg.game.size = this.xcfg.devices[sz];
    }
    else
    if (_.isObject(sz)) {
      this.xcfg.game.size = sz;
    }
  },

  setDeviceSizes: function (obj) {
    if (_.isObject(obj)) { this.xcfg.devices= obj; }
  },

  toggleSfx: function(override) {
    this.xcfg.sound.open = sjs.echt(override) ? override : !this.xcfg.sound.open;
    if (!cc.audioEngine._soundSupported) {
      this.xcfg.sound.open=false;
    }
  },

  sfxPlay: function(key) {
    var url;
    if (this.xcfg.sound.open) {
      url = this.getSfxPath(key);
      if (url) {
        cc.audioEngine.playEffect( url, false);
      }
    }
  },

  sfxInit: function() {
    if (cc.audioEngine._soundSupported) {
      cc.audioEngine.setMusicVolume(this.xcfg.sound.volume);
      this.xcfg.sound.open= true;
    }
  },

  sanitizeUrl: function(url) {
    if (cc.sys.isNative) {
      return this.sanitizeUrlForDevice(url);
    } else {
      return this.sanitizeUrlForWeb(url);
    }
  },

  sanitizeUrlForDevice: function(url) {
    sjs.loggr.debug('about to sanitize url for jsb: ' + url);
    // ensure we tell mustache not to escape html
    url = url || '';
    if (url.match(/^media/)) {
      if (url.indexOf('/sfx/') > 0) {
        url = 'audio' + url.slice(0,5);
      } else {
        url = 'res' + url.slice(0,5);
      }
    }
    else
    if (url.match(/^game/)) {
      url = 'src' + url.slice(0,4);
    }
    return Mustache.render( url, {
      'border-tiles' : this.xcfg.game.borderTiles,
      'lang' : this.lang,
      'color' : this.xcfg.color,
      'appid' :  this.xcfg.appid
    });
  },

  sanitizeUrlForWeb: function(url) {
    sjs.loggr.debug('about to sanitize url for web: ' + url);
    // ensure we tell mustache not to escape html
    url = url || '';
    if (url.match(/^media/)) {
      url = '{{{media-ref}}}/' + url;
    }
    else
    if (url.match(/^game/)) {
      url = '{{{gamesource-ref}}}/' + url;
    }
    return Mustache.render( url, {
      'border-tiles' : this.xcfg.game.borderTiles,
      'gamesource-ref' : '/public/ig/lib',
      'media-ref' : '/public/ig',
      'lang' : this.lang,
      'color' : this.xcfg.color,
      'appid' :  this.xcfg.appid
    });
  },

  run: function(startScreen) {
    var s1= startScreen || 'StartScreen',
    me=this;
    cc.game.onStart= function() {
      sjs.loggr.info("About to create Cocos2D HTML5 Game");
      me.preLaunchApp(s1);
      me.l10nInit(),
      me.sfxInit();
      sjs.merge(me.xcfg.game, global.document.ccConfig);
      sjs.loggr.debug(JSON.stringify(me.xcfg.game));
      sjs.loggr.info("registered game start state - " + s1);
      sjs.loggr.info("loaded and running. OK");
    };
    cc.game.run();
  },

  preLaunchApp: function (s1) {

    var sz = this.xcfg.game.size,
    dirc = cc.director,
    eglv = cc.view,
    me = this;

    eglv.setDesignResolutionSize(sz.width, sz.height,
                                 cc.ResolutionPolicy.SHOW_ALL);
    eglv.resizeWithBrowserSize(true);
    eglv.adjustViewPort(true);

    //dirc.setAnimationInterval(1 / sh.xcfg.game.frameRate);
    if (this.xcfg.game.debug) {
      dirc.setDisplayStats(this.xcfg.game.showFPS);
    }

    //TODO: devicewebdiff
    this.XLoader.preload( this.pvGatherPreloads(), function () {
      me.xcfg.runOnce();
      dirc.runScene( me.protos[s1].create() );
    }, this);

    return true;
  },

  pvGatherPreloads: function() {
    var assets= this.xcfg.assets,
    me=this,
    p,
    rc= [
      _.map(assets.sprites, function(v,k) { return me.pvLoadSprite(k,v); }),
      _.map(assets.images, function(v,k) { return me.pvLoadImage(k,v); }),
      _.map(assets.sounds, function(v,k) { return me.pvLoadSound(k,v); }),

      _.reduce(assets.fonts, function(memo, v,k) {
        // value is array of [ path, image , xml ]
        p= me.sanitizeUrl(v[0]);
        return memo.concat([ p + v[1], p + v[2] ]);
      }, []),

      _.reduce(assets.atlases, function(memo, v,k) {
        return memo.concat( me.pvLoadAtlas(k,v));
      }, []),

      _.map(assets.tiles, function(v,k) {
        return me.pvLoadTile(k,v);
      }),

      this.xcfg.game.preloadLevels ? this.pvLoadLevels() : []
    ];

    return _.reduce(_.flatten(rc), function(memo,v) {
      sjs.loggr.info('Loading ' + v);
      memo.push( v );
      return memo;
    }, []);
  },

  pvLoadLevels: function() {
    var rc = [],
    me= this,
    f1= function(k) {
      return function(obj,n) {
        var a = _.reduce(obj, function(memo, item, x) {
              var z= k + '.' + n + '.' + x;
              switch (n) {
                case 'sprites':
                  memo.push( this.pvLoadSprite( z,item));
                  me.xcfg.assets.sprites[z] = item;
                break;
                case 'images':
                  memo.push( this.pvLoadImage( z, item));
                  me.xcfg.assets.images[z] = item;
                break;
                case 'tiles':
                  memo.push( this.pvLoadTile( z, item));
                  me.xcfg.assets.tiles[z] = item;
                break;
              }
              return memo;
        }, [], this);
        rc = rc.concat(a);
      };
    };

    _.each(this.xcfg.levels, function(v,k) {
      _.each(v, f1(k), this);
    }, this);

    return rc;
  },

  pvLoadSprite: function(k, v) {
    return this.sanitizeUrl(v[0]);
  },

  pvLoadImage: function(k,v) {
    return this.sanitizeUrl(v);
  },

  pvLoadSound: function(k,v) {
    return this.sanitizeUrl( v + '.' + this.xcfg.game.sfx );
  },

  pvLoadAtlas: function(k,v) {
    return [ this.sanitizeUrl( v + '.plist'),
             this.sanitizeUrl( v + '.png') ];
  },

  pvLoadTile: function(k,v) {
    return this.sanitizeUrl(v);
  }


};

// monkey patch logger to use cocos2d's log functions.
sjs.loggr= cc;
sjs.loggr.info = cc.log;
sjs.loggr.debug = cc.log;

}).call(this);


// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function(undef) { "use strict"; var global = this, _ = global._ ;

var sjs=global.SkaroJS,
_SEED=0;

//////////////////////////////////////////////////////////////////////////////
//
function mkSubSCR(topic, selector, target, repeat, args) {
  return {
    id: "sub-" + Number(++_SEED),
    repeat: sjs.boolify(repeat),
    args: args || [],
    action: selector,
    target: target,
    topic: topic,
    active: true
  };
}

//////////////////////////////////////////////////////////////////////////////
//
function mkTreeNode() {
  return {
    tree: {},  // children - branches
    subs: []   // subscribers (callbacks)
  };
}

//////////////////////////////////////////////////////////////////////////////
//
function safeSplit(s) {
  return _.without(s.trim().split('/'), '');
}

//////////////////////////////////////////////////////////////////////////////
//
var EventBus = sjs.Class.xtends({

  // subscribe to 1+ topics, returning a list of subscriber handles.
  // topics => "/hello/*  /goodbye/*"
  once: function(topics, selector, target /*, more args */) {
    var rc= this.pkListen(false,
                          topics,
                          selector,
                          target,
                          sjs.dropArgs(arguments,3));
    return sjs.echt(rc) ? rc : [];
  },

  // subscribe to 1+ topics, returning a list of subscriber handles.
  // topics => "/hello/*  /goodbye/*"
  on: function(topics, selector, target /*, more args */) {
    var rc= this.pkListen(true,
                          topics,
                          selector,
                          target,
                          sjs.dropArgs(arguments,3));
    return sjs.echt(rc) ? rc : [];
  },

  // trigger event on this topic.
  fire: function(topic, msg) {
    var tokens= safeSplit(topic);
    if (tokens.length > 0 ) {
      return this.pkDoPub(topic, this.rootNode, tokens, 0, msg || {} );
    }
  },

  resume: function(handle) {
    var sub= this.allSubs[handle];
    if (sub) {
      sub.active=true;
    }
  },

  pause: function(handle) {
    var sub= this.allSubs[handle];
    if (sub) {
      sub.active=false;
    }
  },

  off: function(handle) {
    var sub= this.allSubs[handle];
    if (sub) {
      this.pkUnSub(this.rootNode, safeSplit(sub.topic), 0, sub);
    }
  },

  removeAll: function() {
    /*
    _.each(_.keys(this.allSubs), function(id) {
      this.off(id);
    }, this);
    */
    // really no point in doing a nice cleanup, just clear everything since
    // we are removing all subscribers anyway.
    this.rootNode = mkTreeNode();
    this.allSubs = {};
  },

  pkGetSubcr: function(id) {
    return this.allSubs[id];
  },

  pkListen: function(repeat, topics, selector, target, more) {
    var ts= topics.trim().split(/\s+/);
    // for each topic, subscribe to it.
    var rc= _.map(ts, function(t) {
      return this.pkAddSub(repeat,t,selector,target,more);
    }, this);
    return _.without(rc, '');
  },

  // register a subscriber to the topic leaf node, creating the path
  // when necessary.
  pkAddSub: function(repeat, topic, selector, target, more) {
    var tkns= safeSplit(topic);
    if (tkns.length > 0) {
      var rc= mkSubSCR(topic, selector, target, repeat, more),
      node= _.reduce(tkns, function(memo, z) {
        return this.pkDoSub(memo,z);
      }, this.rootNode, this);
      this.allSubs[rc.id] = rc;
      node.subs.push(rc);
      return rc.id;
    } else {
      return '';
    }
  },

  // remove the subscriber and trim if it is a dangling leaf node.
  pkUnSub: function(node, tokens, pos, sub) {
    if (! sjs.echt(node)) { return; }
    if (pos < tokens.length) {
      var k= tokens[pos],
      cn= node.tree[k];
      this.pkUnSub(cn, tokens, pos+1, sub);
      if (_.isEmpty(cn.tree) &&
          cn.subs.length === 0) {
        delete node.tree[k];
      }
    } else {
      _.find(node.subs, function(z,n) {
        if (z.id === sub.id) {
          delete this.allSubs[z.id];
          node.subs.splice(n,1);
          return true;
        }
        return false;
      }, this);
    }
  },

  pkDoPub: function(topic, node, tokens, pos, msg) {
    if (! sjs.echt(node)) { return false; }
    var rc=false;
    if (pos < tokens.length) {
      rc = rc || this.pkDoPub(topic, node.tree[ tokens[pos] ], tokens, pos+1, msg);
      rc = rc || this.pkDoPub(topic, node.tree['*'], tokens, pos+1,msg);
    } else {
      rc = rc || this.pkRun(topic, node,msg);
    }
    return rc;
  },

  // invoke subscribers, and for non repeating ones, remove them from
  // the list.
  pkRun: function(topic, node, msg) {
    var cs= _.isObject(node) ? node.subs : [],
    rc=false,
    purge=false;
    _.each(cs, function (z) {
      if (z.active &&
          sjs.echt(z.action)) {
        // pass along any extra parameters, if any.
        z.action.apply(z.target, [topic, msg].concat(z.args));
        // if once only, kill it.
        if (!z.repeat) {
          delete this.allSubs[z.id];
          z.active= false;
          z.action= null;
          purge=true;
        }
        rc = true;
      }
    }, this);
    // get rid of unwanted ones, and reassign new set to the node.
    if (purge && cs.length > 0) {
      node.subs= _.filter(cs,function(z) {
        if (z.action) { return true; } else { return false; }
      });
    }
    return rc;
  },

  // find or create a new child node.
  pkDoSub: function(node,token) {
    if ( ! _.has(node.tree, token)) {
      node.tree[token] = mkTreeNode();
    }
    return node.tree[token];
  },

  ctor: function() {
    this.rootNode = mkTreeNode();
    this.allSubs = {};
  }

});

global.ZotohLab.MakeEventBus = function() {
  return new EventBus();
}

}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function(undef) { "use strict"; var global= this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sjs= global.SkaroJS;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XConfig = {

  urlPrefix: '/public/ig/',
  appid: '',
  color: '',

  levels: {
  },

  assets: {
    sprites: {
      'gui.audio' : [ 'media/cocos2d/btns/{{color}}/audio_onoff.png', 48,48, -1 ]
    },
    atlases : {
    },
    tiles: {
      'gui.blank' : 'game/{{appid}}/levels/blankscreen.tmx',
      'gui.mmenu' : 'game/{{appid}}/levels/mainmenu.tmx'
    },
    images: {
      'splash.splash' : 'media/{{appid}}/gui/splash.png',

      "gui.mmenu.replay" : 'media/cocos2d/btns/{{color}}/replay.png',
      "gui.mmenu.quit" : 'media/cocos2d/btns/{{color}}/quit.png',
      "gui.mmenu.back" : 'media/cocos2d/btns/{{color}}/go_back.png',
      "gui.mmenu.ok" : 'media/cocos2d/btns/{{color}}/go_ok.png',
      "gui.mmenu.menu" : 'media/cocos2d/btns/{{color}}/go_mmenu.png',

      /*
      'gui.mmenu.border16': 'media/cocos2d/game/cbox-borders_x16.png',
      'gui.mmenu.border8': 'media/cocos2d/game/cbox-borders_x8.png',
      */
      'gui.mmenu.menu.bg' : 'game/{{appid}}/levels/mainmenu.png',
      'gui.mmenu.bg' : 'game/{{appid}}/levels/bg.png',
      'gui.mmenu.border': 'game/{{appid}}/levels/{{border-tiles}}',

      'gui.edit.orange' : 'media/cocos2d/game/orange_edit.png',
      'gui.edit.green' : 'media/cocos2d/game/green_edit.png',
      'gui.edit.yellow' : 'media/cocos2d/game/yellow_edit.png'

    },
    sounds: {
    },
    fonts: {
      'font.TinyBoxBB' : [ 'media/cocos2d/fon/{{lang}}/', 'TinyBoxBlackBitA8.png', 'TinyBoxBlackBitA8.fnt' ],
      'font.LaffRiotNF' : [ 'media/cocos2d/fon/{{lang}}/', 'LaffRiotNF.png', 'LaffRiotNF.fnt' ],
      'font.JellyBelly' : [ 'media/cocos2d/fon/{{lang}}/', 'JellyBelly.png', 'JellyBelly.fnt' ],
      'font.Subito' : [ 'media/cocos2d/fon/{{lang}}/', 'Subito.png', 'Subito.fnt' ],
      'font.OogieBoogie' : [ 'media/cocos2d/fon/{{lang}}/', 'OogieBoogie.png', 'OogieBoogie.fnt' ],
      'font.DigitalDream' : [ 'media/cocos2d/fon/{{lang}}/', 'DigitalDream.png', 'DigitalDream.fnt' ],
      'font.AutoMission' : [ 'media/cocos2d/fon/{{lang}}/', 'AutoMission.png', 'AutoMission.fnt' ],
      'font.ConvWisdom' : [ 'media/cocos2d/fon/{{lang}}/', 'ConvWisdom.png', 'ConvWisdom.fnt' ],
      'font.Ubuntu' : [ 'media/cocos2d/fon/{{lang}}/', 'Ubuntu.png', 'Ubuntu.fnt' ],
      'font.OCR' : [ 'media/cocos2d/fon/{{lang}}/', 'OCR.png', 'OCR.fnt' ],
      'font.Downlink' : [ 'media/cocos2d/fon/{{lang}}/', 'Downlink.png', 'Downlink.fnt' ]
    }
  },

  game: {
    borderTiles: 'cbox-borders_x8.png',
    preloadLevels: true,
    sfx: 'mp3',
    landscape: false,
    size: null,
    gravity: 0,
    version: "",
    trackingID: ""
  },

  smac: null,

  l10nTable: {
    "en-US" : {
      '%mobileStart' : 'Press Anywhere To Start!',
      '%webStart' : 'Press Spacebar To Start!',

      "%player2" : 'Player 2',
      "%player1" : 'Player 1',
      "%computer" : 'Computer',
      "%cpu" : "CPU",

      "%2players" : '2 Players',
      "%1player" : '1 Player',
      "%online" : 'Online',

      "%quit!" : 'Quit',
      "%back" : 'Back',
      "%ok" : 'OK',

      "%mmenu" : 'Main Menu',
      "%replay" : 'REPLAY',
      "%play" : 'PLAY',

      "%waitothers" : 'Waiting for other players to join...',
      "%waitother" : 'Waiting for another player to join...',
      "%signinplay" : 'Please sign in to play.',

      "%quit?" : 'Continue to quit game?'
    }
  },

  devices: {
    iphone:{width:240, height:160, scale:2},
    android:{width:240, height:160, scale:2},
    ipad:{width:240, height:160, scale:4},
    default:{width:240, height:160, scale:3}
  },

  csts: {
    // 1 = single player
    // 2 = 2 players
    // 3 = network, multi players
    GAME_MODE: 1,
    TILE: 8,
    S_OFF: 4
  },

  sound: {
    volume: 0.5,
    open: false,
    music: {
      volume: 0.5,
      track: null
    }
  },

  runOnce: function() {}

};


}).call(this);


// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function(undef) { "use strict"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
sjs=global.SkaroJS,
STICKY_THRESHOLD= 0.0004;


//////////////////////////////////////////////////////////////////////////////
// monkey patch stuff that we want to extend
//////////////////////////////////////////////////////////////////////////////

cc.Director.prototype.getSceneStackLength = function() {
  return this._scenesStack.length;
};

cc.Director.prototype.replaceRootScene = function(scene) {
  this.popToRootScene();
  if (this._scenesStack.length !== 1) {
    throw new Error("scene stack is screwed up");
  }
  var cur = this._scenesStack.pop();
  if (cur.isRunning()) {
    cur.onExitTransitionDidStart();
    cur.onExit();
  }
  cur.cleanup();
  this._runningScene=null;
  this._nextScene = null;
  this.runScene(scene);
};


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.COCOS2DX = {

  collide2: function(a,b) {
    if (!a || !b) { return false; }
    var pos2 = b.sprite.getPosition(),
    pos1 = a.sprite.getPosition(),
    sz2 = b.sprite.getContentSize(),
    sz1 = a.sprite.getContentSize(),
    r2 = sz2.width/2,
    dx,dy,d2,rr,
    r1 = sz1.width/2;

    if (pos1.x > pos2.x) {
      dx = pos1.x - pos2.x;
    } else {
      dx = pos2.x - pos1.x;
    }
    if (pos1.y > pos2.y) {
      dy = pos1.y - pos2.y;
    } else {
      dy = pos2.y - pos1.y;
    }
    rr= (r2 + r1) * (r2 + r1);
    d2 = dx * dx + dy * dy;

    return d2 <= rr;
  },

  collide: function(a,b) {
    return a && b ? cc.rectIntersectsRect( this.bbox(a.sprite), this.bbox(b.sprite)) : false;
  },

  outOfBound: function(ent) {
    var bx= this.bbox2(ent.sprite),
    wz = this.screen();
    return (bx.bottom > wz.height-1 ||
        bx.top < 0 ||
        bx.right < 0 ||
        bx.left > wz.width -1);
  },

  createTimer: function(par, tm) {
    return par.runAction(new cc.DelayTime(tm));
  },

  timerDone: function(t) {
    return sjs.echt(t) && t.isDone();
  },

  bbox2: function(sprite) {
    return {
      top: this.getTop(sprite),
      left: this.getLeft(sprite),
      bottom: this.getBottom(sprite),
      right: this.getRight(sprite)
    };
  },

  bbox: function(sprite) {
    return new cc.Rect( this.getLeft(sprite), this.getBottom(sprite), this.getWidth(sprite),
    this.getHeight(sprite));
  },

  bboxb4: function(ent) {
    return {
      top: this.getLastTop(ent),
      left: this.getLastLeft(ent),
      bottom: this.getLastBottom(ent),
      right: this.getLastRight(ent)
    };
  },

  getScaledHeight: function(sprite) {
    return sprite.getContentSize().height * sprite.getScaleY();
  },

  getHeight: function(sprite) {
    return sprite.getContentSize().height;
  },

  getScaledWidth: function(sprite) {
    return sprite.getContentSize().width * sprite.getScaleX();
  },

  getWidth: function(sprite) {
    return sprite.getContentSize().width;
  },

  getLeft: function(sprite) {
    return sprite.getPosition().x - this.getWidth(sprite)/2;
  },

  getRight: function(sprite) {
    return sprite.getPosition().x + this.getWidth(sprite)/2;
  },

  getTop: function(sprite) {
    return sprite.getPosition().y + this.getHeight(sprite)/2;
  },

  getBottom: function(sprite) {
    return sprite.getPosition().y - this.getHeight(sprite)/2;
  },

  getLastLeft: function(ent) {
    return ent.lastPos.x - this.getWidth(ent.sprite)/2;
  },

  getLastRight: function(ent) {
    return ent.lastPos.x + this.getWidth(ent.sprite)/2;
  },

  getLastTop: function(ent) {
    return ent.lastPos.y + this.getHeight(ent.sprite)/2;
  },

  getLastBottom: function(ent) {
    return ent.lastPos.y - this.getHeight(ent.sprite)/2;
  },

  center: function() {
    var winSize = this.screen();
    return cc.p(winSize.width / 2, winSize.height / 2);
  },

  screen: function() {
    if (cc.sys.isNative) {
      return cc.director.getWinSizeInPixels();
    } else {
      return cc.director.getWinSize();
    }
  },

  getSpriteFrame: function(frameid) {
    return cc.spriteFrameCache.getSpriteFrame(frameid);
  },

  AnchorCenter: cc.p(0.5, 0.5),
  AnchorTop: cc.p(0.5, 1),
  AnchorTopRight: cc.p(1, 1),
  AnchorRight: cc.p(1, 0.5),
  AnchorBottomRight: cc.p(1, 0),
  AnchorBottom: cc.p(0.5, 0),
  AnchorBottomLeft: cc.p(0, 0),
  AnchorLeft: cc.p(0, 0.5),
  AnchorTopLeft: cc.p(0, 1),

  resolveElastic: function(obj1,obj2) {
    var pos2 = obj2.sprite.getPosition(),
    pos1= obj1.sprite.getPosition(),
    sz2= obj2.sprite.getContentSize(),
    sz1= obj1.sprite.getContentSize(),
    hh1= sz1.height/2,
    hw1= sz1.width/2,
    x = pos1.x,
    y= pos1.y,
    bx2 = this.bbox2(obj2.sprite),
    bx1 = this.bbox2(obj1.sprite);

    // coming from right
    if (bx1.left < bx2.right && bx2.right < bx1.right) {
      obj1.vel.x = Math.abs(obj1.vel.x);
      obj2.vel.x = - Math.abs(obj2.vel.x);
      x= this.getRight(obj2.sprite) + hw1;
    }
    else
    // coming from left
    if (bx1.right > bx2.left && bx1.left < bx2.left) {
      obj1.vel.x = - Math.abs(obj1.vel.x);
      obj2.vel.x = Math.abs(obj2.vel.x);
      x= this.getLeft(obj2.sprite) - hw1;
    }
    else
    // coming from top
    if (bx1.bottom < bx2.top && bx1.top > bx2.top) {
      obj1.vel.y = Math.abs(obj1.vel.y);
      obj2.vel.y = - Math.abs(obj2.vel.y);
      y= this.getTop(obj2.sprite) + hh1;
    }
    else
    // coming from bottom
    if (bx1.top > bx2.bottom && bx2.bottom > bx1.bottom) {
      obj1.vel.y = - Math.abs(obj1.vel.y);
      obj2.vel.y = Math.abs(obj2.vel.y);
      y= this.getBottom(obj2.sprite) - hh1;
    }
    else {
      return;
    }
    obj1.updatePosition(x,y);
  },

  tmenu1: function(options) {
    var s1= new cc.LabelBMFont(options.text, options.fontPath),
    menu,
    t1= new cc.MenuItemLabel(s1, options.selector, sjs.echt(options.target) ? options.target : undef);
    t1.setOpacity(255 * 0.9);
    t1.setScale(options.scale || 1);
    t1.setTag(1);
    menu= new cc.Menu(t1);
    menu.alignItemsVertically();
    if (options.anchor) { menu.setAnchorPoint(options.anchor); }
    if (options.pos) { menu.setPosition(options.pos); }
    if (options.visible === false) { menu.setVisible(false); }
    return menu;
  },

  pmenu1: function(options) {
    var btn = new cc.Sprite(options.imgPath),
    menu,
    mi= new cc.MenuItemSprite(btn, null, null, options.selector, sjs.echt(options.target) ? options.target : undef);
    mi.setScale(options.scale || 1);
    mi.setTag(1);
    menu = new cc.Menu(mi);
    menu.alignItemsVertically();
    if (options.anchor) { menu.setAnchorPoint(options.anchor); }
    if (options.pos) { menu.setPosition(options.pos); }
    if (options.visible === false) { menu.setVisible(false); }
    return menu;
  },

  bmfLabel: function(options) {
    var f= new cc.LabelBMFont(options.text, options.fontPath);
    f.setScale( options.scale || 1);
    if (options.color) { f.setColor(options.color); }
    if (options.pos) { f.setPosition(options.pos); }
    if (options.anchor) { f.setAnchorPoint(options.anchor); }
    if (options.visible === false) { f.setVisible(false); }
    f.setOpacity(0.9*255);
    return f;
  }

};

asterix.CCS2DX= asterix.COCOS2DX;


}).call(this);


/*??
// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.
 ??*/

(function(undef) { "use strict"; var global = this, _ = global._ ;

var EventBus= global.ZotohLab.EventBus,
sjs= global.SkaroJS;


var Events = {
// Event type
PLAYGAME_REQ          : 1,
JOINGAME_REQ          : 2,
NETWORK_MSG           : 3,
SESSION_MSG           : 4,

// Event code
C_PLAYREQ_NOK         : 10,
C_JOINREQ_NOK         : 11,
C_USER_NOK            : 12,
C_GAME_NOK            : 13,
C_ROOM_NOK            : 14,
C_ROOM_FILLED         : 15,
C_ROOMS_FULL          : 16,

C_PLAYREQ_OK          : 30,
C_JOINREQ_OK          : 31,

C_AWAIT_START         : 40,
C_SYNC_ARENA          : 45,
C_POKE_RUMBLE         : 46,

C_RESTART             : 50,
C_START               : 51,
C_STOP                : 52,
C_POKE_MOVE           : 53,
C_POKE_WAIT           : 54,
C_PLAY_MOVE           : 55,
C_REPLAY              : 56,

C_PLAYER_JOINED       : 90,
C_STARTED             : 95,
C_CONNECTED           : 98,
C_ERROR               : 99,
C_CLOSED              : 100,

S_NOT_CONNECTED       : 0,
S_CONNECTED           : 1

};

//////////////////////////////////////////////////////////////////////////////
//
function mkEvent(eventType, code, payload) {
  return {
    timeStamp: _.now(),
    type: eventType,
    code: code,
    source: payload
  };
}

//////////////////////////////////////////////////////////////////////////////
//
function noop() {
}

//////////////////////////////////////////////////////////////////////////////
//
function mkPlayRequest(game,user,pwd) {
  return mkEvent(Events.PLAYGAME_REQ, -1, [game, user, pwd]);
}

//////////////////////////////////////////////////////////////////////////////
//
function mkJoinRequest(room,user,pwd) {
  return mkEvent(Events.JOINGAME_REQ, -1, [room, user, pwd]);
}

//////////////////////////////////////////////////////////////////////////////
//
function json_encode(e) {
  return JSON.stringify(e);
}

//////////////////////////////////////////////////////////////////////////////
//
function json_decode(e) {
  var src, evt = {};
  try {
    evt= JSON.parse(e.data);
  } catch (e) {
    evt= {};
  }
  if (! _.has(evt, 'type')) {
    evt.type= -1;
  }
  if (! _.has(evt, 'code')) {
    evt.code= -1;
  }
  if (_.has(evt, 'source') &&
      _.isString(evt.source)) {
    // assume json for now
    evt.source = JSON.parse(evt.source);
  }
  return evt;
}

//////////////////////////////////////////////////////////////////////////////
//
var Session= sjs.Class.xtends({

  connect: function(url) {
    this.wsock(url);
  },

  ctor: function(config) {
    this.state= Events.S_NOT_CONNECTED;
    this.ebus= new EventBus();
    this.handlers= [];
    this.options=config;
    this.ws = null;
  },

  send: function(evt) {
    if (this.state === Events.S_CONNECTED &&
        _.isObject(this.ws)) {
      this.ws.send( json_encode(evt));
    }
  },

  subscribe: function(eventType, code, callback, target) {
    var h= this.ebus.on("/"+eventType+"/"+code, callback, target);
    if (_.isArray(h) && h.length > 0) {
      // store the handle ids for clean up
      //this.handlers=this.handlers.concat(h);
      this.handlers.push(h[0]);
      return h[0];
    } else {
      return null;
    }
  },

  subscribeAll: function(callback,target) {
    return [ this.subscribe(Events.NETWORK_MSG, '*', callback, target),
             this.subscribe(Events.SESSION_MSG, '*', callback, target) ];
  },

  unsubscribeAll: function() {
    this.ebus.removeAll();
    this.handlers= [];
  },

  unsubscribe: function(subid) {
    sjs.removeFromArray(this.handlers, subid);
    this.ebus.off(subid);
  },

  reset: function () {
    this.onmessage= noop;
    this.onerror= noop;
    this.onclose= noop;
    this.handlers= [];
    this.ebus.removeAll();
  },

  close: function () {
    this.state= Events.S_NOT_CONNECTED;
    if (_.isObject(this.ws)) {
      this.reset();
      try {
        this.ws.close();
      } catch (e)
      {}
    }
    this.ws= null;
  },

  disconnect: function () {
    this.close();
  },

  onNetworkMsg: function(evt) {
  },

  onSessionMsg: function(evt) {
  },

  wsock: function(url) {
    var ws= new WebSocket(url),
    me=this;

    ws.onopen= function() {
      me.state= Events.S_CONNECTED;
      ws.send(me.getPlayRequest());
    };

    ws.onmessage= function (e) {
      var evt= json_decode(e);
      switch (evt.type) {
        case Events.NETWORK_MSG:
        case Events.SESSION_MSG:
          me.onevent(evt);
        break;
        default:
          sjs.loggr.warn("unhandled event from server: " +
                         evt.type +
                         ", code = " +
                         evt.code);
      }
    };

    ws.onclose= function (e) {
      me.onevent(mkEvent(Events.NETWORK_MSG, Events.C_CLOSED));
    };

    ws.onerror= function (e) {
      me.onevent(mkEvent(Events.NETWORK_MSG, Events.C_ERROR, e));
    };

    return this.ws=ws;
  },

  getPlayRequest: function() {
    return json_encode( mkPlayRequest(this.options.game,
                                      this.options.user,
                                      this.options.passwd));
  },

  onevent: function(evt) {
    this.ebus.fire("/"+evt.type+"/"+evt.code, evt);
  }

});


global.ZotohLab.Odin= {

  newSession: function(config) {
    return new Session(config);
  },

  Events: Events
};


}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function(undef) { "use stricts"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XScene = cc.Scene.extend({

  //ebus: global.ZotohLab.MakeEventBus(),
  //layers: {},
  //lays: [],
  //options : {},

  getLayers: function() {
    return this.layers;
  },

  init: function() {
    return this._super() ? this.createLayers() : false;
  },

  createLayers: function() {
    var a = this.lays || [],
    glptr = undef,
    ok,
    rc,
    obj;
    // look for failures, hold off init'ing game layer, leave that as last
    rc = _.some(a, function(proto) {
      obj= new (proto)(this.options);
      obj.setParent(this);
      if ( obj instanceof asterix.XGameLayer ) {
        glptr = obj;
        ok=true
      } else {
        ok= obj.init();
      }
      if (! ok) { return true; } else {
        this.layers[ obj.rtti() ] = obj;
        this.addChild(obj);
        return false;
      }
    }, this);

    if (a.length > 0 && rc===false ) {
      return sjs.echt(glptr) ? glptr.init() : true;
    } else {
      return false;
    }
  },

  ctor: function(ls, options) {
    this.ebus= global.ZotohLab.MakeEventBus();
    this.options = options || {};
    this.lays= ls || [];
    this.layers= {};
    this._super();
  }


});

asterix.XSceneFactory = sjs.Class.xtends({

  create: function(options) {
    var arr= this.layers,
    cfg;
    if (options && _.has(options,'layers') &&
        _.isArray(options.layers)) {
      arr= options.layers;
      cfg= _.omit(options, 'layers');
    } else {
      cfg= options || {};
    }
    var scene = new asterix.XScene(arr, cfg);
    return scene.init() ? scene : null;
  },

  ctor: function(ls) {
    this.layers= ls || [];
  }

});



}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function(undef) { "use stricts"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
sjs= global.SkaroJS,
SEED= 0;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XLayer = cc.Layer.extend({

  lastTag: 0,
  lastZix: 0,

  pkInit: function() {
    this.pkInput();
    return true;
  },

  pkInput: function() {
  },

  rtti: function() {
    return "" + Number(SEED++);
  },

  getNode: function() {
    return this;
  },

  removeAllItems: function(c) {
    this.getNode().removeAllChildren(c || true);
  },

  removeItem: function(n,c) {
    this.getNode().removeChild(n,c || true);
  },

  addItem: function(n,zx,tag) {
    var zOrder = sjs.echt(zx) ? zx : this.lastZix,
    p= this.getNode(),
    ptag = tag;

    if (! sjs.echt(ptag)) {
      ptag = ++this.lastTag;
    }

    if (n instanceof cc.Sprite &&
        p instanceof cc.SpriteBatchNode) {
      n.setBatchNode(p);
    }

    p.addChild(n, zOrder, ptag);
  },

  setParent: function(par) {
    this.parScene=par;
  },

  init: function() {
    return this._super() ? this.pkInit() : false;
  },

  ctor: function(options) {
    this.options = options || {};
    this._super();
  }

});


}).call(this);


// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function(undef){ "use strict"; var global= this,  _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx = asterix.COCOS2DX,
GID_SEED = 0;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XEntity = sjs.Class.xtends({

  wrapEnclosure: function() {
    var wz = ccsx.screen(), B = { left: 0, bottom: 0,
      right: wz.width-1, top: wz.height-1 },
    csts = sh.xcfg.csts,
    sz = this.sprite.getContentSize(),
    pos = this.sprite.getPosition(),
    //B= sh.main.getEnclosureRect(),
    hh = sz.height / 2,
    hw = sz.width / 2 ,
    x = pos.x,
    y = pos.y,
    bx= ccsx.bbox2(this.sprite);
    if (bx.bottom >= B.top) {
      //y = 0 - hh;
      y = hh + csts.TILE;
    }
    else
    if (bx.top <= B.bottom) {
      //y = B.top + hh;
      y = B.top - hh - csts.TILE;
    }
    else
    if (bx.right <= B.left) {
      //x = B.right + hw;
      x = B.right - hw - csts.TILE;
    }
    else
    if (bx.left >= B.right) {
      //x = B.left - hw;
      x = B.left + hw + csts.TILE;
    }

    if (x !== pos.x || y !== pos.y) {
      this.updatePosition(x,y);
    }
  },

  update: function(dt) {
    if (cc.sys.capabilities["keyboard"]) {
      this.keypressed(dt);
    }
  },

  updatePosition: function(x,y) {
    var box = sh.main.getEnclosureRect(),
    sz = this.sprite.getContentSize(),
    hh= sz.height/2,
    hw= sz.width/2,
    pos, x, y, b2;

    this.lastPos= this.sprite.getPosition();
    this.sprite.setPosition(x,y);

    if (this.wrappable) { return; }

    pos = this.sprite.getPosition();
    b2= ccsx.bbox2(this.sprite);
    x= pos.x;
    y= pos.y;

    if (b2.right > box.right) {
      x= box.right - hw;
    }
    else
    if (b2.left < box.left) {
      x = box.left + hw;
    }
    else
    if (b2.top > box.top) {
      y = box.top - hh;
    }
    else
    if (b2.bottom < box.bottom) {
      y = box.bottom + hh;
    }

    if (pos.x !== x || pos.y !== y) {
      this.sprite.setPosition(x,y);
    }
  },

  keypressed: function(dt) {
  },

  injured: function(damage,from) {
  },

  reviveSprite: function() {
    if (this.sprite) {
      this.sprite.setPosition(this.startPos.x, this.startPos.y);
      this.sprite.setVisible(true);
    }
  },

  revive: function(x,y,options) {
    if (_.isObject(options)) {
      this.options = sjs.merge(this.options, options);
    }
    this.startPos = cc.p(x,y);
    this.reviveSprite();
  },

  hibernate: function() {
    if (this.sprite) {
      this.sprite.setVisible(false);
      this.sprite.setPosition(0,0);
    }
  },

  traceEnclosure: function(dt) {
    var sz= this.sprite.getContentSize().height / 2,
    sw= this.sprite.getContentSize().width / 2,
    pos = this.sprite.getPosition(),
    csts = sh.xcfg.csts,
    hit=false,
    wz = ccsx.screen(),
    y = pos.y + dt * this.vel.y,
    x = pos.x + dt * this.vel.x,
    bbox = sh.main.getEnclosureRect();

    if (this.fixed) { return false; }

    // hitting top wall ?
    if (y + sz > bbox.top) {
      this.vel.y = - this.vel.y
      y = bbox.top - sz;
      hit=true;
    }

    // hitting bottom wall ?
    if (y - sz < bbox.bottom) {
      this.vel.y = - this.vel.y
      y = bbox.bottom + sz;
      hit=true;
    }

    if (x + sw > bbox.right) {
      this.vel.x = - this.vel.x;
      x = bbox.right - sw;
      hit=true;
    }

    if (x - sw < bbox.left) {
      this.vel.x = - this.vel.x;
      x = bbox.left + sw;
      hit=true;
    }

    //this.lastPos = this.sprite.getPosition();
    // no need to update the last pos
    if (hit) {
      this.sprite.setPosition(x, y);
    }

    return hit;
  },

  move: function(dt) {
    var pos = this.sprite.getPosition(),
    y = pos.y + dt * this.vel.y,
    x = pos.x + dt * this.vel.x;
    this.updatePosition(x, y);
  },

  rtti: function() {
    return 'no-rtti-defined';
  },

  crap: function(other) {
    var kz= other.sprite.getContentSize(),
    bz = this.sprite.getContentSize(),
    ks= other.sprite,
    bs= this.sprite,
    ka = { L: ccsx.getLeft(ks), T: ccsx.getTop(ks),
           R: ccsx.getRight(ks), B: ccsx.getBottom(ks) },
    ba = { L : ccsx.getLeft(bs), T: ccsx.getTop(bs),
           R: ccsx.getRight(bs), B: ccsx.getBottom(bs) };

    // coming down from top?
    if (ba.T > ka.T &&  ka.T > ba.B) {
      if (!other.fixed) { other.vel.y = - other.vel.y; }
      if (!this.fixed) { this.vel.y = - this.vel.y; }
    }
    else
    // coming from bottom?
    if (ba.T > ka.B &&  ka.B > ba.B) {
      if (!other.fixed) { other.vel.y = - other.vel.y; }
      if (!this.fixed) { this.vel.y = - this.vel.y; }
    }
    else
    // coming from left?
    if (ka.L > ba.L && ba.R > ka.L) {
      if (!other.fixed) { other.vel.x = - other.vel.x; }
      if (!this.fixed) { this.vel.x = - this.vel.x; }
    }
    else
    // coming from right?
    if (ka.R > ba.L && ba.R > ka.R) {
      if (!other.fixed) { other.vel.x = - other.vel.x; }
      if (!this.fixed) { this.vel.x = - this.vel.x; }
    }
    else {
      sjs.loggr.error("Failed to determine the collision of these 2 objects.");
    }
  },

  dispose: function() {
    if (this.sprite) {
      this.sprite.getParent().removeChild(this.sprite,true);
      this.sprite=null;
    }
  },

  create: function() {
    throw new Error("missing implementation.");
  },

  ctor: function(x,y,options) {
    this.options= options || {};
    this.startPos = cc.p(x,y);
    this.lastPos= cc.p(x,y);
    this.wrappable=false;
    this.fixed=false;
    this.health= 0;
    this.speed= 0;
    this.bounce=0;
    this.value= 0;
    this.sprite= null;
    this.friction= { x: 0, y: 0 };
    this.accel= { x: 0, y: 0 };
    this.maxVel= { x: 0, y: 0 };
    this.vel= { x: 0, y: 0 };
    this.guid = ++GID_SEED;
    this.status=true;
  }

});

Object.defineProperty(asterix.XEntity.prototype, "gid", {
  get: function() {
    return this.guid;
  }
});
Object.defineProperty(asterix.XEntity.prototype, "height", {
  get: function() {
    return this.sprite ? this.sprite.getContentSize().height : undef;
  }
});
Object.defineProperty(asterix.XEntity.prototype, "width", {
  get: function() {
    return this.sprite ? this.sprite.getContentSize().width : undef;
  }
});
Object.defineProperty(asterix.XEntity.prototype, "OID", {
  get: function() {
    return this.sprite ? this.sprite.getTag() : -1;
  }
});



asterix.XEntityPool = sjs.Class.xtends({

  checkEntity: function(ent) {
    if (ent instanceof this.entType) {
      return true;
    }
    throw new Error("Cannot add type : " + ent.rtti() + " into pool.  Wrong type.");
  },

  drain: function() {
    this.curSize = 0;
    this.pool = [];
  },

  get: function() {
    var rc= null;
    if (this.curSize > 0) {
      rc = this.pool.pop();
      --this.curSize;
      sjs.loggr.debug('getting object "' + rc.rtti() + '" from pool: oid = ' + rc.OID);
    }
    return rc;
  },

  add: function(ent) {
    if (this.checkEntity(ent) && this.curSize < this.maxSize) {
      sjs.loggr.debug('putting object "' + ent.rtti() + '" into pool: oid = ' + ent.OID);
      this.pool.push(ent);
      ent.hibernate();
      ++this.curSize;
      return true;
    } else {
      return false;
    }
  },

  maxSize: 1000,
  curSize: 0,

  pool: [],

  ctor: function(options) {
    this.options = options || {};
    this.maxSize = this.options.maxSize || 1000;
    this.entType = this.options.entityProto;
  }

});


}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef){ "use strict"; var global = this,  _ = global._  ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs = global.SkaroJS,
ccsx = asterix.COCOS2DX;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XLive = cc.Sprite.extend({
  ctor: function(x, y, options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    if ( sjs.echt(options.scale)) {
      this.setScale(options.scale);
    }
    this.setPosition(x,y);
  }
});

asterix.XHUDLives = sjs.Class.xtends({

  curLives: -1,

  reduce: function(howmany) {
    this.curLives = this.curLives - howmany;
    for (var n=0; n < howmany; ++n) {
      this.hud.removeItem(this.icons.pop());
    }
  },

  getLives: function() {
    return this.curLives;
  },

  isDead: function() {
    return this.curLives < 0;
  },

  reset:function() {
    _.each(this.icons, function(z) { this.hud.removeItem(z); }, this);
    this.curLives = this.options.totalLives;
    this.icons=[];
  },

  resurrect: function() {
    this.reset();
    this.drawLives();
  },

  drawLives: function() {
    var n, gap= 2,
    y= this.topLeft.y - this.lifeSize.height/2,
    x= this.topLeft.x + this.lifeSize.width/2,
    v;
    for (n = 0; n < this.curLives; ++n) {
      v= new asterix.XLive(x,y,this.options);
      this.hud.addItem(v);
      this.icons.push(v);
      if (this.options.direction > 0) {
        x += this.lifeSize.width + gap;
      } else {
        x -= this.lifeSize.width - gap;
      }
    }
  },

  create: function() {
    var dummy = new asterix.XLive(0,0,this.options);
    this.lifeSize = { width: ccsx.getScaledWidth(dummy), height: ccsx.getScaledHeight(dummy) } ;
    this.drawLives();
  },

  ctor: function(hud, x, y, options) {
    this.options = options || {};
    this.hud= hud;
    this.topLeft= cc.p(x,y);
    this.reset();
    if ( !sjs.echt(this.options.direction)) {
      this.options.direction = 1;
    }
  }

});



}).call(this);


// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function(undef) { "use stricts"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XGameHUDLayer = asterix.XLayer.extend({

  pkInit: function() {
    this.initParentNode();
    this.initLabels();
    this.initIcons();
    this.initCtrlBtns();
    return this._super();
  },

  scoreLabel: null,
  lives: null,
  score: 0,
  replayBtn: null,

  getScore: function() {
    return this.score;
  },

  reset: function() {
    this.disableReplay();
    this.score= 0;
    if (this.lives) { this.lives.resurrect(); }
  },

  reduceLives: function(n) {
    this.lives.reduce(n);
    return this.lives.isDead();
  },

  updateScore: function(num) {
    this.score += num;
    this.scoreLabel.setString(Number(this.score).toString());
  },

  disableReplay: function() {
    this.replayBtn.setVisible(false);
  },

  enableReplay: function() {
    this.replayBtn.setVisible(true);
  },

  initCtrlBtns: function(scale, where) {
    var csts = sh.xcfg.csts,
    wz= ccsx.screen(),
    cw= ccsx.center(),
    y, c, menu;

    where = where || 'cc.ALIGN_BOTTOM';
    scale = scale || 1;

    menu= ccsx.pmenu1({
      imgPath: sh.getImagePath('gui.mmenu.menu'),
      scale: scale,
      selector: function() {
        sh.fireEvent('/game/hud/controls/showmenu'); }
    });
    c= menu.getChildByTag(1);
    if (where === 'cc.ALIGN_TOP') {
      y = wz.height - csts.TILE  - ccsx.getScaledHeight(c) / 2
    } else {
      y = csts.TILE  + ccsx.getScaledHeight(c) / 2
    }
    menu.setPosition(wz.width - csts.TILE - ccsx.getScaledWidth(c)/2, y);
    this.addItem(menu);

    menu = ccsx.pmenu1({
      imgPath: sh.getImagePath('gui.mmenu.replay'),
      scale : scale,
      visible: false,
      selector: function() {
        sh.fireEvent('/game/hud/controls/replay'); }
    });
    c= menu.getChildByTag(1);
    if (where === 'cc.ALIGN_TOP') {
      y = wz.height - csts.TILE  - ccsx.getScaledHeight(c) / 2
    } else {
      y = csts.TILE  + ccsx.getScaledHeight(c) / 2
    }
    menu.setPosition(csts.TILE + ccsx.getScaledWidth(c)/2, y);
    this.replayBtn=menu;
    this.addItem(menu);
  }

});



}).call(this);


// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function(undef) { "use stricts"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
sjs = global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XGameLayer = asterix.XLayer.extend({

  keyboard: [],
  players: [],
  level: 1,
  actor: null,

  pkInput: function() {
    if (_.has(cc.sys.capabilities, 'keyboard')) {
      cc.log('pkInput:  keyboard supported');
      this.cfgInputKeyPad();
    }else{
      cc.log('pkInput:  keyboard not supported');
    }
    if (_.has(cc.sys.capabilities, 'mouse')) {
      cc.log('pkInput:  mouse supported');
      this.cfgInputMouse();
    }else{
      cc.log('pkInput:  mouse not supported');
    }
    if (_.has(cc.sys.capabilities, 'touches')) {
      cc.log('pkInput:  touch supported');
      this.cfgInputTouchOne();
      //this.setTouchEnabled(true);
      //this.setTouchMode(cc.TOUCH_ONE_BY_ONE);
    }else{
      cc.log('pkInput:  touch not supported');
    }
  },

  cfgInputKeyPad: function() {
    var me=this;
    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed:function (key, event) {
        me.onKeyDown(key);
      },
      onKeyReleased:function (key, event) {
        me.onKeyUp(key);
      }
    }, this);
  },

  cfgInputMouse: function() {
    var me=this;
    cc.eventManager.addListener({
      event: cc.EventListener.MOUSE,
      onMouseUp: function(event){
        me.onMouseUp(event);
      }
    }, this);
  },

  processEvent:function (event) {
    cc.log('event === ' + JSON.stringify(event));
    /*
    var delta = event.getDelta();
    var curPos = cc.p(this._ship.x, this._ship.y);
    curPos = cc.pAdd(curPos, delta);
    curPos = cc.pClamp(curPos, cc.p(0, 0), cc.p(winSize.width, winSize.height));
    this._ship.x = curPos.x;
    curPos = null;
    */
  },

  cfgInputTouchesAll: function() {
    var me=this;
    cc.eventManager.addListener({
      prevTouchId: -1,
      event: cc.EventListener.TOUCH_ALL_AT_ONCE,
      onTouchesMoved:function (touches, event) {
        var touch = touches[0];
        if (this.prevTouchId != touch.getId())
            this.prevTouchId = touch.getId();
        else event.getCurrentTarget().processEvent(touches[0]);
    }
    }, this);
  },

  cfgInputTouchOne: function() {
    var me=this;
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function(t,e) { return me.onTouchBegan(t,e);},
      onTouchMoved: function(t,e) { return me.onTouchMoved(t,e);},
      onTouchEnded: function(t,e) { return me.onTouchEnded(t,e);}
    }, this);
  },

  onTouchMoved: function(touch,event) {
  },

  onTouchBegan: function(touch,event) {
    var pt= touch.getLocation();
    cc.log("touch location [" + pt.x + "," + pt.y + "]");
    this.onclicked(pt.x, pt.y);
    return true;
  },

  onTouchEnded: function(touch,event) {
  },

  onKeyDown:function (e) {
    //loggr.debug('onKeyDown: e = ' + e);
    this.keyboard[e] = true;
  },

  onKeyUp:function (e) {
    //loggr.debug('onKeyUp: e = ' + e);
    this.keyboard[e] = false;
  },

  onMouseUp: function(evt) {
    var pt= evt.getLocation();
    cc.log("mouse location [" + pt.x + "," + pt.y + "]");
    this.onclicked(pt.x, pt.y);
  },

  onTouchesEnded: function (touches, event) {
    sjs.loggr.debug("touch event = " + event);
    sjs.loggr.debug("touch = " + touches);
  },

  onclicked: function(x,y) {
  },

  getEnclosureRect: function() {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen();
    return { top: wz.height - csts.TILE,
             left: csts.TILE,
             bottom: csts.TILE,
             right: wz.width - csts.TILE };
  },

  setGameMode: function(mode) {
    sh.xcfg.csts.GAME_MODE=mode;
  },

  newGame: function(mode) {
    cc.audioEngine.stopMusic();
    cc.audioEngine.stopAllEffects();
    this.onNewGame(mode);
  },

  pkInit: function() {

    var rc= this._super();

    if (rc) {
      switch (this.options.mode) {

        case 2:
          this.newGame(2);
        break;

        case 1:
          this.newGame(1);
        break;

        case 3:
          this.newGame(3);
        break;

        default:
          rc= false;
        break;
      }

      if (rc) {
        this.scheduleUpdate();
      }
    }

    return rc;
  },

  updateEntities: function(dt) {
  },

  checkEntities: function(dt) {
  },

  operational: function() {
    return true;
  },

  update: function(dt) {
    if (this.operational() ) {
      this.updateEntities(dt);
      this.checkEntities(dt);
    }
  },

  ctor: function(options) {
    this._super(options);
    sh.main = this;
  }


});

Object.defineProperty(asterix.XGameLayer.prototype, "keys", {
  get: function() {
    return this.keyboard;
  }
});


}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function(undef) { "use stricts"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
ccsx= asterix.COCOS2DX,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XLoader = cc.Scene.extend({

  logoSprite: null,
  bgLayer: null,
  winsz: null,
  logo: null,

  _instance: null,

  ctor: function () {
    this.winsz = ccsx.screen();
    this._super();
  },

  init: function() {
    this.bgLayer = new cc.LayerColor(cc.color(0,0,0, 255));
    this.bgLayer.setPosition(0, 0);
    //this._super();
    this.addChild(this.bgLayer, 0);
  },

  pkLoadBar: function() {
    var me=this;
    cc.loader.loadImg('/public/ig/media/cocos2d/game/preloader_bar.png',
                      {isCrossOrigin : false },
      function(err, img) {
        if (err) { cc.error('failed to load progress-bar.png'); } else {
          me.pbar= img;
          me.pkInitStage();
        }
    });
  },

  pkLoad: function() {
    var me=this;
    cc.loader.loadImg('/public/ig/media/main/ZotohLab_x200.png',
                      {isCrossOrigin : false },
      function(err, img) {
        if (err) { cc.error('failed to load zotohlab.png'); } else {
          me.logo= img;
          me.pkLoadBar();
        }
    });
  },

  pkInitStage: function () {
    var logo2d = new cc.Texture2D(),
    pbar2d= new cc.Texture2D(),
    cw = ccsx.center(),
    me= this,
    s1,s2;

    logo2d.initWithElement(this.logo);
    logo2d.handleLoadedTexture();

    pbar2d.initWithElement(this.pbar);
    pbar2d.handleLoadedTexture();

    this.addChild(this.bgLayer, 0);

    this.logoSprite = cc.Sprite.create(logo2d);
    this.logoSprite.setScale( cc.contentScaleFactor());
    this.logoSprite.setPosition(cw);
    this.bgLayer.addChild(this.logoSprite);

    s2 = cc.Sprite.create(pbar2d);
    s2.setScale( cc.contentScaleFactor());

    this.progress = cc.ProgressTimer.create(s2);
    this.progress.setType(cc.ProgressTimer.TYPE_BAR);
    this.progress.setScaleX(0.8);
    this.progress.setScaleY(0.3);
    //this.progress.setOpacity(0);
    //this.progress.setPercentage(0);
    this.progress.setPosition(this.logoSprite.getPosition().x, // - 0.5 * this.logo.width / 2 ,
                              cw.y - this.logo.height / 2 - 10);
    //this.progress.setMidpoint(cc.p(0,0));
    this.bgLayer.addChild(this.progress);

    this.scheduleOnce(this.pkStartLoading);
  },

  onEnter: function () {
    this._super();
    this.pkLoad();
  },

  /*
  onExit: function () {
  },
  */

  initWithResources: function (resources, selector, target) {
    this.resources = resources;
    this.selector = selector;
    this.target = target;
  },

  niceFadeOut: function() {
    this.logoSprite.runAction( cc.Sequence.create(
                                      cc.FadeOut.create(1.2),
                                      cc.CallFunc.create(this.selector, this.target)));
  },

  pkStartLoading: function () {
    var res = this.resources,
    me=this;
    this._length = res.length;
    this._count=0;

    cc.loader.load(res, function(result,cnt) {
      me._count= cnt;
    }, function() {
      me.niceFadeOut();
    });
    this.schedule(this.update, 0.25);
  },

  update: function () {
    var cnt = this._count,
    len = this._length,
    percent = (cnt / len * 100) | 0;
    percent = Math.min(percent, 100);
    this.progress.setPercentage(percent);
    if (cnt >= len) {
      this.unscheduleUpdate();
    }
  }


});

asterix.XLoader.preload = function (resources, selector, target) {
  var director = cc.director;

  if (!this._instance) {
    this._instance = new asterix.XLoader();
    this._instance.init();
  }

  this._instance.initWithResources(resources, selector, target);
  director.runScene(this._instance);
  return this._instance;
};


}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global= this, _ = global._  ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx= asterix.COCOS2DX,
sjs = global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// splash screen for the game - make it look nice please.
//////////////////////////////////////////////////////////////////////////////
asterix.XSplashLayer = asterix.XLayer.extend({

  pkInit: function() {
    var imgUrl= sh.getImagePath('splash.splash'),
    wz = ccsx.screen(),
    cw = ccsx.center();

    if (imgUrl) {
      var s= new cc.Sprite(imgUrl);
      s.setPosition(cw);
      this.addItem(s);
    }

    return this._super();
  },

  rtti: function() {
    return "SplashLayer";
  },

  pkInput: function() {}

});



}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global= this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
sjs = global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var BGLayer = asterix.XLayer.extend({
  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.getTilesPath('gui.blank'));
    this.addItem(map);
    return this._super();
  },

  pkInput: function() {}
});

var UILayer =  asterix.XLayer.extend({

  pkInit: function() {
    var qn= cc.LabelBMFont.create(sh.l10n(this.options.msg),
                                  sh.getFontPath('font.TinyBoxBB')),
    csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    s1, s2, t1, t2, menu;

    qn.setPosition(cw.x, wz.height * 0.75);
    qn.setScale(18/72);
    qn.setOpacity(0.9*255);
    this.addItem(qn);

    s1= cc.Sprite.create( sh.getImagePath('gui.mmenu.ok'));
    t1 = cc.MenuItemSprite.create(s1, null, null, function() {
      this.options.yes();
    }, this);

    menu= cc.Menu.create(t1);
    menu.alignItemsHorizontally(10);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF - s1.getContentSize().width / 2,
      csts.TILE + csts.S_OFF + s1.getContentSize().height / 2);
    this.addItem(menu);

    return this._super();
  }

});

sh.protos['MsgBox'] = {

  create: function(options) {
    return new asterix.XSceneFactory([ BGLayer, UILayer ]).create(options);
  }

};


}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global= this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
sjs = global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var BGLayer = asterix.XLayer.extend({
  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.getTilesPath('gui.blank'));
    this.addItem(map);
    return this._super();
  },

  pkInput: function() {}
});

var UILayer =  asterix.XLayer.extend({

  pkInit: function() {
    var qn= cc.LabelBMFont.create( sh.l10n('%quit?'), sh.getFontPath('font.TinyBoxBB')),
    csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    s1, s2, t1, t2, menu;

    qn.setPosition(cw.x, wz.height * 0.75);
    qn.setScale(18/72);
    qn.setOpacity(0.9*255);
    this.addItem(qn);

    s2= cc.Sprite.create( sh.getImagePath('gui.mmenu.back'));
    s1= cc.Sprite.create( sh.getImagePath('gui.mmenu.ok'));
    t2 = cc.MenuItemSprite.create(s2, null, null, function() {
      this.options.onBack();
    }, this);
    t1 = cc.MenuItemSprite.create(s1, null, null, function() {
      this.options.yes();
    }, this);

    menu= cc.Menu.create(t1,t2);
    menu.alignItemsHorizontally(10);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF - (s2.getContentSize().width + s1.getContentSize().width + 10) / 2,
      csts.TILE + csts.S_OFF + s2.getContentSize().height / 2);
    this.addItem(menu);

    return this._super();
  }

});

sh.protos['YesNo'] = {

  create: function(options) {
    var fac = new asterix.XSceneFactory(
      [ BGLayer, UILayer ]
    );
    return fac.create(options);
  }

};


}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
odin= global.ZotohLab.Odin,
sjs = global.SkaroJS,
$ = global.jQuery,
events= odin.Events,
ccsx = asterix.COCOS2DX;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var BGLayer = asterix.XLayer.extend({
  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.getTilesPath('gui.blank'));
    this.addItem(map);
    return this._super();
  },

  pkInput: function() {}
});

var UILayer =  asterix.XLayer.extend({

  onOnlineReq: function(uid,pwd) {
    var gid = $('body').attr('data-gameid') || '';
    var user = (uid || '').trim();
    var pswd = (pwd || '').trim();
    if (user.length === 0 ||
        pswd.length === 0) { return; }
    var wsurl = sjs.fmtUrl(sjs.getWebSockProtocol(),
                               "/network/odin/websocket");
    this.wss= odin.newSession({ game: gid, user: user, passwd: pswd });
    this.wss.subscribeAll(this.onOdinEvent, this);
    this.wss.connect(wsurl);
  },

  onOdinEvent: function(topic,evt) {
    sjs.loggr.debug(evt);
    switch (evt.type) {
      case events.NETWORK_MSG: this.onNetworkEvent(evt); break;
      case events.SESSION_MSG: this.onSessionEvent(evt); break;
    }
  },

  onNetworkEvent: function(evt) {
    switch (evt.code) {
      case events.C_PLAYER_JOINED:
        //TODO
        sjs.loggr.debug("another player joined room. " + evt.source.puid);
      break;
      case events.C_START:
        sjs.loggr.info("play room is ready, game can start.");
        this.wss.unsubscribeAll();
        // flip to game scene
        this.options.yes(this.wss, this.player, evt.source || {});
      break;
    }
  },

  onSessionEvent: function(evt) {
    switch (evt.code) {
      case events.C_PLAYREQ_OK:
        sjs.loggr.debug("player " +
                            evt.source.pnum +
                            ": request to play game was successful.");
        this.player=evt.source.pnum;
        this.showWaitOthers();
      break;
    }
  },

  onCancelPlay: function() {
    try {
      this.wss.close();
    } catch (e) {}
    this.wss=null;
    this.options.onBack();
  },

  showWaitOthers: function() {
    this.removeAllItems();
    var qn= cc.LabelBMFont.create(sh.l10n('%waitothers'),
                                  sh.getFontPath('font.TinyBoxBB')),
    csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    me=this,
    s1, s2, t1, t2, menu;

    qn.setPosition(cw.x, wz.height * 0.90);
    qn.setScale(18/72);
    qn.setOpacity(0.9*255);
    this.addItem(qn);

    s2= cc.Sprite.create( sh.getImagePath('gui.mmenu.back'));
    t2 = cc.MenuItemSprite.create(s2, null, null, function() {
      me.onCancelPlay();
    }, this);

    menu= cc.Menu.create(t2);
    menu.alignItemsHorizontally(10);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF - s2.getContentSize().width / 2,
      csts.TILE + csts.S_OFF + s2.getContentSize().height / 2);
    this.addItem(menu);
  },

  pkInit: function() {
    var qn= cc.LabelBMFont.create(sh.l10n('%signinplay'),
                                  sh.getFontPath('font.TinyBoxBB')),
    csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    me=this,
    uid,pwd,
    s1, s2, t1, t2, menu;

    qn.setPosition(cw.x, wz.height * 0.90);
    qn.setScale(18/72);
    qn.setOpacity(0.9*255);
    this.addItem(qn);

    var url = sh.sanitizeUrl(sh.xcfg.assets.images['gui.edit.orange']);
    var s9= cc.Scale9Sprite.create(url);
    var wcc= cc.color(255,255,255);
    var bxz= cc.size(100,36);
    uid = cc.EditBox.create(bxz,s9);
    uid.x = cw.x
    uid.y = cw.y + bxz.height / 2 + 2; // + 2 for a gap
    uid.setPlaceHolder('Username');
    uid.setPlaceholderFontColor(wcc);
    uid.setFontColor(wcc);
    uid.setMaxLength(12);
    uid.setDelegate(this);
    this.addItem(uid);

    s9= cc.Scale9Sprite.create(url);
    pwd = cc.EditBox.create(bxz,s9);
    pwd.y = cw.y - bxz.height / 2 - 2; // + 2 for a gap
    pwd.x= cw.x;
    pwd.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
    pwd.setPlaceHolder('Password');
    pwd.setPlaceholderFontColor(wcc);
    pwd.setFontColor(wcc);
    pwd.setMaxLength(12);
    pwd.setDelegate(this);
    this.addItem(pwd);

    s2= cc.Sprite.create( sh.getImagePath('gui.mmenu.back'));
    s1= cc.Sprite.create( sh.getImagePath('gui.mmenu.ok'));
    t2 = cc.MenuItemSprite.create(s2, null, null, function() {
      me.options.onBack();
    }, this);
    t1 = cc.MenuItemSprite.create(s1, null, null, function() {
      me.onOnlineReq(uid.getString(),pwd.getString());
    }, this);

    menu= cc.Menu.create(t1,t2);
    menu.alignItemsHorizontally(10);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF - (s2.getContentSize().width + s1.getContentSize().width + 10) / 2,
      csts.TILE + csts.S_OFF + s2.getContentSize().height / 2);
    this.addItem(menu);

    return this._super();
  }

});

sh.protos['OnlinePlay'] = {

  create: function(options) {
    return new asterix.XSceneFactory([ BGLayer, UILayer ]).create(options);
  }

};


}).call(this);

// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global= this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// Main menu.
//////////////////////////////////////////////////////////////////////////////

asterix.XMenuBackLayer = asterix.XLayer.extend({
  pkInit: function() {
    var map = new cc.TMXTiledMap(sh.getTilesPath('gui.mmenu')),
    csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    cw= ccsx.center(),
    title = new cc.LabelBMFont( sh.l10n('%mmenu'), sh.getFontPath('font.JellyBelly'));

    title.setOpacity(0.9*255);
    title.setScale(0.6);
    title.setPosition(cw.x, wz.height - csts.TILE * 8 / 2);

    this.addItem(map);
    this.addItem(title);

    return this._super();
  },

  rtti: function() {
    return 'XMenuBackLayer';
  },

  pkInput: function() {}

});

asterix.XMenuLayer= asterix.XLayer.extend({

  doCtrlBtns: function() {
    var audio = sh.xcfg.assets.sprites['gui.audio'],
    csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    cw = ccsx.center(),
    menu, t2,t1,
    w= audio[1],
    h= audio[2],
    p= sh.sanitizeUrl(audio[0]),
    s1= new cc.Sprite(p, cc.rect(w,0,w,h)),
    s2= new cc.Sprite(p, cc.rect(0,0,w,h));

    audio= cc.MenuItemToggle.create(new cc.MenuItemSprite(s1),
                        new cc.MenuItemSprite(s2),
           function(sender) {
            if (sender.getSelectedIndex() === 0) {
              sh.xcfg.toggleSfx(true);
            } else {
              sh.xcfg.toggleSfx(false);
            }
           });
    audio.setAnchorPoint(cc.p(0,0));
    if (sh.xcfg.sound.open) {
      audio.setSelectedIndex(0);
    } else {
      audio.setSelectedIndex(1);
    }

    menu= new cc.Menu(audio);
    menu.setPosition(csts.TILE + csts.S_OFF, csts.TILE + csts.S_OFF);
    this.addItem(menu);

    s2= new cc.Sprite( sh.getImagePath('gui.mmenu.back'));
    s1= new cc.Sprite( sh.getImagePath('gui.mmenu.quit'));
    t2 = new cc.MenuItemSprite(s2, null, null, function() {
      this.options.onBack();
    }, this);
    t1 = new cc.MenuItemSprite(s1, null, null, function() {
      this.pkQuit();
    }, this);

    menu= new cc.Menu(t1,t2);
    menu.alignItemsHorizontallyWithPadding(10);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF - (s2.getContentSize().width + s1.getContentSize().width + 10) / 2,
      csts.TILE + csts.S_OFF + s2.getContentSize().height / 2);
    this.addItem(menu);
  },

  rtti: function() {
    return 'XMenuLayer';
  },

  pkQuit: function() {
    var ss= sh.protos['StartScreen'],
    yn= sh.protos['YesNo'],
    dir = cc.director;

    dir.pushScene( yn.create({
      onBack: function() { dir.popScene(); },
      yes: function() {
        sh.sfxPlay('game_quit');
        dir.replaceRootScene( ss.create() );
      }
    }));
  }

});

asterix.XMenuLayer.onShowMenu = function() {
  var dir= cc.director;
  dir.pushScene( sh.protos['MainMenu'].create({
    onBack: function() {
      dir.popScene();
    }
  }));
};

}).call(this);


