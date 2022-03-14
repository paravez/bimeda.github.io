/*$Id: navigation.js,v 2030:c5f590d454a5 2011/07/19 10:33:16 prashantd $*/
var navOffsetParent;
window.mobilePageCanvasReady = true;
var childPage;
var ofwParent;
var navTop;
var bFlg=false;
var iconMenu=false;
/*var touch=false;
var uagent = navigator.userAgent;
if(uagent.indexOf("iPhone")!=-1||uagent.indexOf("iPad")!=-1||uagent.indexOf("Mobile Safari")!=-1||uagent.indexOf("Nokia")!=-1|| uagent.indexOf("Fennec")!=-1||  uagent.indexOf("Opera Mini")!=-1||uagent.indexOf("IEMobile")!=-1)
   touch=true;
*/
/*var mobile;
var userAgent = navigator.userAgent;
mobile =!!(userAgent.match(/(iPhone|iPod|blackberry|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i));*/
var navAlignHor = true;
var pReload = true;
navOffset = function (el) {
    var curleft = 0, curtop = 0;
    if (el.offsetParent) {
        curleft = el.offsetLeft;
        curtop = el.offsetTop;
        while ((el = el.offsetParent) && (el!=navOffsetParent)) {
            curleft += el.offsetLeft;
            curtop += el.offsetTop;
        }
    }
    var n = {
        left:curleft,
        top:curtop
    };
    return n;
}

navOffsetParents = function (el) {
    var curleft = 0, curtop = 0;
    if (el.offsetParent) {
        curleft = el.offsetLeft;
        curtop = el.offsetTop;
        while ((el = el.offsetParent) && (el!=navOffsetParent)) {
            curleft += el.offsetLeft;
            curtop += el.offsetTop;
        }
    }
    var n = {
        left:curleft,
        top:curtop
    };
    return n;
}

navGetStyle = function(el,prop) {
    var val;
    if(window.getComputedStyle) {
        var cmpstyle = window.getComputedStyle(el,'')
        if(cmpstyle!=null)val = cmpstyle.getPropertyValue("float"); //NO I18N
    }else if(el.currentStyle) {
        if(prop == 'float') prop='styleFloat'
        prop = prop.replace(/\-(\w)/g,function(s, l) {
            return l.toUpperCase();
        })
        val = el.currentStyle[prop];
    }
    return val;
}
navGetOffsetParent = function(el){
    do {
        el = el.offsetParent;
        if(el) {
            var tn = el.tagName.toLowerCase();
            if(tn == 'body' || tn == 'html') break;
            if(navGetStyle(el,'position') != 'static') break;
        }
    }while(el)
    return el;
}
setTimeout(function(){
    if(window.ZS_PublishMode && !window.ZS_PreviewMode){
        setCookie('userView','mobile','','/');//No I18N
        document.getElementsByTagName('body')[0].style.overflowX="hidden";// No I18N
    }
},1000);

navAppendChildPage = function(){
    childPage = document.getElementById("childPageParent");
   
    if(window.location.host.indexOf("sitebuilder-")!=-1){
        var elms = childPage.getElementsByTagName("a");
        for(var i=0;i<elms.length;i++){
            var elm = elms[i];
            if(elm.getAttribute("more")==undefined && elm.getAttribute("href").indexOf("/preview/")==-1){ elm.setAttribute("href","/preview"+elm.getAttribute("href"));}
        }
        var nav_elm = document.getElementById("navigation");
        var elms = nav_elm.getElementsByTagName("a");
        for(var i=0;i<elms.length;i++){
            var elm = elms[i];
            if(elm.getAttribute("more")==undefined && elm.getAttribute("href").indexOf("/preview/")==-1){ elm.setAttribute("href","/preview"+elm.getAttribute("href"));}
        }
    }
 
    var topNode = document.getElementById("navigation").parentNode;//No I18N
    while (topNode!=navOffsetParent){
        var ofwProp = navGetStyle(topNode,'overflow');//No I18N
        if(ofwProp=="hidden"){
            ofwParent = topNode;
        }
        topNode = topNode.parentNode; 
    }
    
    if(ofwParent){
        ofwParent.parentNode.insertBefore(childPage, ofwParent);
    }else{
    
        var navElement = document.getElementById("navigation").parentNode;//No I18N
        var p = navElement;
        var sibli = document.getElementById("navigation");
        if(sibli){
            p.insertBefore(childPage,sibli);
        }else{
            p.appendChild(childPage);
        }
        //ofwParent= childPage.parentNode;
    }
    if(!document.getElementById("childPage")){
        childPage = document.createElement('div');
        childPage.id = "childPage";
        navOffsetParent.appendChild(childPage);
    }    
}

navActivate = function(){
    navTop = document.getElementById('nav-top');
    if(navTop.children[0]&& navTop.children[0].id && navTop.children[0].id=="nav-li1234"){
        iconMenu=true;
    }
    navOffsetParent = navGetOffsetParent(navTop);
    navAppendChildPage();
    if(navTop.getAttribute("data-navorientation").toLowerCase()=="vertical"){
        //menu is vertical
        navAlignHor = false;
        //navTop.style.position='relative';
        navTop.style.left ='0px';
        //var navRoot = document.getElementById('navigation');
        //navRoot.style.position ='relative';
        //navRoot.style.overflow = 'hidden';
        //navRoot.style.width ='100%';
        //rootNavInfo = navOffset(navRoot);
        navSetClassNames();
        var maxMenu = document.getElementById("nav-li987");
        if(maxMenu){
                maxMenu.style.cursor="pointer";
        }
	if(maxMenu!=null){
            var maxFirstChild = getFirstChild(maxMenu);
            maxFirstChild.removeAttribute('href');
        }
        var ulss = navTop.getElementsByTagName("ul");
        navAlignUlLi(ulss);
        childPage.style.width ="100%";
        ulss = childPage.getElementsByTagName("ul");
        navAlignUlLi(ulss);
        navAddEventHandler(navTop);
        navAddEventHandler(childPage);
        return;
    }
    navSetClassNames();
    var tempNav = document.createElement('div');
    var tempUl = document.createElement('ul');
    var firstList = [];
    var listLis = navTop.childNodes;
    var i,j;
    for(i=0,j=0;i<listLis.length;i++){
        if(listLis[i].tagName=="LI"){
            firstList[j]=listLis[i];
            j++;
        }
    }
    ulss = navTop.getElementsByTagName("ul");
    navAlignUlLi(ulss);
    ulss = childPage.getElementsByTagName("ul");
    navAlignUlLi(ulss);
    
    if(firstList.length>1){
        var ff=navOffset(firstList[0]);
        var ss=navOffset(firstList[1]);
        if(ff.top!=ss.top){
            setTimeout(function(){
                navActivate()
            },500);
            return;
        }
    }
    for(var x=0;x<firstList.length;x++){
        tempUl.appendChild(firstList[x]);
    }
    tempNav.appendChild(tempUl);
    var len = tempUl.childNodes.length;
    var firstTop;
    var ulMore = document.createElement('ul');
    var liMore = document.createElement('li');
    for(var k=0;k<len;k++){
        var uls = tempUl.childNodes[0].getElementsByTagName("ul");
        navAlignUlLi(uls);
        var elem = tempUl.childNodes[0];
        navTop.appendChild(tempUl.childNodes[0]);
        if(k==0){
            firstTop = navOffset(elem);
        }
        var realTop=navOffset(elem);
        if(firstTop.top != realTop.top){
            ulMore.appendChild(elem);
            for(x=0;x<tempUl.childNodes.length;){
                ulMore.appendChild(tempUl.childNodes[0]);
            }
            break;
        }
    }
    var moreSub = document.createElement("div");
    moreSub.id="nav-submenu-idMore";
    moreSub.className="submenu";
    moreSub.style.display='none';
    moreSub.style.cssFloat='left';//No I18N
    moreSub.style.overflow='hidden';
    moreSub.style.width='100%';
    moreSub.style.zIndex='670';
    
    liMore.id="nav-liMore";
    liMore.className=" navArrow";
    liMore.setAttribute('navsub','nav-ulMore');
    
    ulMore.id="nav-ulMore";
    ulMore.setAttribute("navparent","nav-liMore");
    /*ulMore = document.createElement('li');
    ulMore.id="nav-liMore";
    ulMore.className=" navArrow";
    ulMore.setAttribute("navsub","nav-ulMore");*/
    
    if(ulMore.childNodes.length!=0){
        var childPageApd = document.getElementById("childPage");
        var spanMore = document.createElement('span');
        var liA = document.createElement('a');
        liA.setAttribute("more","true");
        spanMore.innerHTML="More";//No I18N
        var emMore = document.createElement('em');
        liA.appendChild(spanMore);
        liA.appendChild(emMore);
        liMore.appendChild(liA);
        
        moreSub.appendChild(ulMore);
        childPageApd.appendChild(moreSub);
        //childPageApd.appendChild(ulMore);
        //liMore.appendChild(ulMore);
        navTop.appendChild(liMore);
        uls = navTop.getElementsByTagName("ul");
        navAlignUlLi(uls);
        
        
        var liTop = navOffset(liMore);
        while(firstTop.top!=liTop.top){
            navTop.removeChild(liMore);
            ulMore.insertBefore(navTop.lastChild,ulMore.firstChild);
            moreSub.appendChild(ulMore);
            childPageApd.appendChild(moreSub);
            navTop.appendChild(liMore);
            var ulsubs = liMore.parentNode.getElementsByTagName("ul");
            navAlignUlLi(ulsubs,ulsubs.parentNode);
            liTop = navOffset(liMore);
        }
    }
    uls = childPage.getElementsByTagName("ul");
    navAlignUlLi(uls);
    navAddEventHandler(navTop);
    // only for horizontal
    childPage.style.width ="100%";
    document.getElementsByTagName("html")[0].onclick= navDisable;
    document.getElementsByTagName("html")[0].ontouchstart= navDisable;
}

navAlignUlLi = function(uls,liLL){
    var li;
    for(var i=0;ul=uls[i];i++) {
        li = ul.parentNode;
        if(li.getElementsByTagName('li')[0]){
            //navId(ul);
            //navId(li);
            //ul.setAttribute("navparent",li.id);
            //li.setAttribute("navsub",ul.id);
            //li.className = li.className+" navArrow";
            var fstChd = getFirstChild(li);
            var parElement = document.getElementById(fstChd.getAttribute("navparent"));
            if(parElement){
		fstChd = getFirstChild(parElement);
            	li.setAttribute("data-href",fstChd.getAttribute('href'));
            	parElement.removeAttribute('href');
            }
	    if(liLL==undefined){
                navAddEventHandler(ul);
            }else{
                liLL.onclick =navItemTouch;
            }
        }
    }
}

fnBindHandleClickEvents = function(){
    showmsgin = function(elem) {
    elem.onclick = function(){
        var infoElem = parent.document.getElementById("zpPreviewClickInfoMsg");
        infoElem.style.display="block";
        var msgWid = infoElem.offsetWidth;
        var wwidth = parent.document.documentElement.clientWidth;
        infoElem.style.left=(wwidth/2-msgWid/2)+'px';
        infoElem.style.top='0px';
        infoElem.style.position="absolute";
        setTimeout(function(){
            infoElem.style.display='none';
        },1000); 
        return false;
    }  
}
    if(parent.mobilePreview || parent.builderPage){
        var container = document.getElementsByTagName("body");
        var links = container[0].getElementsByTagName("a");
        var buttons = container[0].getElementsByTagName("button");
        for(var i=0;i<buttons.length;i++) {
            var onclck = buttons[i].getAttribute('onclick');
            if(onclck != null){
                if(onclck.indexOf('window.open') != -1 && onclck.indexOf('#') != -1){
                    showmsgin(buttons[i]);             
                }
            }
        }
        for(var i =0;link=links[i];i++){
/*            if(link.parentNode.parentNode.id!="nav-top" && link.parentNode.parentNode.id.indexOf("nav-ul")==-1){
                showmsgin(link); */
            if(((link.parentNode.parentNode.id!=="nav-top") || (link.parentNode.parentNode.id==="nav-top" && link.parentNode.id!="nav-li1234" && link.parentNode.id!="nav-li987" && !checkExternalUrl(link.href))) && link.parentNode.getAttribute("navsub")==null && !link.parentNode.getAttribute("back") && !checkExternalUrl(link.href) && !(checkMoreMenuLink(link)) && (link.href.indexOf("blogs/") == -1)) {
                bindEvent(link,'click', fnPreviewClickInfoMsg);   //No I18N
                }
            }
        }
    }

fnPreviewClickInfoMsg=function(e){    
    preventDefault(e);
    stopPropagation(e);
    var infoElem = parent.document.getElementById("zpPreviewClickInfoMsg");
    if(infoElem && !bFlg){
        bFlg = true;
        infoElem.style.display="block";
        var msgWid = infoElem.offsetWidth;
        var wwidth = parent.document.documentElement.clientWidth;
        infoElem.style.left=(wwidth/2-msgWid/2)+'px';
        infoElem.style.top='0px';
        infoElem.style.position="absolute";

        var alertContent = infoElem.getElementsByClassName("alertMsgCont")[0].innerHTML;
        var addedURL = this.href;
        if(addedURL){
            var tempUrl = addedURL.split("/");
            if(tempUrl[tempUrl.length-1]=="signin" || tempUrl[tempUrl.length-1]=="signup"){
                addedURL = "Sign In/Sign Up";//NO I18N
            }
            var t = document.createElement('a');
            t.href = addedURL;
            var exDomain = t.host;
            var contLen = exDomain.length + 10;

            if(addedURL.length >= contLen) {
                addedURL = addedURL.substring(0, contLen) + " ...";   
            }
        }

        infoElem.getElementsByClassName("alertMsgCont")[0].innerHTML= addedURL?(addedURL=="Signin/Signup"?(addedURL+" "+alertContent):("\""+addedURL+"\" "+alertContent)):('Button '+alertContent); // No I18N
        setTimeout(function(){
                infoElem.style.display='none';
                infoElem.getElementsByClassName("alertMsgCont")[0].innerHTML=alertContent;
                bFlg = false;
                },2000);
    }
    return false;
}
    

fnHandleClickEvents = function(e){
    //$E.bind($("#zppages")[0],'click',navigationHandleForLink);
    var obj = $E.target(e);
    var tag = obj.tagName;
    //if(obj.id=="zpBlogNext"){
    //    return;
    //}
    if(tag && (tag.toLowerCase()=="a"||(tag.toLowerCase()=="img")&&(obj.parentNode.tagName.toLowerCase()=="a"))){
        $E.stopPropagation(e);
        $E.preventDefault(e);
        return false;
    }
}

navAddEventHandler = function(ul) {
    var lis = ul.childNodes;
    var i,li;
    for(var i=0;li=lis[i];i++) {
        if(li.tagName) {
            //li.onclick = navItemTouch;
            addNavEvent(li,"click",navItemTouch);//No I18N
            var fstChd = getFirstChild(li);
            if(window.ZS_PreviewMode && fstChd.nodeType != 3 && fstChd.hasAttribute('href')){
                if(fstChd.getAttribute("href").indexOf("?mobile=true")== -1){
                    fstChd.setAttribute("href",fstChd.getAttribute("href")+"?mobile=true");
                    bindEvent(fstChd,'click', fnRunCSSMobile);  //No I18N
                }
            }
        }
    }
    
    if((typeof window.ZS_PreviewMode !== 'undefined') && (!parent.mobilePreview)) {
        var mCss = Object.keys(parent.CurrentSiteData.tmplData.mobileCssVars);
        var dCss = Object.keys(parent.CurrentSiteData.tmplData.cssVars);
        if(pReload && (mCss.length >0 || dCss.length>0)) {
            pReload= false;
            parent.fnTriggerMobileRunCSS();
        }
    }
    
    //fnBindHandleClickEvents();
    fnBindClickEventsForBlogs();
fnBindClickEventsForFooter();

}
fnBindClickEventsForFooter = function() {
    var cont = document.getElementsByClassName("footerArea"); 	//No I18N
    if(cont.length>0){
        var ancLink = cont[0].getElementsByTagName("a");
        var fLink;
        for(var i=0; fLink=ancLink[i]; i++) {
            if(window.ZS_PreviewMode && fLink.hasAttribute('href')){
                if(fLink.getAttribute("href").indexOf("?mobile=true")== -1){
                    var href = fLink.getAttribute("href");
                    var idx = href.indexOf("#comments");
                    if(idx !== -1) {
                        href = href.substring(0,idx)+"?mobile=true#comments";   //No I18N
                        fLink.setAttribute("href",href);
                    }
                    else {
                        fLink.setAttribute("href",href+"?mobile=true");
                    }
                }
            }
        }
    }
}

fnBindClickEventsForBlogs = function() {
    var body = document.getElementsByTagName("body");
    var cont = body[0].getElementsByClassName("container");
    if(cont.length>0){
        var ancLink = cont[0].getElementsByTagName("a");
        var bLink;
        for(var i=0; bLink=ancLink[i]; i++) {
            if(window.ZS_PreviewMode && bLink.hasAttribute('href')){
                if(bLink.getAttribute("href").indexOf("?mobile=true")== -1){
                    var href = bLink.getAttribute("href");
                    var idx = href.indexOf("#comments");
                    if(idx !== -1) {
                        href = href.substring(0,idx)+"?mobile=true#comments";   //No I18N
                        bLink.setAttribute("href",href);
                    }
                    else {
                        bLink.setAttribute("href",href+"?mobile=true");
                    }
                }
            }
        }
    }
    var sidebar = body[0].getElementsByClassName("sidebararea");
    if(sidebar.length > 0) {
        var sAncLink = sidebar[0].getElementsByTagName("a");

        var sBlogLink;
        for(var i=0; sBlogLink=sAncLink[i]; i++) {
            if(window.ZS_PreviewMode && sBlogLink.hasAttribute('href')){
                if(sBlogLink.getAttribute("href").indexOf("?mobile=true")== -1){
                    var href = sBlogLink.getAttribute("href");
                    sBlogLink.setAttribute("href",href+"?mobile=true");
                }
            }
        }
    }   
}

fnRunCSSMobile = function() {
    pReload = true;
}

function addNavEvent(element,type, callback) {
    var listener = function(ev) {
        callback.call(element,ev);
    }
    if(element.addEventListener) {
        element.addEventListener(type, listener,false);
    }
    else if(element.attachEvent) {
        element.attachEvent("on" + type, listener);
    }
}
navItemTouch = function(ev){
    if(this.tagName.toLowerCase()=="li"){
        // if you click multiple click for same navigation element stop more than one click
        var leftPx ="";
        if(this.parentNode.id=='nav-top'){
            if(!navAlignHor){
                leftPx = this.parentNode.style.left;
            }
            else{
                leftPx=0;
            }
        }
        else{
            leftPx = this.parentNode.parentNode.style.left;
        }
        if(parseInt(leftPx)!=0){	
            return;
        }
        if(this.parentNode.id == "nav-top" && this.hasAttribute("navsub")){
            preventDefault(ev);
        }
        if(this.className.indexOf("active")!= -1){
            this.className+='active';//No I18N
        }
        else{
            navHideMenu(this.parentNode);
        }
        if(this.hasAttribute("navsub")){
            preventDefault(ev);
        }	
        navShowMenu.call(this,ev);
    }
}

navShowMenu = function(event) {
    var subId = this.getAttribute('navsub');
    if(!subId)return;
    document.getElementsByTagName('body')[0].style.overflowX="hidden";// No I18N
    subId = subId.replace("ul","id");
    var sm =  document.getElementById(subId.replace(/nav\-/,'nav-submenu-'));
    //var off = navOffset(this);
    //var flt = navGetStyle(this,'float');//NO I18N
    sm.style.display = '';
    //this.parentNode.style.top=0-sm.offsetHeight-10+"px";
    var fstChild = getFirstChild(sm);
    var getParentId = fstChild.getAttribute("navparent");
    var showingId = document.getElementById("nav-top").getAttribute('navshowing');
    if((subId==="nav-idMore" && showingId==="nav-liMore") || (showingId===getParentId)){
        navHideMenu(this.parentNode);
        return;
    }
    navHideMenu(this.parentNode);
    var getParElem = document.getElementById(getParentId);
    var parElem = document.getElementById(getParElem.parentNode.getAttribute("navparent"));
    if(getParElem.className.indexOf("active")== -1){
        getParElem.className+=" active";// No I18N
    } 
    sm.style.top = 0+'px';
    sm.style.left = 0+'px';
    //sm.parentNode.style.left = '-10px';
    document.getElementById('childPageParent').style.top='0px';
    sm.style.width ="100%";
    var diffTop = navOffset(this);
    var diff = document.getElementById('childPageParent');
    var offsetChildPage = navOffset(diff);
    //var offsetChildPage = navOffsetParents(diff);
    if(navAlignHor){	
        if(this.parentNode.id == 'nav-top'){
            if(this.id=="nav-liMore"){
                document.getElementById('childPageParent').style.top=navTop.offsetHeight+"px"; 
            }else
                document.getElementById('childPageParent').style.top=diffTop.top-diff.offsetTop+"px";
        }else if(this.parentNode.id.indexOf("nav-ul")!=-1) {
            if(iconMenu){
                document.getElementById('childPageParent').style.top=document.getElementById("nav-li1234").offsetHeight+"px";
            }else{
                document.getElementById('childPageParent').style.top=navTop.offsetHeight+"px";
            }
        }else{
            var parHei = document.getElementById(this.parentNode.getAttribute("navparent"));
            document.getElementById('childPageParent').style.top=parHei.offsetHeight+"px";
        }
    }
    scrollTopMenu();
    this.parentNode.setAttribute("navshowing",this.id);
    // for mobile
    var clickLi = this.getAttribute("navsub");
    var listFirstLi  = document.getElementById(clickLi);
    if(!listFirstLi.children[0].hasAttribute("back") && !listFirstLi.children[0].hasAttribute("firstNav")){
        var curElem = document.getElementById(this.id);
        if(this.id!="nav-li987"){
            var firstLi = curElem.cloneNode(true);
            firstLi.removeAttribute("id");
            if(firstLi.getAttribute("class").indexOf("selected")!=-1){
                firstLi.setAttribute("class","selected");
            }
            else{
                firstLi.removeAttribute("class");
            }
            firstLi.removeAttribute("navsub");
            var fstChd = getFirstChild(firstLi);
            var href = fstChd.getAttribute('href');
            if(parent.mobilePreview && href!=null && href.indexOf("?mobile=true")== -1){
                href=href+"?mobile=true";//No I18N
            }
            fstChd.setAttribute('href',href);
            firstLi.setAttribute("firstNav","true");
            if(href.indexOf("javascript:;")==-1){
                listFirstLi.insertBefore(firstLi,listFirstLi.firstChild);
            }
        }
    }
    if(navAlignHor && parElem == null){
        if(fstChild.children[0].firstChild.hasAttribute('more')){
            fstChild.children[0].style.display ='none';
        }
    }
    else if(!listFirstLi.children[0].hasAttribute("back")){
        var back = document.createElement('li');
        back.setAttribute("back","true");
        back.style.cursor='pointer';
        back.onclick = function(){
            this.className ='active';
            navRightAli(getParentId,this.parentNode.parentNode.id);
            var parNode=document.getElementById(getParentId);
            if(parNode.parentNode){
                parNode.parentNode.removeAttribute('navshowing');
            }
            if(parNode.className.indexOf("active")!=-1){
                parNode.className = parNode.className.replace("active","");
            }
        }
        var a = document.createElement('a');
        var span = document.createElement('span');
        span.innerHTML="Back";//No I18N
        a.appendChild(span);
        back.appendChild(a);
        listFirstLi.insertBefore(back,listFirstLi.firstChild);
    }
    //this.parentNode.style.top=0-sm.offsetHeight+"px";
    if(navAlignHor){
        if(this.parentNode.id == 'nav-top'){
            document.getElementById('childPageParent').style.top=diffTop.top-offsetChildPage.top+this.offsetHeight+"px";
        }
    //document.getElementById('childPageParent').style.height=sm.offsetHeight+this.offsetHeight+"px";
    }
    if(!navAlignHor){
        //sm.style.left = "-100%";
    }
    if(parElem || (!navAlignHor && this.parentNode.id == 'nav-top')){
        sm.style.left = "100%";
        var np;
        if(!navAlignHor && this.parentNode.id == 'nav-top'){
            np = this.parentNode;
        }
        else{
            np = getParElem.parentNode.parentNode;
        }
        if(!navAlignHor && (np.offsetHeight < sm.offsetHeight)){
            //document.getElementById('navigation').style.height=sm.offsetHeight+"px";
        }
        //alert("!!!");
        navLeftAlign(np,sm,10);
    }
    document.getElementsByTagName('body')[0].style.overflowX="";// No I18N
    if(window.ZS_PreviewMode){
        fnBindHandleClickEvents();
    }
}
navLeftAlign = function(np2,sm2,px){
    np2.style.left = parseInt(np2.style.left) - px+"%";
//    var parLeft = sm2.style.left;
    sm2.style.left = parseInt(sm2.style.left) - px+"%";
    //sm2.parentNode.parentNode.style.left = parseInt(parLeft) - px+"%";
    if(parseInt(sm2.style.left)<5){
        sm2.style.left ="0%";
        np2.style.left = "-100%";
        if(!navAlignHor){
            document.getElementById('navigation').style.height=sm2.offsetHeight+"px";
        }
        np2.style.display = "none";
        return;
    }			
    setTimeout(function(){
        navLeftAlign(np2,sm2,px);
    },25);
}
navRightAlign = function(np2,sm2,px){	
    sm2.style.left = parseInt(sm2.style.left)+px+"%";
//    var parLeft = sm2.style.left;
    //sm2.parentNode.parentNode.style.left = parseInt(parLeft) +"%";
    np2.style.left = parseInt(np2.style.left)+px+"%";
    if(parseInt(sm2.style.left)>95){
        np2.style.left = "0%";
        sm2.style.left ="100%";
        np2.style.top="0px";
        if(!navAlignHor){
            document.getElementById('navigation').style.height=np2.offsetHeight+"px";
        }
        /*else{
            document.getElementById('childPageParent').style.height=np2.offsetHeight+"px";
        }*/
        sm2.style.display = 'none';
        return;
    }
    setTimeout(function(){
        navRightAlign(np2,sm2,px);
    },25);
}
navRightAli = function(pid,sid){
    var smE = document.getElementById(sid);
    if(parseInt(smE.style.left)!=0){
        return;
    }
    var psm = document.getElementById(pid).parentNode.parentNode.id;
    var psmE;
    if(psm == "navigation"){
        psm = "nav-top";// No I18N
    }
    psmE = document.getElementById(psm);
    psmE.style.display = 'block'; 
    /*if(!navAlignHor && smE.offsetHeight < psmE.offsetHeight){
        document.getElementById('navigation').style.height=psmE.offsetHeight+"px";
    }*/		
    navRightAlign(psmE,smE,10);
}
navHideMenu = function(ul) {
    if(ul && ul.getAttribute('navshowing')){
        var showingId = ul.getAttribute('navshowing');
        if(showingId && document.getElementById(showingId)){
            var subId = document.getElementById(showingId).getAttribute('navsub');
            var submenu = document.getElementById(subId);
            subId = subId.replace("ul","id");
            var sm =  document.getElementById(subId.replace(/nav\-/,'nav-submenu-'));
            navHideMenu(submenu);
            var fstChid = getFirstChild(sm);
            var getParentId = fstChid.getAttribute("navparent");
            var getParElem = document.getElementById(getParentId);
            if(getParElem.className.indexOf("active")!= -1)
                getParElem.className = getParElem.className.replace("active","");
            ul.removeAttribute('navshowing');
            sm.style.display = 'none';
        }
    }
}

navDisable =function(ev){
    ev = ev || window.event;
    var targt = ev.target;
    if(targt && targt.tagName){
        while(targt && targt.tagName && targt.tagName.toLowerCase()!="ul"){// No I18N
            if(targt.tagName.toLowerCase()=="body"){
                break;
            }else{
                targt = targt.parentNode;
            }
        }
        if(targt && targt.tagName.toLowerCase()=="ul" && (targt.id=="nav-top"|| targt.hasAttribute("navparent")))
            return;
    }
    var lis = document.getElementsByTagName("li");
    var li,elem;
    for(var i=0;(li=lis[i]);i++){
        if(li.className.indexOf("active")!=-1){
            if(li.getAttribute("back")!="true"){
                elem = li;
                //break;
            }
        }
    }
    if(elem){
        document.getElementById('childPageParent').style.height="0px";
        navHideMenu(elem.parentNode);
    }
}


navId = function(el) {
    var undefined;
    if(el.id == undefined || el.id == "")el.id="nav-id"+(Math.random()*11111111111111111111);
}
stopPropagation = function(e){
    if (e.stopPropagation) {
        e.stopPropagation();
    }else {
        e.cancelBubble = true;
    }
}
preventDefault = function(e){
    if(e.preventDefault) {
        e.preventDefault();
    }else {
        e.returnValue = false;
    }
}

navSetClassNames = function(){
    var lis = navTop.getElementsByTagName("li");
    for(var i=0;li=lis[i];i++){
        if(li.hasAttribute('navsub'))
            li.className = li.className+" navArrow";
    }
    lis = childPage.getElementsByTagName("li");
    for(i=0;li=lis[i];i++){
        if(li.hasAttribute('navsub'))
            li.className = li.className+" navArrow";
    }
}

getFirstChild = function(elm){
    for(x=0;x<elm.childNodes.length;x++){
        firstChild=elm.childNodes[x];
        if(firstChild.nodeType!=3){
            break;
        }        
    }
    return firstChild;
}

bindEvent=function(el,type,func){
    if(el.addEventListener){
        el.addEventListener(type,func,false);
    }else if(el.attachEvent){
        el.attachEvent('on'+type,func);
    }
}

scrollTopMenu = function(){//move to menu top position
    var scrollElem = document.getElementById("nav-top");
    var elemYPos;
    elemYPos = scrollElem.offsetTop;
    if(scrollElem && window.pageYOffset>elemYPos){
        window.scrollTo(window.pageXOffset,elemYPos);
    }
}

