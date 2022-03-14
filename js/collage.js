/*$Id$*/
var types = [[4,3,5,2,1,6],[6,3,1,2,4,5],[1,3,6,2,5,4],[5,3,1,2,4,6]];
var start = 0;
var gallery1;
var width;
var height;
var prevType=0;
var colType = [];
function collageMaker(galleryData,wid,galElem,imgSrc){
    var imgs;
    if(galleryData){
        start=0;
        imgs=imgSrc;
        gallery1 = galleryData;width=wid;height=Math.ceil((width*9)/16);parElem=galElem;
        if(gallery1.collageType != "random"){
            colType = types[parseInt(gallery1.collageType.replace("type",""),10)-1].slice(0);
        }
    }
        parElem.style.height="";
	if(parElem.nextElementSibling){
	 $D.remove(parElem.nextElementSibling);
      }
    var type;
    if(gallery1.collageType == "random"){
        type = Math.ceil(Math.random()*5);
        while(prevType == type){
            type = Math.ceil(Math.random()*6);
        }
        prevType = type;
    }else{
        if(colType.length>0){
            type=colType.shift();
        }else{
            colType = types[parseInt(gallery1.collageType.replace("type",""),10)-1].slice(0);
            type=colType.shift();
        }
    }
    var padding=1;
    var spacing = parseInt(gallery1.style.spacing);
    var border = parseInt(gallery1.style.border);
    var tot = (padding*2)+(parseInt(spacing)*2)+(parseInt(border)*2); 
    var rowCont = document.createElement("div");
        var clickFn = function(){Gallery.slideShow(this.id.replace(/photoDiv.*p-img/,''),this.parentNode.firstElementChild.imgs,"gallery")};//NO I18N
    if(type == 1){

        for(var i=start;i<(start+5>gallery1.imgs.length?gallery1.imgs.length:start+5);i++){ 
            var img = document.createElement("div");
            img.className="collage";
            img.id="photoDiv"+loadingAlbumCount+"p-img"+i;
            if(i == 0)
                img.imgs=imgs;
            if(window.ZS_PublishMode && window.location.href.indexOf("/preview/") == -1){
                img.onclick= clickFn
            }

            img.style.padding = padding+"px";
            img.style.float="left";//NO I18N
            var img2 = document.createElement("div");
            img2.style.background = gallery1.style.background;
            img2.style.border=border+"px solid "+gallery1.style.bordercolor;
            var img1 = document.createElement("div");
            if(i == start){
                var imgWid = (width/2)-tot;
                var imgHei = height-tot;
                img2.style.width = (imgWid+(2*spacing))+"px";
                img2.style.height = (imgHei+(2*spacing))+"px";
                img1.style.cssText = "width:"+imgWid+"px;height:"+(imgHei)+"px;";//NO I18N
            }else{
                var imgWid = (width/4)-tot;
                var imgHei = ((height/2)-tot)+.5;
                img2.style.width = (imgWid+(2*spacing))+"px";
                img2.style.height = (imgHei+(2*spacing))+"px";
                img1.style.cssText = "width:"+(imgWid)+"px;height:"+(imgHei)+"px;";//NO I18N
            }
            if(gallery1.caption){
                var cap = document.createElement("div");
                cap.className = "zscaption";
                cap.innerHTML=gallery1.imgs[i].caption;
                img1.appendChild(cap);
            }
            img1.style.backgroundImage = "url('"+gallery1.imgs[i].img+"') ";//NO I18N
            img1.style.backgroundRepeat = "no-repeat";//NO I18N
            img1.style.backgroundPosition = "center center";//NO I18N
            img1.style.backgroundSize = "cover";//NO I18N
            img1.style.float="left";//NO I18N
            img1.style.position="relative";
            img1.style.margin=spacing+"px";//NO I18N
            img2.appendChild(img1);
            img.appendChild(img2);
            parElem.appendChild(img);
        }
        //gallery1.imgs.splice(start,start+5);
        start=start+5;
    }else if(type == 2){
        for(var i=start;i<(start+4>gallery1.imgs.length?gallery1.imgs.length:start+4);i++){
            var img = document.createElement("div");
            if(i == 0)
                img.imgs=imgs;
            img.className="collage";
            img.id="photoDiv"+loadingAlbumCount+"p-img"+i;
            if(window.ZS_PublishMode && window.location.href.indexOf("/preview/") == -1){
                img.onclick=clickFn;
            }
            img.style.padding = padding+"px";
            img.style.float = "left";//NO I18N
            var img2 = document.createElement("div");
            img2.style.background = gallery1.style.background;
            img2.style.border=border+"px solid "+gallery1.style.bordercolor;
            var img1 = document.createElement("div");
            if(i == start){
                var imgWid = (width/2)-tot;
                var imgHei = height-tot;
                img2.style.width = (imgWid+(2*spacing))+"px";
                img2.style.height = (imgHei+(2*spacing))+"px";
                img1.style.cssText = "width:"+imgWid+"px;height:"+imgHei+"px;float:left";//NO I18N
            }else if(i == start+1){
                var imgWid = (width/2)-tot;
                var imgHei = ((height-(height/3))-tot)+1;
                img2.style.width = (imgWid+(2*spacing))+"px";
                img2.style.height = (imgHei+(2*spacing))+"px";
                img1.style.cssText = "width:"+imgWid+"px;height:"+imgHei+"px;float:left";//NO I18N
            }else{
                var imgWid = (width/4)-tot;
                var imgHei = (height/3)-tot;
                img2.style.width = (imgWid+(2*spacing))+"px";
                img2.style.height = (imgHei+(2*spacing))+"px";
                img1.style.cssText = "width:"+imgWid+"px;height:"+imgHei+"px;float:left";//NO I18N
            }
            if(gallery1.caption){
                var cap = document.createElement("div");
                cap.className = "zscaption";
                cap.innerHTML=gallery1.imgs[i].caption;
                img1.appendChild(cap);
            }

            img1.style.backgroundImage = "url('"+gallery1.imgs[i].img+"') ";//NO I18N
            img1.style.backgroundRepeat = "no-repeat"; //NO I18N
            img1.style.backgroundPosition = "center center"; //NO I18N
            img1.style.backgroundSize = "cover";//NO I18N
            img1.style.position="relative";
            img2.appendChild(img1);
            img1.style.margin=spacing+"px";//NO I18N
            img.appendChild(img2);
            parElem.appendChild(img);
        }
        //gallery1.imgs.splice(start,start+4);
        start=start+4;
    }else if(type == 3){
        var img = document.createElement("div");
        if(start == 0)
            img.imgs=imgs;
        img.style.padding=padding+"px";
        img.className="collage";
        img.id="photoDiv"+loadingAlbumCount+"p-img"+start;
        if(window.ZS_PublishMode && window.location.href.indexOf("/preview/") == -1){
            img.onclick=clickFn;
        }
        img.style.float="left";//NO I18N
        var img2 = document.createElement("div");
        img2.style.background = gallery1.style.background;
        img2.style.border=border+"px solid "+gallery1.style.bordercolor;
        var imgWid = width-tot;
        var imgHei = (height-(height/3))-tot;
        img2.style.width = (imgWid+(2*spacing))+"px";
        img2.style.height = (imgHei+(2*spacing))+"px";
        var img1 = document.createElement("div");
        img1.style.cssText = "width:"+imgWid+"px;height:"+imgHei+"px;float:left";//NO I18N
        img1.style.backgroundImage = "url('"+gallery1.imgs[start].img+"') ";//NO I18N
        img1.style.backgroundRepeat = "no-repeat"; //NO I18N
        img1.style.backgroundPosition = "center center";//NO I18N
        img1.style.backgroundSize = "cover";//NO I18N
        img1.style.margin=spacing+"px";//NO I18N
        img1.style.position="relative";
        if(gallery1.caption){
            var cap = document.createElement("div");
            cap.className = "zscaption";
            cap.innerHTML=gallery1.imgs[start].caption;
            img1.appendChild(cap);
        }

        img.appendChild(img2);
        img2.appendChild(img1);
        parElem.appendChild(img);
        //gallery1.imgs.splice(0,1);
        start=start+1;
    }else if(type == 4){
        for(var i=start;i<(start+4>gallery1.imgs.length?gallery1.imgs.length:start+4);i++){
            var img = document.createElement("div");
            if(i == 0)
                img.imgs=imgs;
            img.className="collage";
            img.id="photoDiv"+loadingAlbumCount+"p-img"+i;
            if(window.ZS_PublishMode && window.location.href.indexOf("/preview/") == -1){
                img.onclick=clickFn;
            }
            img.style.padding=padding+"px";
            img.style.float="left";//NO I18N
            var img2 = document.createElement("div");
            img2.style.background = gallery1.style.background;
            img2.style.border=border+"px solid "+gallery1.style.bordercolor;
            var img1 = document.createElement("div");
            if(i == start){
                var imgWid = (width/2)-tot;
                var imgHei = height-tot;
                img2.style.width=(imgWid+(2*spacing))+"px"
                img2.style.height=(imgHei+(2*spacing))+"px"
                img1.style.cssText = "width:"+imgWid+"px;height:"+imgHei+"px;float:left";//NO I18N
            }else if(i == start+1){
                var imgWid = (width/2)-tot;
                var imgHei = ((height/2)-tot)+1;
                img2.style.width=(imgWid+(2*spacing))+"px";
                img2.style.height=(imgHei+(2*spacing))+"px"
                img1.style.cssText = "width:"+imgWid+"px;height:"+imgHei+"px;float:left";//NO I18N
            }else{
                var imgWid = (width/4)-tot;
                var imgHei = (height/2)-tot;
                img2.style.width=(imgWid+(2*spacing))+"px";
                img2.style.height=(imgHei+(2*spacing))+"px"
                img1.style.cssText = "width:"+imgWid+"px;height:"+imgHei+"px;float:left";//NO I18N
            }
            if(gallery1.caption){
                var cap = document.createElement("div");
                cap.className = "zscaption";
                cap.innerHTML=gallery1.imgs[i].caption;
                img1.appendChild(cap);
            }

            img1.style.backgroundImage = "url('"+gallery1.imgs[i].img+"') ";//NO I18N
            img1.style.backgroundRepeat = "no-repeat"; //NO I18N
            img1.style.backgroundPosition = "center center";//NO I18N
            img1.style.backgroundSize = "cover";//NO I18N
            img1.style.margin=spacing+"px";//NO I18N
            img1.style.position="relative";
            img2.appendChild(img1);
            img.appendChild(img2);
            parElem.appendChild(img);
        }
        //gallery1.imgs.splice(start,start+4);
        start=start+4;
    }else if(type == 5){
        var img = document.createElement("div");
        if(start == 0)
            img.imgs=imgs;
        img.className="collage";
        img.id="photoDiv"+loadingAlbumCount+"p-img"+start;
        if(window.ZS_PublishMode && window.location.href.indexOf("/preview/") == -1){
            img.onclick=clickFn;
        }
        img.style.padding=padding+"px";
        img.style.float="left";//NO I18N
        var img4 = document.createElement("div");
        var imgWid = (width-(width/3))-tot;
        var imgHei = (height-(height/3))-tot;
        img4.style.width=(imgWid+(2*spacing))+"px";
        img4.style.height=(imgHei+(2*spacing))+"px";
        img4.style.background = gallery1.style.background;
        img4.style.border=border+"px solid "+gallery1.style.bordercolor;
        var img1 = document.createElement("div");
        img1.style.cssText = "width:"+imgWid+"px;height:"+imgHei+"px;float:left";//NO I18N
        img1.style.backgroundImage = "url('"+gallery1.imgs[start].img+"') ";//NO I18N
        img1.style.backgroundRepeat = "no-repeat";//NO I18N
        img1.style.backgroundPosition = "center center";//NO I18N
        img1.style.backgroundSize = "cover";//NO I18N
        img1.style.position="relative";
        img1.style.margin=spacing+"px";//NO I18N
        if(gallery1.caption){
            var cap = document.createElement("div");
            cap.className = "zscaption";
            cap.innerHTML=gallery1.imgs[start].caption;
            img1.appendChild(cap);
        }
        img4.appendChild(img1);
        img.appendChild(img4);
        parElem.appendChild(img);
        if(start+1 < gallery1.imgs.length){
        var img2 = document.createElement("div");
        img2.className="collage";
        img2.id="photoDiv"+loadingAlbumCount+"p-img"+(start+1);
        if(window.ZS_PublishMode && window.location.href.indexOf("/preview/") == -1){
            img2.onclick=clickFn;
        }

        img2.style.padding=padding+"px";
        img2.style.float="left";//NO I18N
        var img5 = document.createElement("div");
        var imgWid = (width/3)-tot;
        var imgHei = (height-(height/3))-tot;
        img5.style.width=(imgWid+(2*spacing))+"px";
        img5.style.height=(imgHei+(2*spacing))+"px";
        img5.style.background = gallery1.style.background;
        img5.style.border=border+"px solid "+gallery1.style.bordercolor;
        var img3 = document.createElement("div");
        img3.style.cssText = "width:"+imgWid+"px;height:"+imgHei+"px;float:left";//NO I18N
        img3.style.backgroundImage = "url('"+gallery1.imgs[start+1].img+"') ";//NO I18N
        img3.style.backgroundRepeat = "no-repeat";//NO I18N
        img3.style.position="relative";
        img3.style.backgroundPosition = "center center";//NO I18N
        img3.style.backgroundSize = "cover";//NO I18N
        img3.style.margin=spacing+"px";//NO I18N
        if(gallery1.caption){
            var cap = document.createElement("div");
            cap.className = "zscaption";
            cap.innerHTML=gallery1.imgs[start+1].caption;
            img3.appendChild(cap);
        }
        img5.appendChild(img3);
        img2.appendChild(img5);
        parElem.appendChild(img2);
        }
        //gallery1.imgs.splice(0,2);
        start=start+2;
    }else if(type == 6){
        for(var i=start;i<(start+4>gallery1.imgs.length?gallery1.imgs.length:start+4);i++){
            var img = document.createElement("div");
            if(i == 0)
                img.imgs=imgs;
            img.className="collage";
            img.id="photoDiv"+loadingAlbumCount+"p-img"+i;
            if(window.ZS_PublishMode && window.location.href.indexOf("/preview/") == -1){
                img.onclick=clickFn;
            }
            img.style.padding=padding+"px";
            img.style.float="left";//NO I18N
            var img2 = document.createElement("div");
            var imgWid = (width/2)-tot;
            var imgHei = (height/2)-tot;
            img2.style.background = gallery1.style.background;
            img2.style.border=border+"px solid "+gallery1.style.bordercolor;
            var img1 = document.createElement("div");
            img2.style.width=(imgWid+(2*spacing))+"px";
            img2.style.height=(imgHei+(2*spacing))+"px"
            img1.style.cssText = "width:"+imgWid+"px;height:"+imgHei+"px;float:left";//NO I18N
            img1.style.backgroundImage = "url('"+gallery1.imgs[i].img+"') ";//NO I18N
            img1.style.backgroundRepeat = "no-repeat";//NO I18N
            img1.style.backgroundPosition = "center center";//NO I18N
            img1.style.position="relative";
            img1.style.backgroundSize = "cover";//NO I18N
            img1.style.margin=spacing+"px";//NO I18N
            if(gallery1.caption){
                var cap = document.createElement("div");
                cap.className = "zscaption";
                cap.innerHTML=gallery1.imgs[i].caption;
                img1.appendChild(cap);
            }

            img2.appendChild(img1);
            img.appendChild(img2);
            parElem.appendChild(img);
        }
        start=start+4;
    }
    if(gallery1.imgs.length>start){
        collageMaker();    
    }else{
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
                setTimeout(function(){func(window.ZS_PublishMode || window.ZS_PreviewMode)},1000);

            }
            loadingAlbumCount++;
        }
    }
}
