/*$Id:$*/
enableTwitterWidget = function(){
	while(twitterWidgetElem.length>0){
		var twitElem = twitterWidgetElem.pop();	
				createTwitterWidget(twitElem);			
	}
	commonLoadScript('//platform.twitter.com/widgets.js',"tweetButton");
}
createTwitterWidget=function(twElem){
	var wType = twElem.getAttribute("data-twType");
	if(wType =="snippet"){
		var wClass = twElem.getAttribute("data-twclass");
		var wHref= twElem.getAttribute("data-twhref");	
		var wId= twElem.getAttribute("data-twdata-widget-id");
		var wMsg = twElem.getAttribute("data-twmsg");
		var wDnt = twElem.getAttribute("data-twdata-dnt");
		var elemId = "twit"+twElem.id;
		var wElem = document.getElementById(elemId);
		var a = document.createElement("a");
		a.setAttribute("class",wClass);
		a.setAttribute("href",wHref);
		if(wId != null && wId != "null"){
			a.setAttribute("data-widget-id",wId);
		}		
		if(wDnt){
		    a.setAttribute("data-dnt",wDnt);
		}
		a.innerHTML=wMsg;
		wElem.appendChild(a);
	}	
}
enableTwitterButton = function(){
	while(twitterButtonElem.length>0){
    	var twitElem = twitterButtonElem.pop();
		var layoutType = twitElem.getAttribute("data-layout");
        if(layoutType){
            createTweetButton(twitElem,layoutType);
        }
        else{
        	createTweetButton(twitElem);
		}
   	}
}

createTweetButton = function(tbElem,ssType){
	var elemId = "twit"+tbElem.id;
	var style;
	var tweetText = "";
	var recommened = ""
	if(ssType){
		if(ssType == "0"){
			style = "none";	
		}
		else if(ssType == "1"){
			style = "horizontal";	

		}
		else if(ssType == "2"){
			style = "vertical";	
		}
	}
	else {
		style = tbElem.getAttribute("data-tbStyle");
		tweetText = tbElem.getAttribute("data-tbTweetText");
		recommened = tbElem.getAttribute("data-tbRecommended");
	}
	var domainName1 = getDomainName();
	var div = document.createElement('div');
	var a = document.createElement('a');
	a.href = "https://twitter.com/share";
	a.className = "twitter-share-button";
	a.setAttribute("data-count",style);
	a.setAttribute("data-url",domainName1);
	a.setAttribute("data-lang",getBrowserLanguage());
	if(tweetText != ""){
		a.setAttribute("data-text",tweetText);
	}
	if(recommened != ""){
		a.setAttribute("data-via",recommened);
	}
	div.appendChild(a);
	var elem = document.getElementById(elemId);
	if(elem.hasChildNodes()){
		elem.removeChild(elem.childNodes[0]);
	}
	document.getElementById(elemId).appendChild(div)
	window.twttr.widgets.load();
	if(ssType){
    	setTimeout(function(){var s = document.getElementById(elemId).style;s.cssFloat="left";s.styleFloat="left";s.padding="5px";if(ssType == "1"){s.width="75px";}else if(ssType == "2"){ s.width="55px";s.height="65px";}},10);
    }

}


