/*$Id: gallery.js,v 2354:a30467302c79 2011/08/22 10:52:10 ljraajesh $*/
Gallery.mobile=false;
if(window.ZS_PublishMode || window.ZS_PreviewMode){
  if(window.location.href.indexOf("mobile") != -1 || (typeof(responsiveTheme)!="undefined" && responsiveTheme==true && mobile===true ) || (typeof(window.parent.responsivePreview)!="undefined" && window.parent.responsivePreview=="true")){
    Gallery.mobile=true;
  }
  var album = albumCount.pop();
  if(album.className == "zpelement-wrapper picasa"){
      setTimeout(function(){commonLoadScript("//picasaweb.google.com/data/feed/api/user/"+album.getAttribute('albumusername')+"/albumid/"+album.getAttribute('albumid')+"?alt=json-in-script&callback=Gallery.showAlbumPhotos");},10);
  }
  else if(album.className == "zpelement-wrapper flickr"){
      setTimeout(function(){commonLoadScript("ht"+"tps://www.flickr.com/services/rest?method=flickr.photosets.getPhotos&api_key=317b7c22e9394b291b75f6356335d254&photoset_id="+album.getAttribute('albumid')+"&format=json&jsoncallback=Gallery.showAlbumPhotos");},10);// No I18N

  }else{
      var func = function(){
          Gallery.fnShowOwnGalleryImgs(album.getAttribute("albumid"),album.getAttribute("albumusername"));
      }
      setTimeout(func,1000);
  }
}

Gallery.fnShowOwnGalleryImgs = function(id,uname){
    var photoSet = ownGallery[id]?ownGallery[id].photoSet:false;
    if(!photoSet || !photoSet.length){
        var galElem = galleryElements.pop();
        if(albumCount.length > 0){
            var album = albumCount.pop();
            if(album.className == "zpelement-wrapper picasa"){
                Gallery.loadAlbum("//picasaweb.google.com/data/feed/api/user/"+album.getAttribute('albumusername')+"/albumid/"+album.getAttribute('albumid')+"?alt=json-in-script&callback=Gallery.showAlbumPhotos");// No I18N
            }
            else if(album.className == "zpelement-wrapper flickr"){
                Gallery.loadAlbum("ht"+"tps://www.flickr.com/services/rest?method=flickr.photosets.getPhotos&api_key=317b7c22e9394b291b75f6356335d254&photoset_id="+album.getAttribute('albumid')+"&format=json&jsoncallback=Gallery.showAlbumPhotos");// No I18N
            }
            else{
                Gallery.fnShowOwnGalleryImgs(album.getAttribute("albumid"),album.getAttribute("albumUsername"));
            }
            loadingAlbumCount++;
        }
        return; 
    }
    var gallery=[];
    for(var i=0;i<photoSet.length;i++){
        var imgVal = {};
        var img = photoSet[i].img;
        if(!window.ZS_PreviewMode){
            var first = img.substr(0,7);
            var second = img.substr(7);
            var siteId = second.indexOf("/")+1;
            img = first+second.substr(siteId);
        }
        imgVal.img = img;
        imgVal.caption = photoSet[i].caption;
        imgVal.width = photoSet[i].width;
        imgVal.height = photoSet[i].height;
        gallery.push(imgVal);
    }
    var response={};
    response.ownGallery={"imgs":gallery,"albumId":id,"uname":uname,"style":ownGallery[id].style,"cols":ownGallery[id].cols,"rows":ownGallery[id].rows,"albumname":ownGallery[id].albumname,"caption":ownGallery[id].caption,"cropType":(ownGallery[id].cropType?ownGallery[id].cropType:"square"),"type":ownGallery[id].type,"collageType":ownGallery[id].collageType}; //NO I18N
    Gallery.showAlbumPhotos(response);
}

Gallery.effects=true;
Gallery.loadAlbum = function(src) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = src;
    head.appendChild(script);
}
Gallery.showAlbumPhotos = function(response){
    var photoAlbumDetails = false;
    var albumId = null;
    var albumUsername = null;
    var albumName = null;
    var albumAuther = null;
    var profileURL = null;
    var imgSrc = new Array();
    var flickrAlbum = false;
    var picasaAlbum = false;
    if(response.feed != undefined && response.feed.entry){
	picasaAlbum = true;
    albumName = response.feed.title.$t;
	albumAuther = response.feed.author[0].name.$t;
           profileURL = "ht"+"tps://plus.google.com/"+response.feed.gphoto$user.$t+"/photos";//NO I18N
	var albumUrl = (response.feed.id.$t).split('/');
	albumUsername = albumUrl[7];
	albumId = albumUrl[9];	
	photoAlbumDetails = response.feed.entry;
	for(var i=0;(photo = photoAlbumDetails[i]);i++){	
	    var src = photo.content.src;
	    var url = src.split('/');
            url.splice(7,0,"s240");// size of photo
            url = url.join('/');
            var imgDiffSize={};
            imgDiffSize.originalURL=url.replace(/\/s240\//,'/');
            imgDiffSize.squareURL = url.replace(/\/s240\//,'/s50-c/');
            imgDiffSize.thumbURL = url.replace(/\/s240\//,'/s100/');
            imgDiffSize.smallURL = url;
            imgDiffSize.mediumURL = url.replace(/\/s240\//,'/s640/');
            imgDiffSize.largeURL =url.replace(/\/s240\//,'/s1024/');
            imgSrc[i]=imgDiffSize;
	}		
    }
    if(response.photoset != undefined && response.photoset.photo){
        flickrAlbum = true;
        albumId = response.photoset.id;
        albumUsername = response.photoset.ownername;
        albumAuther = response.photoset.ownername;
        profileURL = "ht"+"tp://www.flickr.com/photos/"+response.photoset.owner+"/sets/";//NO I18N
        photoAlbumDetails = response.photoset.photo;
        for(i=0;(photo = photoAlbumDetails[i]);i++){
            var imgDiffSize={};
            imgDiffSize.squareURL = "//farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_s.jpg";// No I18N
            imgDiffSize.thumbURL = "//farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_t.jpg";// No I18N
            imgDiffSize.smallURL = "//farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_m.jpg";// No I18N
            imgDiffSize.mediumURL = "//farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_z.jpg";// No I18N
            imgDiffSize.largeURL = "//farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg";// No I18N
            imgSrc[i]=imgDiffSize;
        }
    }
    if(response.ownGallery != undefined){
        picasaAlbum = true;
        albumName = response.ownGallery.albumname;
        albumId = response.ownGallery.albumId;
        albumUsername = response.ownGallery.uname;
        albumAuther = response.ownGallery.uname;
        var photoAlbumDetails = response.ownGallery.imgs;
        for(var i=0,len=photoAlbumDetails.length;i<len;i++){
            var imgDiffSize={};
            var url = photoAlbumDetails[i].img;
            imgDiffSize.thumbURL = url;// No I18N
            var curImg = url.split("/");
            var simg = "."+curImg[curImg.length-1]+"_s.jpg";//NO I18N
            var mimg = "."+curImg[curImg.length-1]+"_m.jpg";//NO I18N
            var ssimg = "."+curImg[curImg.length-1]+"_ss.jpg";//NO I18N
            simg = url.replace(curImg[curImg.length-1],simg);
            imgDiffSize.squareURL = simg;// No I18N
            imgDiffSize.smallURL = url.replace(curImg[curImg.length-1],ssimg);// No I18N
            imgDiffSize.mediumURL = url.replace(curImg[curImg.length-1],mimg);// No I18N
            imgDiffSize.largeURL = url;// No I18N
            imgSrc[i]=imgDiffSize;
        }

    }
    var isBuilder = (typeof SiteBuilder  === "object")?true:false;
    var elem = galleryElements.pop();
   //elem.style.cssText = "float:left;position:relative;width:100%";// No I18N
    var gallElem = elem.parentNode;
    var innerDim = gallElem.offsetWidth;
    var numberOfPhoto = null;
    var numberOfRow = null;
    var photoSize = null;
    var border = 1;
    var spacing = 3;
    var borderColor = "#e3e3e3";//NO I18N
    var bgColor = "transparent";//NO I18N
    if(response.ownGallery){
        border = response.ownGallery.style.border;
        spacing = response.ownGallery.style.spacing;
        borderColor = response.ownGallery.style.bordercolor;
        bgColor = response.ownGallery.style.background;
	if(response.ownGallery.type == "collage"){
		elem.innerHTML="";
		blogPostCollageFlag=false;	
		collageMaker(response.ownGallery,innerDim-4,elem,imgSrc);
		if(albumCount.length==0){
			blogPostLoadFlag=true;
		}
		blogPostCollageFlag=true;
		return;
	}
	elem.innerHTML="";
    }
     if(innerDim >400){
        numberOfPhoto = 4;
        numberOfRow = 3;           
        if(response.ownGallery){
            numberOfPhoto=response.ownGallery.cols;
            numberOfRow=response.ownGallery.rows == "none"? (Math.ceil(photoAlbumDetails.length/numberOfPhoto)+1): response.ownGallery.rows;//NO I18N
            photoSize = (Math.floor((innerDim)/numberOfPhoto))-((border*2)+(spacing*2)+7);
        }else{
             photoSize = (Math.ceil((innerDim-90)/4));
        }
    }
    else{
        numberOfPhoto = 2;
        numberOfRow = 2;
        if(response.ownGallery){
            photoSize = (Math.floor((innerDim)/numberOfPhoto))-((border*2)+(spacing*2)+7);
        }else{
            photoSize = (Math.ceil((innerDim-56)/2));
        }
    }
    var photoView = document.createElement('div');
    photoView.style.position="relative";
    photoView.id="photoView";
    photoView.setAttribute("albumid",albumId);
    var photoCount = photoAlbumDetails.length;
    var photoShowDiv = Math.ceil(photoCount/(numberOfPhoto*numberOfRow));
    var albumDetails1 = document.createElement('div');
    var albumDetails = document.createElement('div');
    if(response.ownGallery)
        albumDetails1.style.display="none";
    albumDetails.className="zpalbumTitle-container";
    albumDetails.innerHTML ="<h3>"+(picasaAlbum?albumName:elem.parentNode.getAttribute('albumName'))+"</h3>  <p> By &nbsp;<a target='_blank' href=\'"+profileURL+"\'>"+albumAuther+"</a></p>";//NO I18N
    var navigation = document.createElement('div');
    if(photoShowDiv>1){
	navigation.className="zpalbumPrevNext-container";
    var trans = transSupport();
	var prev = document.createElement('span');
        prev.className ="zpinactivePrevNext";
        prev.innerHTML ="<p>"+((isBuilder)?(i18n("pages.builder.photoGallery.Previous")):"Prev")+"</p>";
        prev.onclick = function(){ 
            var eid = this.parentNode.parentNode.parentNode.id; 
            var seid ="sel"+eid;//NO I18N
            var s =document.getElementById(seid);
            if(!s.previousSibling){return;}
            s.previousSibling.style.display="block";
            s.previousSibling.id=seid;
            s.id="unsel"+eid;
            if(response.ownGallery){
                s.className = "photoListView photoInActive";
                setTimeout(function(){s.previousSibling.style.left="0px";},200);
                if(trans){
                    s.addEventListener(trans["transitionEnd"],function(){this.style.display="none";this.removeEventListener(trans["transitionEnd"],arguments.callee)},false);
                }else{
                    s.style.display="none";
                }
            }else{
                s.style.display='none';
                s.previousSibling.style.display='block';

            }
            if(!s.previousSibling.previousSibling){
                this.innerHTML="<p>"+ ((isBuilder)?(i18n("pages.builder.photoGallery.Previous")):"Prev") +"</p>";//NO I18N
                this.className="zpinactivePrevNext";
            }else{
                this.innerHTML="<a href='javascript:;'>"+ ((isBuilder)?(i18n("pages.builder.photoGallery.Previous")):"Prev") +"</a>";
                this.className="zpactivePrevNext";
            } 
            this.nextSibling.innerHTML="<a href='javascript:;'>"+  ((isBuilder)?(i18n("pages.builder.photoGallery.Next")):"Next") +"</a>";
            this.nextSibling.className="zpactivePrevNext";
        }
        var next = document.createElement('span');
        next.className ="zpactivePrevNext";
        next.innerHTML ="<a href='javascript:;'>"+((isBuilder)?(i18n("pages.builder.photoGallery.Next")):"Next")+"</a>";
        next.onclick = function(){   
            var eid = this.parentNode.parentNode.parentNode.id; 
            var seid="sel"+eid;//NO I18N
            var s = document.getElementById(seid);
            if(!s.nextSibling){return;}
           s.nextSibling.id=seid;
            s.nextSibling.style.display="block";
            s.id="unsel"+eid;
            if(response.ownGallery){
                s.style.left=-s.clientWidth+"px";
                setTimeout(function(){s.nextSibling.className="photoListView photoActive";},150);
                if(trans){
                    s.addEventListener(trans["transitionEnd"],function(){this.style.display="none";this.removeEventListener(trans["transitionEnd"],arguments.callee)},false);
                }else{
                    s.style.display="none";
                }
            }else{
                s.style.display='none';
                s.nextSibling.style.display='block';
            }
            if(!s.nextSibling.nextSibling){
                this.innerHTML="<p>"+    ((isBuilder)?(i18n("pages.builder.photoGallery.Next")):"Next") +"</p>";//NO I18N
                this.className="zpinactivePrevNext"
            }else{
                this.innerHTML="<a href='javascript:;'>"+ ((isBuilder)?(i18n("pages.builder.photoGallery.Next")):"Next")  +"</a>";
                this.className="zpactivePrevNext";
            }
            this.previousSibling.innerHTML="<a href='javascript:;'>"+ ((isBuilder)?(i18n("pages.builder.photoGallery.Previous")):"Prev")  +" </a>";
            this.previousSibling.className="zpactivePrevNext";
        }
	navigation.appendChild(prev);
	navigation.appendChild(next);
    }
    var i = 0;
    var k = 0;
    var imgPreload = new Array();
    var firstSetPhto;
	for(var j=0;j<photoShowDiv;j++){
	    var photoListView = document.createElement('div');
	    photoListView.className = "photoListView";
        photoListView.style.position="absolute";
        photoListView.style.zIndex=photoShowDiv-j;
	    var photo = null;
	    for(i;((photo=photoAlbumDetails[i]) && (i<(numberOfPhoto*numberOfRow)+k));i++){
		var photoContentPad = document.createElement('div');
		photoContentPad.className="photoContPad";
		var photoContentDiv = document.createElement('div');
        if(window.ZS_PreviewMode)photoContentDiv.style.cursor="default";
        if(j != 0 && response.ownGallery){
    		photoContentDiv.className="photoContent photoPagination";
        }else{
    		photoContentDiv.className="photoContent";
        }
		var photoDiv = document.createElement('div');
        photoDiv.style.position='relative';
		photoContentDiv.id = "photoDiv"+loadingAlbumCount+"p-img"+i;
        if(window.ZS_PublishMode && window.location.href.indexOf("/preview/") == -1){
            photoContentDiv.onclick=function(){Gallery.slideShow(this.id.replace(/photoDiv.*p-img/,''),imgSrc,(response.ownGallery?"gallery":"widget"))};//NO I18N
        }
        if(response.ownGallery && (response.ownGallery.cropType === "square" || response.ownGallery.cropType === "rectangle")){
		    photoContentDiv.style.width=photoSize+((spacing*2))+"px";
            var hei = photoSize+((spacing*2))
		    photoContentDiv.style.height=(response.ownGallery.cropType === "square"?hei:Math.floor(hei-(hei/2.5)))+"px";
            photoContentDiv.style.border=border+"px solid "+borderColor;
            photoContentDiv.style.background=bgColor;
            photoDiv.style.width=photoSize+"px";
            var hei1 = (response.ownGallery.cropType === "square"?photoSize:Math.floor(photoSize-(photoSize/2.5)));//NO I18N
            photoDiv.style.height=hei1+"px";
            photoDiv.style.margin=spacing+'px';//NO I18N
            var img = new Image();
            img.element = photoDiv;
            img.onload = function(){
                this.element.style.background="url(\""+(this.src.replace("'","%27"))+"\") no-repeat center center";//NO I18N
                if(this.width < photoSize || this.height < hei1){
                    if(this.width < this.height){
                        this.element.style.backgroundSize = "100% auto";//NO I18N
                    }else{
                        this.element.style.backgroundSize = "auto 100%";//NO I18N
                    }
                }                     
                this.element.style.opacity=1;
            }
            img.onerror = function(){
                this.element.style.opacity=1;
            }

            img.src = imgSrc[i][fnGetCorrectSize(photoSize,photo.width,photo.height)];

        }else{
              if(response.ownGallery){
                photoContentDiv.style.width=photoSize+((spacing*2))+"px";
                photoContentDiv.style.height=photoSize+((spacing*2))+"px";
              }else{
                photoContentPad.style.padding='10px';
		        photoContentDiv.style.width=photoSize+"px";
		        photoContentDiv.style.height=photoSize+"px";
              }
              var img  = new Image();
              img.div = photoDiv;
              img.onload=function(){
                  if(response.ownGallery){
                    this.style.border=border+"px solid "+borderColor;
                    this.style.background=bgColor;//NO I18N
                    this.style.padding=spacing+"px";
                    this.style.bottom=-(photoSize+(spacing*2))+"px";//NO I18N
                  }else{
                    this.style.border="1px solid #999999";
                    this.style.background="transparent";//NO I18N
                    this.style.bottom=-photoSize+"px";//NO I18N
                  }
                  var size1 = photoSize-(border*2)//+spacing*2);
                  var w = this.width;
                  if(this.width>size1 || this.height>size1){
                      if(this.width>this.height){
                          w = size1;
                          this.height = Math.ceil((size1)*this.height/this.width);
                          this.width = w;
                      }
                      else{
                          w = Math.ceil((size1)*this.width/this.height);
                          this.height = size1;
                          this.width=w;
                      }
                  }
                  this.div.style.opacity=1;
                  this.style.position="absolute"
                  this.style.left=Math.floor((photoSize-w)/2)+"px";
                  this.div.appendChild(this);
              }
              if(response.ownGallery){
                img.src=imgSrc[i][fnGetCorrectSize(photoSize,photo.width,photo.height)];
              }else{
                img.src=imgSrc[i].smallURL;
              }
        }
        if(response.ownGallery && response.ownGallery.caption){
            var caption = document.createElement("div");
            caption.className="zscaption";
            caption.innerHTML = (window.ZS_PublishMode||window.ZS_PreviewMode)?photo["caption"]:(photo["caption"] != ""?photo["caption"]:"Caption"); //NO I18N
            if(response.ownGallery.cropType == "none"){ 
                caption.style.bottom=-((photoSize+(spacing*2)))+"px";//NO I18N
            }
            photoDiv.appendChild(caption);
        }

		photoContentDiv.appendChild(photoDiv);
		photoContentPad.appendChild(photoContentDiv);
		photoListView.appendChild(photoContentPad);
	    }
	    k = k+(numberOfPhoto*numberOfRow);
	    photoView.appendChild(photoListView);
	    if(j != 0){
	    	photoListView.style.display = "none";
	    }
        else{
    	    photoListView.id = "sel"+elem.parentNode.id;
            firstSetPhto = photoListView;
        }
	}
	albumDetails1.appendChild(navigation);
	albumDetails1.appendChild(albumDetails);
	if(elem.firstElementChild!=null){
        $D.remove(elem.firstElementChild);
        $D.remove(elem.previousSibling);
        }
	elem.parentNode.insertBefore(albumDetails1,elem);	
    if(response.ownGallery){
        var navCont = document.createElement("div");
        navCont.appendChild(navigation);
	if(elem.nextElementSibling!=null)
        {
        $D.remove(elem.nextElementSibling);
        }
        elem.parentNode.appendChild(navCont);
    }
	elem.appendChild(photoView);
    elem.style.height=firstSetPhto.clientHeight+"px";
    if(albumCount.length>0){
        var album = albumCount.pop();
        if(album.className == "zpelement-wrapper picasa"){
            Gallery.loadAlbum("//picasaweb.google.com/data/feed/api/user/"+album.getAttribute('albumusername')+"/albumid/"+album.getAttribute('albumid')+"?alt=json-in-script&callback=Gallery.showAlbumPhotos");// No I18N
        }	
        else if(album.className == "zpelement-wrapper flickr"){ 
            Gallery.loadAlbum("ht"+"tps://www.flickr.com/services/rest?method=flickr.photosets.getPhotos&api_key=317b7c22e9394b291b75f6356335d254&photoset_id="+album.getAttribute('albumid')+"&format=json&jsoncallback=Gallery.showAlbumPhotos");// No I18N
        }
        else{
            var func = function(mode){
	        if(mode){
                    Gallery.fnShowOwnGalleryImgs(album.getAttribute("albumid"),album.getAttribute("albumUsername"));
                }else{
                    fnShowOwnGallery(album.getAttribute("albumid"),album.getAttribute("albumUsername"));
                }
            }
            setTimeout(function(){func(window.ZS_PublishMode||window.ZS_PreviewMode)},1000);

        }
        loadingAlbumCount++;	
    }else{
          blogPostLoadFlag=true;
    }

//fnSetEqualHeight();
}
Gallery.slideShow=(function(){
    return function(idss,image,galleryType){
        this.no=parseInt(idss,10);
        this.images=image;
        var thisInst= this;
        var _getArea=function(){
            if(galleryType == "gallery"){
                return {width:window.innerWidth || document.documentElement.clientWidth, height:(!Gallery.mobile?(window.innerHeight || document.documentElement.clientHeight)-75:(window.innerHeight || document.documentElement.clientHeight))};
            }else{
                return {width:window.innerWidth || document.documentElement.clientWidth, height:(!Gallery.mobile?(window.innerHeight || document.documentElement.clientHeight)-175:(window.innerHeight || document.documentElement.clientHeight))};
            }
        };
        var trans = transSupport();
        this.changing = false;
        this.paused=false;
        this.initSlideshow=function(){
            document.documentElement.style.overflow? document.documentElement.style.overflow="hidden":document.getElementsByTagName("body")[0].style.overflow="hidden";
            var windowArea = _getArea();            
            var mask=document.createElement("div");
            mask.className="slideShowMask";
            mask.id="mask";
            var slideshow=document.createElement("div");
            slideshow.id="show1";
            slideshow.style.cssText="position:fixed;top:0;left:0px;width:100%;height:100%;z-index:1201";//NO I18N
            slideshow.innerHTML="<div onclick=\"Gallery.closeSlideshow()\" class=\"slideShowCloseCont\"><div style='float: left;"+(Gallery.mobile?"background:url(\"../../zimages/slideshow.png\") no-repeat scroll 0 -80px transparent":"")+"' class=\"slideShowCloseImg\"></div><span style='float: left; padding-left: 5px;"+(Gallery.mobile?"display:block":"")+"'>Close</span></div><div id=\"slideshowImg\" style=\"position:absolute;bottom:"+(Gallery.mobile?"0":(galleryType=="gallery"?"65":"165"))+"px;width:"+(!Gallery.mobile?"900":windowArea.width)+"px;height:"+windowArea.height+"px;overflow:hidden;left:"+(Gallery.mobile?"0":Math.ceil((windowArea.width-900)/2))+"px\" ><div id=\"showPhoto\" style=\"position:absolute;top:0px;left:0px;width:100%;height:100%;opacity:1;z-index:2\"> <img src=\"\" id='curPhoto' class=\"imgStyle\" style=\"position:absolute\"/></div><div id=\"slidePhoto\" style=\"position:absolute;top:0px;left:0px;width:100%;height:100%;opacity:0;z-index:1\"><img src=\"\" class=\"imgStyle\"  id='hindFoto'  style=\"position:absolute;\" /></div></div><div id=\"slideshow\" style='"+(Gallery.mobile?"display:none;":"")+"'><div id=\"slideShowPos\" class=\"slideShowPos\" style=\" position:absolute;bottom:0px;z-index:999;right:10px\"><div class=\"slideshowContainer\" id=\"slideshowContainer\"><div class=\"slideshowBtn\"><ul><li><div class=\"prevIcon\" id=\"prevSlide\"></div></li><li><div class=\"stopIcon\" id='pausePlay'></div></li><li><div class=\"nextIcon\" id='nextSlide'></div></li></ul></div></div></div></div><div style='width: 100%;height: 85px;position: absolute;bottom: 50px;overflow: hidden;z-index:3' id='slideShowHover'><div id=\"slideShowThumb\" style=\" bottom:-57px; position:absolute;padding:0;background:#101010;left:10px;height;65px;overflow:hidden;"+(Gallery.mobile?"display:none;":"")+"\" ><div class=\"slideShowThumbCont\" style='position:relative;left:0px;-webkit-transition:left .3s cubic-bezier(1,.75,.2,.3)' id=\"slideShowThumbCont\" ></div></div></div>";
            var body = document.getElementsByTagName("body")[0];
            body.appendChild(mask);
            body.appendChild(slideshow);
            this.noOfThumbs = Math.floor((windowArea.width - 10)/71);
            var controls=document.getElementById("slideShowPos");
            controls.style.left=Math.ceil((windowArea.width-document.getElementById("slideshowContainer").clientWidth)/2)+"px";
            if(galleryType != "gallery"){
                controls.style.bottom="15px";//NO I18N
                this.noOfThumbs = Math.floor(900/71);
                var thumbCont = document.getElementById("slideShowThumb");
                document.getElementById("slideShowHover").style.bottom="65px";//NO I18N
                thumbCont.style.bottom="0px";//NO I18N
            }else{
                document.getElementById("slideShowThumb").style[trans["transition"]]="bottom .3s linear";//NO I18N
                var overState = false; 
                document.getElementById("slideShowThumb").onmouseover=function(){this.style.bottom="0px";overState=true;};//NO I18N
                document.getElementById("slideShowThumb").onmouseout=function(e){
                    overState=false;
                    if(!e){e =window.event;}
                    var src = this;

                    var e_clientY = e.clientY;
                    setTimeout(function(){
                        if(!overState){
                            if(src.parentNode.offsetTop+src.parentNode.clientHeight>e_clientY){src.style.bottom="-57px"};
                        }
                    },10);
                }
            }
            document.getElementById("slideShowThumb").style.width=(this.noOfThumbs*71)+"px";
            this.frontImg = document.getElementById("curPhoto");
            /*var img=new Image();
            img.onload=function(){
                var foto=thisInst.frontImg;
                foto.src=this.src;
                if(windowArea.height>1024){
                    foto.height=984;
                }
                else{
                    foto.height=windowArea.height-40;
                }
                foto.style.cssText="position:absolute;top:"+((windowArea.height-foto.height)/2)+"px;left:"+(((Gallery.mobile?windowArea.width:900)-foto.width)/2)+"px";//NO I18N
            }
            img.src=this.images[this.no].smallURL;*/
            this.frontCont = document.getElementById("showPhoto");
            document.getElementById("pausePlay").onclick=function(){thisInst.pausePlay(this)};
            document.getElementById("nextSlide").onclick=function(){thisInst.nextSlide(this)};
            document.getElementById("prevSlide").onclick=function(){thisInst.prevSlide(this)};
            //document.getElementById("slideShowThumb").style.width=(this.noOfThumbs*71 > this.images.length*71?"":this.noOfThumbs*71+"px");
            if(!Gallery.mobile)document.getElementById("slideShowThumb").onmousewheel=function(event){thisInst.scrollThumbs(event)};
            document.getElementById("slideShowThumbCont").style.width=(this.images.length*71)+"px";
            this.thumbnails(this.no);
            this.backCont = document.getElementById("slidePhoto");
            this.backImg = document.getElementById("hindFoto");
            this.contWidth = document.getElementById("slideshowImg").clientWidth;
            this.contHeight = document.getElementById("slideshowImg").clientHeight;
            this.startSlideshow(2800,'next');//NO I18N
                
        };
        this.startSlideshow=function(delay,action){
            var img  = new Image();
            img.onload = function(){
                var size = fnFitSize(this.width,this.height,thisInst.contHeight,thisInst.contWidth);
                thisInst.frontImg.oriWidth = this.width;
                thisInst.frontImg.oriHeight = this.height;
                thisInst.frontImg.src = this.src;
                thisInst.frontImg.style.width=size.width+"px";
                thisInst.frontImg.style.height=size.height+"px";
                thisInst.frontImg.style.top=size.top+'px';
                thisInst.frontImg.style.left=size.left+'px';
                thisInst.frontCont.style.opacity=1;
                thisInst.frontCont.style.filter='alpha(opacity=100)';
                thisInst.backCont.style.opacity=0;
                thisInst.backCont.style.filter='alpha(opacity=0)';
                if(thisInst.images.length>1){
                thisInst.timer=setTimeout(function(){
                    if(action == "next"){
                        thisInst.nextSlide();
                    }else if(action == "prev"){
                        thisInst.prevSlide();
                    }else{
                        thisInst.changeSlide(undefined, action)            
                    }
                        thisInst.changing=true;
                },delay);}
            }
            img.src=this.images[this.no].largeURL;
        };
        this.closeSlideshow=function(){
           window.onresize=function(){};
           window.onkeyup=function(){};
           this.paused=false;
           this.changing=false;
           clearTimeout(this.timer);
           if(this.fadeTimer)clearInterval(this.fadeTimer);
           document.getElementsByTagName('body')[0].removeChild(document.getElementById('show1'));
           document.getElementsByTagName('body')[0].removeChild(document.getElementById('mask'));
           document.documentElement.style.overflow? document.documentElement.style.overflow="auto":document.getElementsByTagName("body")[0].style.overflow="auto";
        };
        this.resizeSlideshow=function(){
            clearTimeout(Gallery.resizeTiming);
            Gallery.resizeTiming = setTimeout(function(){
                    var windowArea = _getArea();
                    var controls=document.getElementById("slideShowPos");
                    controls.style.left=Math.ceil((windowArea.width-document.getElementById("slideshowContainer").clientWidth)/2)+"px";

                    if(galleryType != "gallery"){
                        thisInst.noOfThumbs = Math.floor((900)/71);
                    }else{
                        thisInst.noOfThumbs = Math.floor((windowArea.width-10)/71);
                    }
                    var part=Math.floor(thisInst.no/thisInst.noOfThumbs);
                    var thumbStart = part*thisInst.noOfThumbs;
                    document.getElementById("slideShowThumb").style.width=(thisInst.noOfThumbs*71)+"px";
                    if(!Gallery.mobile){slideShowThumbCont.style.left=-(document.getElementById("thumb_"+thumbStart).offsetLeft-3)+"px";}
                    document.getElementById("slideShowThumb").style.left=Math.ceil(windowArea.width-document.getElementById("slideShowThumb").clientWidth)/2+"px";
                    var contImg = document.getElementById("slideshowImg");
                    contImg.style.height = windowArea.height+"px";
                    contImg.style.left = (Gallery.mobile?"0":Math.floor((windowArea.width-900)/2))+"px";
                    if(Gallery.mobile){
                        contImg.style.width = windowArea.width+"px";
                        thisInst.contWidth = windowArea.width;
                    }
                    thisInst.contHeight = windowArea.height;
                    var size = fnFitSize(thisInst.frontImg.oriWidth,thisInst.frontImg.oriHeight,thisInst.contHeight,thisInst.contWidth);
                    thisInst.frontImg.style.width=size.width+"px";
                    thisInst.frontImg.style.height=size.height+"px";
                    thisInst.frontImg.style.top=size.top+'px';
                    thisInst.frontImg.style.left=size.left+'px';
                    },200);
        };
        this.nextSlide=function(obj){
            if(obj && !this.paused){
                document.getElementById("pausePlay").className="playIcon";
                this.paused = true;
                clearTimeout(this.timer);
            }
            if(!obj && !this.changing){
                var next = this.images.length-1 > this.no?(this.no+1):0;
                this.transition(next);
            }else if(obj && !this.changing){
                this.startSlideshow(0,'next');//NO I18N
            }
        }
        this.transition=function(pos){
            var img = new Image();
            img.onload = function(){
                var size = fnFitSize(this.width,this.height,thisInst.contHeight,thisInst.contWidth);
                thisInst.backImg.src=this.src;
                thisInst.backImg.style.width=size.width+'px';
                thisInst.backImg.style.height=size.height+'px';
                thisInst.backImg.style.top=size.top+'px';
                thisInst.backImg.style.left=size.left+'px';
                if(trans){
                    thisInst.frontCont.style[trans['transition']]="opacity .4s ease-in";//NO I18N
                    setTimeout(function(){thisInst.frontCont.style.opacity=0.01},20);
                    thisInst.frontCont.style.filter='alpha(opacity='+.1+')';
                    thisInst.frontCont.addEventListener(trans.transitionEnd,function(){this.style[trans.transition]="";this.removeEventListener(trans.transitionEnd,arguments.callee);thisInst.backCont.style[trans.transition]="opacity .4s ease-in";setTimeout(function(){thisInst.backCont.style.opacity=1},20);thisInst.backCont.addEventListener(trans.transitionEnd,function(){this.style[trans.transition]="";this.removeEventListener(trans.transitionEnd,arguments.callee);thisInst.frontImg.src=img.src;thisInst.animateThumbnail(pos,thisInst.no);thisInst.no=pos;thisInst.changing=false;if(!thisInst.paused){thisInst.startSlideshow(2800,'next')}},false)},false);
                }else{
                    thisInst.fadeOutDone=1;
                    thisInst.fadeOutEnd=0.01;
                    thisInst.stepOut=(thisInst.fadeOutDone-thisInst.fadeOutEnd)/60;
                    thisInst.fadeInDone=0;
                    thisInst.fadeInEnd=1;
                    thisInst.stepIn=(thisInst.fadeInEnd-thisInst.fadeInDone)/60;
                    var callBack = thisInst.fadeIn 
                    var callBack1 = function(){
                        thisInst.frontImg.src=img.src;thisInst.backCont.style.opacity=1;thisInst.backCont.style.filter='alpha(opacity=100)';thisInst.animateThumbnail(pos,thisInst.no);thisInst.no=pos;thisInst.changing=false;if(!thisInst.paused){thisInst.startSlideshow(2800,'next')}}
                    thisInst.fadeOut(callBack,callBack1);   
                }
            };
            img.src=this.images[pos].largeURL;
        };
        this.prevSlide=function(obj){
            if(obj && !this.paused){
                document.getElementById("pausePlay").className="playIcon";
                this.paused = true;
                clearTimeout(this.timer);
            }
            if(!obj && !this.changing){
                var prev = this.no == 0?this.images.length-1:this.no-1;
                this.transition(prev);
            }else if(obj && !this.changing){
                this.startSlideshow(0,'prev');//NO I18N
            }
        };
        this.thumbnails=function(no){
            if(Gallery.mobile)return;
            var windowArea = _getArea();
            var thumbCount = this.noOfThumbs;
            var part=Math.floor(no/thumbCount);
            this.currentView=part;
            var html="";
            var thumbStart = part*thumbCount;
            document.getElementById("slideShowThumbCont").innerHTML="";
            for(var i=0;i< this.images.length;i++){
                    html+="<div class='withMask "+(i==no?"withoutMask":"")+"' onclick='Gallery.changeSlide(this,"+i+")' id='thumb_"+i+"' style='background:url(\""+(this.images[i].smallURL.replace("'","%27"))+"\") no-repeat center center;background-size:cover;'></div>";
            }
            document.getElementById("slideShowThumbCont").innerHTML=html;
            slideShowThumbCont.style.left=(part == 0?"0px":-(document.getElementById("thumb_"+thumbStart).offsetLeft-3)+"px");
            document.getElementById("slideShowThumb").style.left=Math.ceil(windowArea.width-document.getElementById("slideShowThumb").clientWidth)/2+"px";

        };
        this.animateThumbnail=function(no,prevThumb){
             if(Gallery.mobile)return;
             document.getElementById("thumb_"+prevThumb).className = "withMask";
             document.getElementById("thumb_"+no).className="withMask withoutMask";
             if(window.scrollTimer)return;
             var thumbCount = this.noOfThumbs;
             var part=Math.floor(no/thumbCount);
             if(this.currentView == part)return;
             var thumbStart = part*thumbCount;
             if(this.currentView < part){ 
                slideShowThumbCont.style.left=-(document.getElementById("thumb_"+thumbStart).offsetLeft-3)+"px";//(part == 0?"0px":(slideShowThumbCont.offsetLeft-left)+"px");
             }else{
                slideShowThumbCont.style.left=-(document.getElementById("thumb_"+thumbStart).offsetLeft-3)+"px";   
             }
             this.currentView=part;
        };
        this.scrollThumbs=function(e){
            if(window.scrollTimer)return;
            window.scrollTimer = setTimeout(function(){
            var scroll = e.wheelDelta?e.wheelDelta:e.detail*40;
            var part = thisInst.currentView, thumbCount = thisInst.noOfThumbs;
            if(scroll>0){
                part-=1;
                if(part > -1){
                    var thumbStart = part*thumbCount;
                    var thumbEnd = (((part*thumbCount)+thumbCount) < thisInst.images.length ? (part*thumbCount)+thumbCount : thisInst.images.length);
                    var left = (thumbEnd*71)-(thumbStart*71);
                    slideShowThumbCont.style.left=-(document.getElementById("thumb_"+thumbStart).offsetLeft-3)+"px";
                    thisInst.currentView-=1;
                }
            }else{
                part+=1;
                if(part < Math.ceil(thisInst.images.length/thumbCount)){
                    var thumbStart = part*thumbCount;
                    var thumbEnd = (((part*thumbCount)+thumbCount) < thisInst.images.length ? (part*thumbCount)+thumbCount : thisInst.images.length);
                    var left = (thumbEnd*71)-(thumbStart*71);
                    slideShowThumbCont.style.left=-(document.getElementById("thumb_"+thumbStart).offsetLeft-3)+"px";
                    thisInst.currentView+=1;
                }
            }
            window.scrollTimer=0;
            clearTimeout(window.scrollTimer);
            },300);
        }
        this.changeSlide=function(obj,pos){
            if(!this.paused){
                document.getElementById("pausePlay").className="playIcon";
                this.paused = true;
                clearTimeout(this.timer);
            }
            if(this.changing){
                this.frontCont.style[trans['transition']]='';//NO I18N
                this.backCont.style[trans['transition']]='';//NO I18N
                this.frontCont.style.opacity=1;
                this.frontCont.style.filter='alpha(opacity=100)';
                this.backCont.style.opacity=0;
                this.backCont.style.filter='alpha(opacity=0)';
                this.changing=false;
            }
            if(obj){
                this.startSlideshow(0,pos); 
            }else{
                this.transition(pos);
            }
        };
        this.pausePlay=function(obj){
            if(obj.className == "stopIcon"){
                this.paused=true;
                obj.className="playIcon";
                clearTimeout(this.timer);
                if(this.changing){
                    this.frontCont.style[trans['transition']]='';//NO I18N
                    this.backCont.style[trans['transition']]='';//NO I18N
                    this.frontCont.style.opacity=1;
                    this.frontCont.style.filter='alpha(opacity=100)';
                    this.backCont.style.opacity=0;
                    this.backCont.style.filter='alpha(opacity=0)';
                    this.changing=false;
                }
            }
            else{
                this.paused=false;
                this.startSlideshow(2800,'next');//NO I18N
                obj.className="stopIcon";

            }
        };
        this.fadeOut = function(callback,callback1){
            this.fadeTimer=setInterval(function(){
                        if(thisInst.fadeOutDone>thisInst.fadeOutEnd){
                            thisInst.fadeOutDone-=thisInst.stepOut;
                            thisInst.frontCont.style.opacity=thisInst.fadeOutDone;
                            thisInst.frontCont.style.filter='alpha(opacity='+(thisInst.fadeOutDone*100)+')';
                        }else{
                            //thisInst.frontImg.src="";
                            thisInst.frontCont.style.opacity=0.01;
                            thisInst.frontCont.style.filter='alpha(opacity=.1)';
                            clearInterval(thisInst.fadeTimer);
                            callback(callback1);
                        }
                        },1);
        };
        this.fadeIn = function(callback){
            this.fadeTimer=setInterval(function(){
                    if(thisInst.fadeInDone<thisInst.fadeInEnd){
                        thisInst.fadeInDone+=thisInst.stepIn;
                        thisInst.backCont.style.opacity=thisInst.fadeInDone;
                        thisInst.backCont.style.filter='alpha(opacity='+(thisInst.fadeInDone*100)+')';
                    }else{
                        clearInterval(this.fadeTimer);
                        callback();
                    }
                    },1);

        }
        this.slideKeyEvents = function(e){
           var charCode=(e.which)?e.which:e.keyCode;
           if(charCode == 32){
                thisInst.pausePlay(document.getElementById("pausePlay"));
           }else if(charCode == 37 || charCode == 38){
                thisInst.prevSlide(true);
           }else if(charCode == 39 || charCode == 40){
                thisInst.nextSlide(true);
           }else if(charCode == 27){
                Gallery.closeSlideshow();
           }
        }

        this.initSlideshow();
        window.onresize=this.resizeSlideshow;
        window.onkeyup=this.slideKeyEvents;
    };
}());
fnGetCorrectSize = function(square,maxW,maxH){
        var sizes = [130,260,520,1000];
        var url = ['squareURL','smallURL','mediumURL','largeURL'];//NO I18N
        for(var i=0,size;size=sizes[i];i++){
            if(size < maxW){
                var w,h;
                if(size == 130){
                    h=130;
                    w = 130;
                }else{
                    w = size;
                    h = Math.ceil(maxH/(maxW/size));
                }
                if(w > square && h > square){   
                    return url[i]; 
                }
            }
        }
    return 'largeURL';//NO I18N
}
fnFitSize=function(imgWidth,imgHeight, maxh, maxw) {
    var ratio = maxh/maxw;
    if (imgHeight/imgWidth > ratio){
        if (imgHeight > maxh){
            imgWidth = Math.round(imgWidth*(maxh/imgHeight));
            imgHeight = maxh;
        }
    } else {
        if (imgWidth > maxh){
            imgHeight = Math.round(imgHeight*(maxw/imgWidth));
            imgWidth = maxw;
        }
    }
    var dimensions={};
    dimensions.height=imgHeight;
    dimensions.width=imgWidth;
    dimensions.top = Math.ceil((maxh-imgHeight)/2);
    dimensions.left = Math.ceil((maxw-imgWidth)/2);
    return dimensions;
}
transSupport=function(){
    var transitions = {
        'transition':'transitionend',// No I18N
        'OTransition':'oTransitionEnd',// No I18N
        'MSTransition':'msTransitionEnd',// No I18N
        'MozTransition':'transitionend',// No I18N
        'WebkitTransition':'webkitTransitionEnd'// No I18N
    }
    var style = document.body.style || document.documentElement.style;
    for(transition in transitions){
        if(style[transition] != undefined){
            return {transitionEnd:transitions[transition],'transition':transition};
        }
    }
    return false;
}

