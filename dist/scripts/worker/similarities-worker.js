!function(){var e,n,t;!function(r){function i(e,n){return O.call(e,n)}function o(e,n){var t,r,i,o,a,u,s,l,f,c,p,h,g=n&&n.split("/"),d=y.map,m=d&&d["*"]||{};if(e){for(e=e.split("/"),a=e.length-1,y.nodeIdCompat&&k.test(e[a])&&(e[a]=e[a].replace(k,"")),"."===e[0].charAt(0)&&g&&(h=g.slice(0,g.length-1),e=h.concat(e)),f=0;f<e.length;f++)if("."===(p=e[f]))e.splice(f,1),f-=1;else if(".."===p){if(0===f||1===f&&".."===e[2]||".."===e[f-1])continue;f>0&&(e.splice(f-1,2),f-=2)}e=e.join("/")}if((g||m)&&d){for(t=e.split("/"),f=t.length;f>0;f-=1){if(r=t.slice(0,f).join("/"),g)for(c=g.length;c>0;c-=1)if((i=d[g.slice(0,c).join("/")])&&(i=i[r])){o=i,u=f;break}if(o)break;!s&&m&&m[r]&&(s=m[r],l=f)}!o&&s&&(o=s,u=l),o&&(t.splice(0,u,o),e=t.join("/"))}return e}function a(e,n){return function(){var t=b.call(arguments,0);return"string"!=typeof t[0]&&1===t.length&&t.push(null),g.apply(r,t.concat([e,n]))}}function u(e){return function(n){return o(n,e)}}function s(e){return function(n){v[e]=n}}function l(e){if(i(x,e)){var n=x[e];delete x[e],w[e]=!0,h.apply(r,n)}if(!i(v,e)&&!i(w,e))throw new Error("No "+e);return v[e]}function f(e){var n,t=e?e.indexOf("!"):-1;return t>-1&&(n=e.substring(0,t),e=e.substring(t+1,e.length)),[n,e]}function c(e){return e?f(e):[]}function p(e){return function(){return y&&y.config&&y.config[e]||{}}}var h,g,d,m,v={},x={},y={},w={},O=Object.prototype.hasOwnProperty,b=[].slice,k=/\.js$/;d=function(e,n){var t,r=f(e),i=r[0],a=n[1];return e=r[1],i&&(i=o(i,a),t=l(i)),i?e=t&&t.normalize?t.normalize(e,u(a)):o(e,a):(e=o(e,a),r=f(e),i=r[0],e=r[1],i&&(t=l(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:t}},m={require:function(e){return a(e)},exports:function(e){var n=v[e];return void 0!==n?n:v[e]={}},module:function(e){return{id:e,uri:"",exports:v[e],config:p(e)}}},h=function(e,n,t,o){var u,f,p,h,g,y,O,b=[],k=typeof t;if(o=o||e,y=c(o),"undefined"===k||"function"===k){for(n=!n.length&&t.length?["require","exports","module"]:n,g=0;g<n.length;g+=1)if(h=d(n[g],y),"require"===(f=h.f))b[g]=m.require(e);else if("exports"===f)b[g]=m.exports(e),O=!0;else if("module"===f)u=b[g]=m.module(e);else if(i(v,f)||i(x,f)||i(w,f))b[g]=l(f);else{if(!h.p)throw new Error(e+" missing "+f);h.p.load(h.n,a(o,!0),s(f),{}),b[g]=v[f]}p=t?t.apply(v[e],b):void 0,e&&(u&&u.exports!==r&&u.exports!==v[e]?v[e]=u.exports:p===r&&O||(v[e]=p))}else e&&(v[e]=t)},e=n=g=function(e,n,t,i,o){if("string"==typeof e)return m[e]?m[e](n):l(d(e,c(n)).f);if(!e.splice){if(y=e,y.deps&&g(y.deps,y.callback),!n)return;n.splice?(e=n,n=t,t=null):e=r}return n=n||function(){},"function"==typeof t&&(t=i,i=o),i?h(r,e,n,t):setTimeout(function(){h(r,e,n,t)},4),g},g.config=function(e){return g(e)},e._defined=v,t=function(e,n,t){if("string"!=typeof e)throw new Error("See almond README: incorrect module build, no module name");n.splice||(t=n,n=[]),i(v,e)||i(x,e)||(x[e]=[e,n,t])},t.amd={jQuery:!0}}(),t("almond",function(){}),t("modules/tokens",{seperate:function(e,n){var t=n||1;if("string"==typeof e){return e.replace(/([a-z])([A-Z]+)/g,"$1 $2").split(/\s+/g).filter(function(e){return e.length>=t})}return[]},clean:function(e){var n=/[@,\.\-–;:_\?!\\§$%&#\/\(\)=\+±`'‚’„“”"\*´°><^\[\]]+/g;return"string"==typeof e?e.replace(n," "):""},count:function(e){for(var n={},t=0;t<e.length;t++){var r=e[t];n[r]=n[r]+1||1}return n},update:function(e,n,t,r,i){for(var o=t||[],a=r||1,u=i||2.5,s=0;s<n.length;s++){var l=n[s];e[l]=e[l]+a||a,-1!==o.indexOf(l)&&"@"!==l.slice(0,1)&&(e[l]=e[l]+u)}},ngram:function(e,n,t){function r(e,n){var t=n>1?n-1:1,r=[];if(e.length>t)for(var i=0,o=e.length-t;i<o;i++){for(var a=[],u=0;u<n;u++){var s=e[i+u];s&&""!==s&&a.push(s)}a.length===n&&r.push(a.join(" "))}else 1===e.length&&r.push(e[0]);return r}var i=this.clean(e),o=this.seperate(i,t);if(0===parseInt(n)||-3===parseInt(n)){return["@total"].concat(o,r(o,2),r(o,3))}if(-2===parseInt(n)){return["@total"].concat(o,r(o,2))}return["@total"].concat(1===parseInt(n)?o:r(o,parseInt(n)))}}),t("modules/vectors",{create:function(e,n){for(var t=[],r=1,i=n.length;r<i;r++){var o=n[r];e.hasOwnProperty(o)?t[r-1]=e[o]:t[r-1]=0}return t},createBulk:function(e,n){for(var t=[],r=n.length,i=[],o=0;o<1e4*Math.floor(r/1e4);o+=1e4)i.push(n.slice(o,o+1e4));i.push(n.slice(r-r%1e4));for(var a=0;a<i.length;a++){var u=this.create(e,i[a]);t.push(u)}return[].concat.apply([],t)},match:function(e,n){for(var t=e.concat(n),r=[],i=0;i<t.length;i++)-1===r.indexOf(t[i])&&r.push(t[i]);return r},dot:function(e,n){for(var t=0,r=0;r<e.length;r++)t+=e[r]*n[r];return t},norm:function(e){return Math.sqrt(this.dot(e,e))},cosine:function(e,n){return this.dot(e,n)/(this.norm(e)*this.norm(n))},custom:function(e,n){return this.dot(e,n)/this.norm(e)*this.norm(n)},l1:function(e,n){for(var t=0,r=0;r<e.length;r++)t+=Math.abs(e[r]-n[r]);return 1/t}}),t("utilities/similarities",["modules/tokens","modules/vectors"],function(e,n){return this.sim={defaults:{similarityCalc:"cosine",similarityThreshold:90,signalsEnabled:!1,signalWeighting:2.5,tokenWeighting:1,minNrOfTokens:1,minLengthOfTokens:0,nrOfNgrams:2},dict:{},lookup:function(e,n){var t=sim.dict;return!!(t.hasOwnProperty(e)&&t[e].hasOwnProperty(n)||t.hasOwnProperty(n)&&t[n].hasOwnProperty(e))||(t.hasOwnProperty(e)||(t[e]={}),t[e][n]=!0,!1)},read:function(t,r){for(var i=Object.assign({},sim.defaults,r),o={},a={},u={},s=0,l=t.length;s<l;s++){var f=t[s].xid||"n"+s,c=e.ngram(t[s].txt,i.nrOfNgrams,i.minLengthOfTokens),p=[];if(i.signalsEnabled&&t[s].hasOwnProperty("sig")&&(p=e.ngram(t[s].sig,i.nrOfNgrams,i.minLengthOfTokens)),c.length>=i.minNrOfTokens){o[f]={},e.update(o[f],c,p,i.tokenWeighting,i.signalWeighting);for(var h in o[f])!1===u.hasOwnProperty(h)&&(u[h]=!0)}}var g=Object.keys(u);u=void 0;for(var d in o)a[d]=n.createBulk(o[d],g);return o=void 0,g=void 0,a},analyze:function(e,t){var r=Object.assign({},sim.defaults,t),i=[],o=this.read(e,t);for(var a in o){var u=o[a];for(var s in o)if(s!==a&&!this.lookup(a,s)){var l=o[s],f=n[r.similarityCalc](u,l);f>1&&(f=1),f>=r.similarityThreshold/100&&i.push([f,[a,s]])}}return i}},this.sim}),t("helper/util",[],function(){var e={browserHasFunctionality:function(){var e=window.Worker&&window.File&&window.FileReader&&window.DOMParser&&window.fetch&&Object.keys&&Object.assign,n=/Trident/i.test(navigator.userAgent);return e&&!n},stripURL:function(e){return e&&-1!==e.indexOf("#")?e.substring(e.indexOf("#")+1):"start"},makeUnique:function(e){for(var n={},t=0;t<e.length;t++)n[e[t]]=!0;return Object.keys(n)},pushArray:function(e,n){return Array.prototype.push.apply(e,n),e},indexOfMax:function(e){for(var n=e[0],t=0,r=1;r<e.length;r++)e[r]>n&&(t=r,n=e[r]);return t},getClassDistribution:function(e){var n=[];if(e.constructor===Object)for(var t in e)"@"!==t.substring(0,1)&&n.push({label:t,value:e[t]["@total"]});else{for(var r={},i=0;i<e.length;i++)r[e[i].clf]=r[e[i].clf]+1||1;for(var o in r)n.push({label:o,value:r[o]})}return n},copyObject:function(e){return JSON.parse(JSON.stringify(e))},createFileName:function(e){return"fastclass_"+e.replace(/\s+/g,"-").replace(/[@,\.;:\?!\\§$%&#\/\(\)=\+±`'‚’„“”"\*´°><^\[\]]+/g,"")},requireCSS:function(e){if(!1===Array.prototype.slice.call(document.getElementsByTagName("link")).some(function(n){return n.attributes.href.value===e})){var n=document.createElement("link");n.type="text/css",n.rel="stylesheet",n.href=e,document.getElementsByTagName("head")[0].appendChild(n)}},downloadFile:function(n,t,r){var i=r?n:JSON.stringify(n),o=new Blob([i],{type:"octet/stream"});e.downloadBlob(o,t)},downloadBlob:function(e,n){var t=window.URL.createObjectURL(e),r=document.createElement("a");r.download=n,r.href=t,r.click(),r.remove(),window.URL.revokeObjectURL(t)},getUUID:function(e){var n=(new Date).getTime();return(e||"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(/[xy]/g,function(e){var t=(n+16*Math.random())%16|0;return n=Math.floor(n/16),("x"==e?t:3&t|8).toString(16)})},hashString:function(e){var n,t,r=0;if(0===this.length)return r;for(n=0;n<this.length;n++)t=this.charCodeAt(n),r=(r<<5)-r+t,r|=0;return r},findOverlap:function(n,t){return 0===t.length?"":n.endsWith(t)?t:n.indexOf(t)>=0?t:e.findOverlap(n,t.substring(0,t.length-1))},getSlug:function(e){e=e.replace(/^\s+|\s+$/g,""),e=e.toLowerCase();for(var n="àáäâèéëêìíïîòóöôùúüûñç·/_,:;",t="aaaaeeeeiiiioooouuuunc------",r=0,i=n.length;r<i;r++)e=e.replace(new RegExp(n.charAt(r),"g"),t.charAt(r));return e=e.replace(/[^a-z0-9 -]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")},getLocale:function(){return document.documentElement.lang},getTime:function(){return performance?performance.now():Date.now()},getDateString:function(){return(new Date).toISOString()},round:function(e,n){var t=n||0;return Math.round(e*Math.pow(10,t))/Math.pow(10,t)},percent:function(n,t,r){if(n&&t&&0!==t)return e.round(n/t*100,r)+"%"}};return e}),n(["utilities/similarities","helper/util"],function(e,n){self.postMessage({ready:!0});var t={findSimilar:function(n,r){var i=performance.now(),o=e.analyze(n,r),a=t.d3MapData(o),u=performance.now(),s=u-i;self.postMessage([o,s,a])},d3MapData:function(e){for(var t=[],r={nodes:[],links:[]},i=0;i<e.length;i++){var o=e[i][1][0],a=e[i][1][1],u=e[i][0];-1===t.indexOf(o)&&(t.push(o),r.nodes.push({id:o,group:1})),-1===t.indexOf(a)&&(t.push(a),r.nodes.push({id:a,group:1})),r.links.push({source:o,target:a,value:n.round(u,10)})}return r}};self.addEventListener("message",function(e){var n=e.data[0],r=e.data.splice(1);if(!t.hasOwnProperty(n))throw new Error("No function with name: "+n);t[n].apply(this,r)})}),t("smWorker",function(){}),n(["smWorker"])}();