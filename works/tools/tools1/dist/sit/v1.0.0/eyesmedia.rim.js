!function(s,a){var e,m={accountKey:null,id:null,autoInit:!0,spaceDOM:null,barFontColor:"#fff",barBgColor:"#4f628d",barTopSpace:0,goImIcon:'<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve">  <style type="text/css">.rim-st1{fill:#FFFFFF;}</style>  <path class="rim-st1" d="M46,20.6H14c-1.5,0-2.7-1.2-2.7-2.7l0,0c0-1.5,1.2-2.7,2.7-2.7h32c1.5,0,2.7,1.2,2.7,2.7l0,0    C48.7,19.4,47.5,20.6,46,20.6z"/>  <path class="rim-st1" d="M46,32.7H14c-1.5,0-2.7-1.2-2.7-2.7l0,0c0-1.5,1.2-2.7,2.7-2.7h32c1.5,0,2.7,1.2,2.7,2.7l0,0    C48.7,31.5,47.5,32.7,46,32.7z"/>  <path class="rim-st1" d="M46,44.8H14c-1.5,0-2.7-1.2-2.7-2.7l0,0c0-1.5,1.2-2.7,2.7-2.7h32c1.5,0,2.7,1.2,2.7,2.7l0,0    C48.7,43.7,47.5,44.8,46,44.8z"/></svg>',init:t,setSpaceDOM:function(e){m.spaceDOM=e},getHaveRichmenu:function(){return c},clickBar:function(){},destroy:function(){l&&(d.remove(),d=void 0,m.spaceDOM&&(m.spaceDOM.style.marginBottom="auto"),l=!1);return null!==l}};for(e in a.RIM.config)m[e]=a.RIM.config[e],"goImIcon"===e&&(m.goImIcon='<img src="'+a.RIM.config.goImIcon+'" alt="go to bot site">');a.RIM=m;var d,h,u,g,p,l=!1,r=!1,n=null,b=null,y=null,f=null,c=null,v=null,M='<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve"><style type="text/css">.rim-st2{fill:#4F628D;}</style><g><path class="rim-st2" d="M17.8,15l5.3-5.3c0.8-0.8,0.8-2.1,0-2.8v0c-0.8-0.8-2.1-0.8-2.8,0L15,12.2L9.7,6.9c-0.8-0.8-2.1-0.8-2.8,0v0c-0.8,0.8-0.8,2.1,0,2.8l5.3,5.3l-5.3,5.3c-0.8,0.8-0.8,2.1,0,2.8s2.1,0.8,2.8,0l5.3-5.3l5.3,5.3c0.8,0.8,2.1,0.8,2.8,0s0.8-2.1,0-2.8L17.8,15z"/></g></svg>',x=[],_=null,I={F01:[{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1}],E01:[{cell:2,h:!1},{cell:2,h:!1},{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1}],D01:[{cell:4,h:!0},{cell:4,h:!0},{cell:4,h:!0},{cell:4,h:!0}],D02:[{cell:2,h:!1},{cell:2,h:!1},{cell:2,h:!1},{cell:2,h:!1}],C01:[{cell:3,h:!0},{cell:3,h:!0},{cell:3,h:!0}],C02:[{cell:1,h:!1},{cell:2,h:!1},{cell:2,h:!1}],B01:[{cell:2,h:!0},{cell:2,h:!0}],A01:[{cell:1,h:!0}],A02:[{cell:1,h:!1}],B02:[{cell:2,h:!1},{cell:2,h:!1}],C03:[{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1}],D03:[{cell:4,h:!1},{cell:4,h:!1},{cell:4,h:!1},{cell:4,h:!1}]},o=s.getElementsByTagName("head")[0],w=s.createElement("link"),B=s.getElementsByTagName("body")[0];function E(){var e="";e+=f?'<div class="eyemedia-rim-area">':'<div class="eyemedia-rim-area outSide">',e+=' <div class="rim-ctrl-box" style="background-color: '+m.barBgColor+';" id="eyesmedia_rim_root_box'+m.id+'">',e+='   <a class="rim-home-btn" href="'+y+'" aria-label="go to bot site">',e+=m.goImIcon,e+="   </a>",e+='   <div class="rim-ctrl-txt rim-hide">',e+='     <span id="eyesmedia_rim_btn'+m.id+'" style="color: '+m.barFontColor+';">',e+=v.richMenuListModel.menuTitle,e+="     </span>",e+="   </div>",e+=" </div>",e+=' <div class="rim-item-box rim-absolute rim-hide" id="eyesmedia_rim_item_box'+m.id+'"',e+='   style="background-image: url('+v.richMenuListModel.backgroundImage+')">';for(var t=0;t<I[v.richMenuListModel.templateType].length;t++){var i=I[v.richMenuListModel.templateType][t].cell,l=I[v.richMenuListModel.templateType][t].h?"rim-item-H":"",r=v.richMenuListModel.richMenuUnits[t].messageType,n=v.richMenuListModel.richMenuUnits[t].content,c="TEXT"===r?"eyesmedia_rim_textBtnID_"+t:"";"TEXT"===r&&(x.push(c),e+='<div  class="rim-item rim-item-'+i+"cell "+l+'"><a',e+=' id="'+c+'" content="'+n+'" aria-label="自動發話">'),"LINK"==r&&(e+='<div class="rim-item rim-item-'+i+"cell "+l+'"><a href="'+(n=n.indexOf("http")<0?"https://"+n:n)+'" aria-label="前往連結">'),"OPEN_WINDOW"===r&&(e+='<div class="rim-item rim-item-'+i+"cell "+l+'"><a href="'+(n=n.indexOf("http")<0?"https://"+n:n)+'" target="_blank" aria-label="前往連結">'),"SCRIPT"===r&&(e+='<div  class="rim-item rim-item-'+i+"cell "+l+'"><a',e+=' class="eyesmedia_rim_scriptBtn" content="'+n+'" aria-label="客製化腳本">'),e+="</a></div>"}e+=" </div>",e+=' <div class="rim-words-box" style="background-image: url('+v.robotConfigModel.robotBase64BackgroundImage+')" id="eyesmedia_rim_words_box'+m.id+'">',e+='   <div class="rim-close-btn" id="eyesmedia_rim_close_btn'+m.id+'">'+M+"</div>",e+="   是否要離開此頁面，前往"+v.robotConfigModel.serviceName+"？",e+='   <div class="rim-toIm">',e+='     <a aria-label="立即前往">',e+="       立即前往",e+="     </a>",e+="   </div>",e+=" </div>",e+=" ",B.insertAdjacentHTML("beforeend",e+="</div>"),d=s.getElementById("eyesmedia_rim_root_box"+m.id),h=s.getElementById("eyesmedia_rim_item_box"+m.id),u=s.getElementById("eyesmedia_rim_btn"+m.id),g=s.getElementById("eyesmedia_rim_words_box"+m.id),p=s.getElementById("eyesmedia_rim_close_btn"+m.id),$RIMscripBtn=s.getElementsByClassName("eyesmedia_rim_scriptBtn"),u.addEventListener("click",function(){var e=0<h.className.indexOf("rim-hide");e?(h.setAttribute("class","rim-item-box rim-absolute"),u.parentElement.setAttribute("class","rim-ctrl-txt")):(h.setAttribute("class","rim-item-box rim-absolute rim-hide"),u.parentElement.setAttribute("class","rim-ctrl-txt rim-hide")),p.click(),a.RIM.clickBar(!e,h.offsetHeight)},!1),p.addEventListener("click",function(){g.setAttribute("class","rim-words-box rim-hide")},!1);for(t=0;t<x.length;t++){var o=x[t];s.getElementById(o).addEventListener("click",function(e){if(_=s.getElementById(e.target.id).getAttribute("content"),f)return a.eyesmedia_sendMssage(_),u.click(),!1;_=s.getElementById(e.target.id).getAttribute("content");var t=g.getElementsByTagName("a")[0],e=new URL(b),e=e.origin+e.pathname+"redirect"+e.search+"&content="+_;t.setAttribute("href",e);e=h.offsetHeight;g.setAttribute("class","rim-words-box rim-show"),g.setAttribute("style","height: "+e+"px; background-image: url("+v.robotConfigModel.robotBase64BackgroundImage+");")},!1)}$RIMscripBtn.length&&[].forEach.call($RIMscripBtn,function(e){e.addEventListener("click",function(e){var t=e.target.getAttribute("content"),e=s.createElement("script");e.type="text/javascript",e.src=t,e.id="TMS_richmenu_script";t=s.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})}),"SHOW"===v.richMenuListModel.displayType&&setTimeout(function(){u.click()},500)}function t(e,i){if(!m.accountKey)return console.error("accountKey is undefined"),!1;if(!e)return console.error("qaCardSetId is undefined"),!1;if(l)return console.error("Can only be initialized once"),!1;if(null===l)return console.error("initialization in progressing"),!1;l=null,m.id=e;e=a.RIM.apiDomain+a.RIM.apiPath+m.id+"/WEB";fetch(e,{cache:"no-cache",headers:{"content-type":"application/json","X-ACCOUNT":m.accountKey},mode:"cors"}).then(function(e){if(e.ok)return e.json();throw new Error("Network response was not ok.")}).then(function(e){if("996600001"!==e.errorCode&&"286610002"!==e.errorCode)throw c=l=!1,new Error("errorCode: "+e.errorCode);if("286610002"===e.errorCode)return i(c=!1),!1;var t;l=!0,v=e.data,c=!0,n=location.origin+location.pathname,b=v.serviceCtrlModel.custmizSetting.imLinkUrl,f=-1!==(y=b).indexOf(n),"function"==typeof i&&i(c),m.spaceDOM&&(m.spaceDOM.style.marginBottom=m.barTopSpace),r?E():(t=E,w.id="eyesmedia_rim_css",w.rel="stylesheet",w.type="text/css",w.href=a.RIM.cssPath,w.onload=function(){r=!0,t()},o.appendChild(w))}).catch(function(e){console.error("There has been a problem: ",e.message)})}(function(){for(var e,t=[],i=a.location.href.slice(a.location.href.indexOf("?")+1).split("&"),l=0;l<i.length;l++)e=i[l].split("="),-1<Array.isArray(e[0],t)&&(t[e[0]]=e[1])})(),m.autoInit&&t(m.id)}(document,window);
!function(s){s.RIM.apiDomain="https://sit.eyesmedia.com.tw",s.RIM.apiPath="/sdk/richmenu/device/",s.RIM.cssPath="https://s3-ap-northeast-1.amazonaws.com/cdn.eyesmedia.com.tw/sit/sdk/richmenu/v1.0.0/eyesmedia.rim.css"}((document,window));