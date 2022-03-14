/*$Id$*/
enableFacebookWidget = function(){
	while(facebookElem.length>0){
		var fbElem = facebookElem.pop();
		var layoutType = fbElem.getAttribute("data-layout");
        if(layoutType){
            createFacebookLikeButton(fbElem,layoutType);
        }
		else{
			var wType = fbElem.getAttribute("data-fwType");
			var elemId = "fb"+fbElem.getAttribute("id");
			if(wType == "likebutton"){
				createFacebookLikeButton(fbElem);
			}
			else if(wType == "likebox"){
				createFbLikeBox(fbElem);
			}
			else if(wType  == "comments"){
				createFbComments(fbElem);
			}
			else if(wType == "activityfeed"){
				createFbActivityFeed(fbElem);
			}
		}
	}
}

createFacebookLikeButton = function(elem,ssType){
			var elemId = "fb"+elem.getAttribute("id");
			var dn = getDomainName();
			var style,verb,color,send,face;
			if(ssType){
                verb = "like";
                color = "light";
                send = "false"; 
                face = "false";
				if(ssType == "0" || ssType == "1"){
					style = "button_count";
				}
				else if (ssType == "2"){
					style = "box_count";
				}
			}
			else{
				style = elem.getAttribute("data-fbStyle")
            	verb = elem.getAttribute("data-fbVerb");
            	color = elem.getAttribute("data-fbColor");
            	send = elem.getAttribute("data-fbSend");
            	face = elem.getAttribute("data-fbFace");
			}
 			var likeBut = document.createElement('div');
            likeBut.className ="fb-like";
			likeBut.setAttribute("data-href",dn);
            likeBut.setAttribute("data-send","false");
            likeBut.setAttribute("data-show-faces","false");
			likeBut.setAttribute("data-layout",style);	
			likeBut.setAttribute("data-action",verb);	
			likeBut.setAttribute("data-colorscheme",color);
			var felm = document.getElementById(elemId);
    		if(felm.hasChildNodes()){
        		felm.removeChild(felm.childNodes[0]);
    		}
        	felm.removeAttribute("style");
            felm.appendChild(likeBut);
			setTimeout(function(){var s = document.getElementById(elemId).style;s.overflow="hidden";s.paddingBottom="0px";if(style == "standard"){s.height="25px";}},100);
			if(ssType){
				setTimeout(function(){window.FB.XFBML.parse();var s = document.getElementById(elemId).style;s.cssFloat="left";s.styleFloat="left";s.padding="5px 5px 0px";if(ssType == "0"){s.width="43px";s.overflow="hidden";}else if(ssType =="1"){s.width="72px";}else if(ssType == "2"){s.width="46px";}},1000);
			}
			
}
createFbLikeBox = function (elem){
		var elemId = "fb"+elem.getAttribute("id");
		var fbPageUrl = elem.getAttribute("data-fbPageUrl");
        var color = elem.getAttribute("data-fbColor");
        var face = elem.getAttribute("data-fbFace");
        var stream =  elem.getAttribute("data-fbStream");
		var likeBox = document.createElement('div');
    	likeBox.className ="fb-like-box";
		likeBox.setAttribute("data-href",fbPageUrl);
        likeBox.setAttribute("data-show-faces",face);
        likeBox.setAttribute("data-stream",stream);
        likeBox.setAttribute("data-header","true");
        likeBox.setAttribute("data-colorscheme",color);	
		likeBox.setAttribute("data-width",(window.ZS_PublishMode||window.ZS_PreviewMode)?elem.offsetWidth:elem.offsetWidth-2);
		var felm = document.getElementById(elemId);
            if(felm.hasChildNodes()){
                felm.removeChild(felm.childNodes[0]);
            }
        felm.appendChild(likeBox);
		window.FB.XFBML.parse();
}
createFbComments = function (elem){
		var elemId ="fb"+elem.getAttribute("id");
		var post = elem.getAttribute("data-fbPost");
        var color = elem.getAttribute("data-fbColor");
		var dn = getDomainName();
        var comments = document.createElement('div');
        comments.className ="fb-comments"
        comments.setAttribute("data-href",dn);
        comments.setAttribute("data-num-posts",post);
		comments.setAttribute("data-colorscheme",color);
        comments.setAttribute("data-width",(window.ZS_PublishMode||window.ZS_PreviewMode)?elem.offsetWidth:elem.offsetWidth-2);
		var felm = document.getElementById(elemId);
            if(felm.hasChildNodes()){
                felm.removeChild(felm.childNodes[0]);
        	}
			felm.style.border="1px solid #aaa";
        	felm.appendChild(comments);
}
createFbActivityFeed = function (elem){
		var elemId ="fb"+elem.getAttribute("id");//No I18N
		var height = elem.getAttribute("data-fbHeight");
        var color = elem.getAttribute("data-fbColor");
        var target = elem.getAttribute("data-fbTarget");
        var recommend =  elem.getAttribute("data-fbRecommend");
		var dn = getDomainName();
        var actFeed = document.createElement('div');
        actFeed.className ="fb-activity"
        actFeed.setAttribute("data-site",dn);
        actFeed.setAttribute("data-recommendations",recommend);
        actFeed.setAttribute("data-header","true");
        actFeed.setAttribute("data-height",height);
        actFeed.setAttribute("data-width",(window.ZS_PublishMode||window.ZS_PreviewMode)?elem.offsetWidth:elem.offsetWidth-2);
        actFeed.setAttribute("data-colorscheme",color);	
        actFeed.setAttribute("data-linktarget",target);	
		var felm = document.getElementById(elemId);
            if(felm.hasChildNodes()){
                felm.removeChild(felm.childNodes[0]);
        }
        felm.appendChild(actFeed);
}