!function(e,t){function i(){return location.origin+location.pathname}function l(){for(var e,i=[],l=t.location.href.slice(t.location.href.indexOf("?")+1).split("&"),r=0;r<l.length;r++)e=l[r].split("="),Array.isArray(e[0],i)>-1&&(i[e[0]]=e[1]);return i}function r(e){A.id="eyesmedia_rim_css",A.rel="stylesheet",A.type="text/css",A.href=t.RIM.cssPath,A.onload=function(){y=!0,e()},L.appendChild(A)}function n(){var i="";i+=I?'<div class="eyemedia-rim-area">':'<div class="eyemedia-rim-area outSide">',i+=' <div class="rim-ctrl-box" style="background-color: '+d.barBgColor+';" id="eyesmedia_rim_root_box'+d.id+'">',i+='   <a class="rim-home-btn" href="'+_+'" aria-label="go to bot site">',i+=d.goImIcon,i+="   </a>",i+='   <div class="rim-ctrl-txt rim-hide">',i+='     <span id="eyesmedia_rim_btn'+d.id+'" style="color: '+d.barFontColor+';">',i+=B.richMenuListModel.menuTitle,i+="     </span>",i+="   </div>",i+=" </div>",i+=' <div class="rim-item-box rim-absolute rim-hide" id="eyesmedia_rim_item_box'+d.id+'"',i+='   style="background-image: url('+B.richMenuListModel.backgroundImage+')">';for(var l=0;l<T[B.richMenuListModel.templateType].length;l++){var r=T[B.richMenuListModel.templateType][l].cell,n=T[B.richMenuListModel.templateType][l].h,c=n?"rim-item-H":"",o=B.richMenuListModel.richMenuUnits[l].messageType,a="TEXT"===o,s=B.richMenuListModel.richMenuUnits[l].content,m=a?"eyesmedia_rim_textBtnID_"+l:"";"TEXT"===o&&(k.push(m),i+='<div  class="rim-item rim-item-'+r+"cell "+c+'"><a',i+=' id="'+m+'" content="'+s+'" aria-label="自動發話">'),"LINK"==o&&(s.indexOf("http")<0&&(s="https://"+s),i+='<div class="rim-item rim-item-'+r+"cell "+c+'"><a href="'+s+'" aria-label="前往連結">'),"OPEN_WINDOW"===o&&(s.indexOf("http")<0&&(s="https://"+s),i+='<div class="rim-item rim-item-'+r+"cell "+c+'"><a href="'+s+'" target="_blank" aria-label="前往連結">'),"SCRIPT"===o&&(i+='<div  class="rim-item rim-item-'+r+"cell "+c+'"><a',i+=' class="eyesmedia_rim_scriptBtn" content="'+s+'" aria-label="客製化腳本">'),i+="</a></div>"}i+=" </div>",i+=' <div class="rim-words-box" style="background-image: url('+B.robotConfigModel.robotBase64BackgroundImage+')" id="eyesmedia_rim_words_box'+d.id+'">',i+='   <div class="rim-close-btn" id="eyesmedia_rim_close_btn'+d.id+'">'+E+"</div>",i+="   是否要離開此頁面，前往"+B.robotConfigModel.serviceName+"？",i+='   <div class="rim-toIm">',i+='     <a aria-label="立即前往">',i+="       立即前往",i+="     </a>",i+="   </div>",i+=" </div>",i+=" ",i+="</div>",O.insertAdjacentHTML("beforeend",i),h=e.getElementById("eyesmedia_rim_root_box"+d.id),u=e.getElementById("eyesmedia_rim_item_box"+d.id),g=e.getElementById("eyesmedia_rim_btn"+d.id),p=e.getElementById("eyesmedia_rim_words_box"+d.id),f=e.getElementById("eyesmedia_rim_close_btn"+d.id),$RIMscripBtn=e.getElementsByClassName("eyesmedia_rim_scriptBtn"),g.addEventListener("click",function(){var e=u.className,i=e.indexOf("rim-hide")>0;i?(u.setAttribute("class","rim-item-box rim-absolute"),g.parentElement.setAttribute("class","rim-ctrl-txt")):(u.setAttribute("class","rim-item-box rim-absolute rim-hide"),g.parentElement.setAttribute("class","rim-ctrl-txt rim-hide")),f.click(),t.RIM.clickBar(!i,u.offsetHeight)},!1),f.addEventListener("click",function(){p.setAttribute("class","rim-words-box rim-hide")},!1);for(var l=0;l<k.length;l++){var b=k[l];e.getElementById(b).addEventListener("click",function(i){if(C=e.getElementById(i.target.id).getAttribute("content"),I)return t.eyesmedia_sendMssage(C),g.click(),!1;C=e.getElementById(i.target.id).getAttribute("content");var l=p.getElementsByTagName("a")[0],r=new URL(x),n=r.origin+r.pathname+"redirect"+r.search,c=n+"&content="+C;l.setAttribute("href",c);var o=u.offsetHeight;p.setAttribute("class","rim-words-box rim-show"),p.setAttribute("style","height: "+o+"px; background-image: url("+B.robotConfigModel.robotBase64BackgroundImage+");")},!1)}$RIMscripBtn.length&&[].forEach.call($RIMscripBtn,function(t){t.addEventListener("click",function(t){var i=t.target.getAttribute("content"),l=e.createElement("script");l.type="text/javascript",l.src=i,l.id="TMS_richmenu_script";var r=e.getElementsByTagName("script")[0];r.parentNode.insertBefore(l,r)})}),"SHOW"===B.richMenuListModel.displayType&&setTimeout(function(){g.click()},500)}function c(e){d.spaceDOM=e}function o(){return w}function a(){return b&&(h.remove(),h=void 0,d.spaceDOM&&(d.spaceDOM.style.marginBottom="auto"),b=!1),null!==b}function s(e,l){var l=l;if(!d.accountKey)return console.error("accountKey is undefined"),!1;if(!e)return console.error("qaCardSetId is undefined"),!1;if(b)return console.error("Can only be initialized once"),!1;if(null===b)return console.error("initialization in progressing"),!1;b=null,d.id=e;var c=t.RIM.apiDomain+t.RIM.apiPath+d.id+"/WEB";fetch(c,{cache:"no-cache",headers:{"content-type":"application/json","X-ACCOUNT":d.accountKey},mode:"cors"}).then(function(e){if(e.ok)return e.json();throw new Error("Network response was not ok.")}).then(function(e){if("996600001"!==e.errorCode&&"286610002"!==e.errorCode)throw b=!1,w=!1,new Error("errorCode: "+e.errorCode);return"286610002"===e.errorCode?(w=!1,l(w),!1):(b=!0,B=e.data,w=!0,v=i(),x=B.serviceCtrlModel.custmizSetting.imLinkUrl,_=x,I=_.indexOf(v)!==-1,"function"==typeof l&&l(w),d.spaceDOM&&(d.spaceDOM.style.marginBottom=d.barTopSpace),void(y?n():r(n)))})["catch"](function(e){console.error("There has been a problem: ",e.message)})}var d={accountKey:null,id:null,autoInit:!0,spaceDOM:null,barFontColor:"#fff",barBgColor:"#4f628d",barTopSpace:0,goImIcon:function(){var e="";return e+='<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"',e+='  viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve">',e+='  <style type="text/css">.rim-st1{fill:#FFFFFF;}</style>',e+='  <path class="rim-st1" d="M46,20.6H14c-1.5,0-2.7-1.2-2.7-2.7l0,0c0-1.5,1.2-2.7,2.7-2.7h32c1.5,0,2.7,1.2,2.7,2.7l0,0',e+='    C48.7,19.4,47.5,20.6,46,20.6z"/>',e+='  <path class="rim-st1" d="M46,32.7H14c-1.5,0-2.7-1.2-2.7-2.7l0,0c0-1.5,1.2-2.7,2.7-2.7h32c1.5,0,2.7,1.2,2.7,2.7l0,0',e+='    C48.7,31.5,47.5,32.7,46,32.7z"/>',e+='  <path class="rim-st1" d="M46,44.8H14c-1.5,0-2.7-1.2-2.7-2.7l0,0c0-1.5,1.2-2.7,2.7-2.7h32c1.5,0,2.7,1.2,2.7,2.7l0,0',e+='    C48.7,43.7,47.5,44.8,46,44.8z"/>',e+="</svg>"}(),init:s,setSpaceDOM:c,getHaveRichmenu:o,clickBar:function(){},destroy:a};for(var m in t.RIM.config)d[m]=t.RIM.config[m],"goImIcon"===m&&(d.goImIcon='<img src="'+t.RIM.config.goImIcon+'" alt="go to bot site">');t.RIM=d;var h,u,g,p,f,b=!1,y=!1,v=null,M=null,x=null,_=null,I=null,w=null,B=null,E=function(){var e="";return e+='<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"',e+='viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve">',e+='<style type="text/css">.rim-st2{fill:#4F628D;}</style>',e+='<g><path class="rim-st2" d="M17.8,15l5.3-5.3c0.8-0.8,0.8-2.1,0-2.8v0c-0.8-0.8-2.1-0.8-2.8,0L15,12.2L9.7,',e+="6.9c-0.8-0.8-2.1-0.8-2.8,0v0c-0.8,0.8-0.8,2.1,0,2.8l5.3,5.3l-5.3,5.3c-0.8,0.8-0.8,2.1,0,2.8s2.1,0.8,2.8,",e+='0l5.3-5.3l5.3,5.3c0.8,0.8,2.1,0.8,2.8,0s0.8-2.1,0-2.8L17.8,15z"/></g></svg>'}(),k=[],C=null,T={F01:[{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1}],E01:[{cell:2,h:!1},{cell:2,h:!1},{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1}],D01:[{cell:4,h:!0},{cell:4,h:!0},{cell:4,h:!0},{cell:4,h:!0}],D02:[{cell:2,h:!1},{cell:2,h:!1},{cell:2,h:!1},{cell:2,h:!1}],C01:[{cell:3,h:!0},{cell:3,h:!0},{cell:3,h:!0}],C02:[{cell:1,h:!1},{cell:2,h:!1},{cell:2,h:!1}],B01:[{cell:2,h:!0},{cell:2,h:!0}],A01:[{cell:1,h:!0}],A02:[{cell:1,h:!1}],B02:[{cell:2,h:!1},{cell:2,h:!1}],C03:[{cell:3,h:!1},{cell:3,h:!1},{cell:3,h:!1}],D03:[{cell:4,h:!1},{cell:4,h:!1},{cell:4,h:!1},{cell:4,h:!1}]},L=e.getElementsByTagName("head")[0],A=e.createElement("link"),O=e.getElementsByTagName("body")[0];M=l(),d.autoInit&&s(d.id)}(document,window);
!function(a,t){t.RIM.apiDomain="https://uat.justka.ai.com.tw",t.RIM.apiPath="/sdk/richmenu/device/",t.RIM.cssPath="https://s3-ap-northeast-1.amazonaws.com/cdn.eyesmedia.com.tw/uat/sdk/richmenu/v1.0.0/eyesmedia.rim.css"}(document,window);