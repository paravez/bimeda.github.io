/*$Id:$*/
var Map = {};
Map.loadMap = function(){
    while(mapElem.length >0){
        var mElem = mapElem.pop();
        Map.initializeMap(mElem);
    }
}
Map.initializeMap = function(elem){
    var id = "map"+elem.id;
    var mapEle = document.getElementById(id);
    var latlng = elem.getAttribute("data-latlng");
    var zoom = elem.getAttribute("data-zoom");
    var mapType = elem.getAttribute("data-mapType");
    var markerTitle = elem.getAttribute("data-markerTitle");
    var markerLatlng = elem.getAttribute("data-markerLatlng");
	var size = elem.getAttribute("data-size");
	var align = elem.getAttribute("data-align");
	var s = size.split('x');
	var mobile = (window.location.href.indexOf('mobile')==-1)?false:true;
    mapEle.style.width=mobile?(size=="250x250"?"80%":size=="350x350"?"90%":"100%"):s[0]+"px";
    mapEle.style.height=(mobile?(size=="250x250"?"200":size=="350x350"?"250":"300"):s[1])+"px";
	if(align != "center"){
		mapEle.style.styleFloat = align;
		mapEle.style.cssFloat = align;
	}
	else{
		mapEle.style.margin = "0 auto";
	}
    if(window.ZS_PublishMode || window.ZS_PreviewMode){
        var latlngv = latlng.split(",");
        var lat = parseFloat(latlngv[0]);
        var lng = parseFloat(latlngv[1]);
        var sLoc = new google.maps.LatLng(lat, lng);
        var mLatlng = markerLatlng.split(",");
        var mLat = parseFloat(mLatlng[0]);
        var mLng = parseFloat(mLatlng[1]);
        var mLoc = new google.maps.LatLng(mLat,mLng);
        var myOptions = {
            zoom: parseInt(zoom),
            center: sLoc,
            mapTypeId: mapType
        };
        var sMap = new google.maps.Map(mapEle,myOptions);
        var sMarker = new google.maps.Marker({
            position: mLoc,
            map: sMap,
            title:markerTitle,
            draggable:false,
            animation: google.maps.Animation.DROP
        });
  		google.maps.event.addListener(sMap, 'zoom_changed', function(){
        var latlng = "";
        var mloc = sMarker.getPosition();
        latlng = mloc.toUrlValue();
        var latlngv = latlng.replace(/\(|\)/g,"").split(",");
        var lat = parseFloat(latlngv[0]);
        var lng = parseFloat(latlngv[1]);
        newLoc = new google.maps.LatLng(lat, lng);
        sMap.panTo(newLoc);
        
		});	
	
    }
}


