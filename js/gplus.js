/*$Id:$*/
var lg = getBrowserLanguage();
window.___gcfg = {
        lang: lg,
        parsetags: 'explicit'
};
fnLoadGPlusJS = function(){
	commonLoadScript("//apis.google.com/js/plusone.js","gplus");//NO I18N
}
fnCreateGPlus = function(){
	//alert("come");
	//
	//alert("ggg"+gplusElem);
	while(gplusElem.length>0){
		var elem = gplusElem.pop();
		var layoutType = elem.getAttribute("data-layout");
		if(layoutType){
			fnRenderGPlus(elem,layoutType);
		}
		else{
			fnRenderGPlus(elem);
		}
	}
}

fnRenderGPlus = function(elem,ssType){	
    var gpElemId = "gplus"+elem.id;
    var domainName = getDomainName();
	var size,annotation;
	if(ssType){
		if(ssType == "0"){
			size = "tall";
			annotation = "none";
		}
		else if(ssType == "1"){
			size = "standard";
			annotation = "bubble";
		}
		else if(ssType == "2"){
			size = "tall";
			annotation ="bubble";
		}
	}
	else{
		size = elem.getAttribute("data-size");
		annotation = elem.getAttribute("data-annotation");
		domainName = elem.getAttribute("data-href");
	}
    	var gplus = {};
    	gplus.size = size;
    	gplus.annotation = annotation;
    	gplus.href = domainName;
    	gapi.plusone.render(gpElemId ,gplus);
	if(ssType){
		setTimeout(function(){var s = document.getElementById(gpElemId).style;s.padding="0px";if(ssType == "0"){s.width="47px";}else if(ssType =="1"){s.width="65px";}else if(ssType=="2"){s.width="50px";}},1000);
	}
}

