/*$Id: portal_signup.js,v 2314:83bc13ebe1fe 2011/08/20 06:31:21 dinesh.n $*/
postListener = function(ev){
    var dataObj = JSON.parse(ev.data);
    var functionStr = dataObj.handler + "(" + dataObj.response + ")";
    var newFunction = new Function(functionStr);
    newFunction();
}
fnKeyDown = function(ev){
    var key_code = (ev.which) ? ev.which : ev.keyCode;
    if(key_code == 13 && document.getElementById("signupContinueDiv").style.display != "none"){
        ev.preventDefault();
        //ev.stopPropagation();
        signupPreConfirmation();
    }
}
signupResponse = function(response){
    if(response.error){
        var errorCode = response.error;
        var errorContainer = document.getElementById("signup_error_msg_container");
        if(errorCode == 103){
            errorContainer.innerHTML = "* Password and Confirm Password does not match.";//No I18N
        } else if(errorCode == 101){
            errorContainer.innerHTML = "* Email ID already exists.";//No I18N
        } else if(errorCode == 102){
            errorContainer.innerHTML = "* Captcha mismatch.";//No I18N
            var captchaElt = document.getElementsByClassName("captchaImg");//NO I18N
            captchaElt[0].src = response.captchaUrl;  
            document.forms.portalSignUpForm.captcha.value="";
            document.forms.portalSignUpForm.captcha.focus();
            var digestField = document.forms.portalSignUpForm.digest;
            digestField.value = response.captchaDigest;
        } else{
            if(response.msg){
                errorContainer.innerHTML = response.msg;
            } else{
                errorContainer.innerHTML = "* Error occured while creating account";//No I18N
            }
        }
        errorContainer.style.display = "block";
        return;
    }
    window.open(response.redirect_url, "_self");
}

fnLoadBind = function(){
    
    if(window.addEventListener){
        window.addEventListener("message", postListener, false);
    } else{
        window.attachEvent("onmessage", postListener);
    }
}
window.onload = function(){
    fnLoadBind();
    var params = getQueryString();
    var hiddenFields = {"domain" : document.domain};//No I18N
    if(!params.token){
        var httpReq;

        if(window.XMLHttpRequest){
            httpReq = new XMLHttpRequest();
        } else{
            httpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        httpReq.onreadystatechange = function(){
            if(httpReq.readyState ==4){
                if(httpReq.status == 200){
                    constructSignupForm.apply(this);
                }
            }
        }
        httpReq.open("GET", "/siteapps/signupFields");
        httpReq.send();
    }else{
        var subscriptionElem = document.getElementById("portal_subscription");
        var parentElem = subscriptionElem.parentNode;
        if(params.email){
            var emailField = document.forms.portalSignUpForm.email;
            emailField.readOnly = true;
            emailField.value = params.email;
        }
        //add domain hidden form input field
        
        if(params.token){
            document.getElementById("signupContinueDiv").style.display="none";
            document.getElementById("signupDiv").style.display="block";
            document.getElementById("zs_verification").style.display="none";
            document.getElementById("zs_signup_msg").style.display="none";
            hiddenFields.token = params.token;
        }
    }
        //var hiddenFields = {"domain" : document.domain};//No I18N
        var subscriptionElem = document.getElementById("portal_subscription");
        var parentElem = subscriptionElem.parentNode;
        for(var hiddenField in hiddenFields){

            var hiddenTag = document.createElement("input");
            hiddenTag.type = "hidden";
            hiddenTag.value = hiddenFields[hiddenField];
            hiddenTag.name = hiddenField;
            parentElem.insertBefore(hiddenTag, subscriptionElem);
        }
        if(document.forms.portalSignUpForm.email.getAttribute("disabled") != null){
            document.forms.portalSignUpForm.email.removeAttribute("disabled");
        } 
}

constructSignupForm = function(){
    var response = JSON.parse(this.responseText);
    var parameters = getQueryString();
    if(!parameters.token){
        if(!response.signup){
            document.getElementById("zs_noSignupAllowed").style.display = "block";
            document.getElementById("zs_signup").style.display = "none";
        }
    }
}

getQueryString = function(){
    var queryStr = window.location.search.substring(1);
    var patt = /([^&=]+)={1}([^&]+)/g;
    var parameter;
    var params = {};
    while(parameter = patt.exec(queryStr)){
        params[parameter[1]] = parameter[2];
    }
    return params;
}

submitForm = function(){
    var signupForm = document.forms.portalSignUpForm;
    var signupFields = signupForm.elements;
    var sendRequest = true;
    //Get form fields
    var signupObj = {};
    var parameters = getQueryString();
    for(var i=0; i<signupFields.length; i++){
        var signupTag = signupFields[i];
        var signupName = signupTag.name;
        var signupType = signupTag.type;
        if(signupType == "text" || signupType == "textarea" || signupType == "password" || signupType == "hidden"){
            if(parameters.token){
                if(signupName != "otp"){
                    var fieldVal = (signupName == "captcha")?signupTag.value : trim(signupTag.value);//NO I18N
                    if(fieldVal != ""){
                        signupObj[signupName] = fieldVal;
                        hideFieldErrorMessage(signupTag);
                    } else{
                        sendRequest = false;
                        showFieldErrorMessage(signupTag);
                    }
                }
            }else{
                var fieldVal = (signupName == "captcha")?signupTag.value : trim(signupTag.value);//NO I18N
                if(fieldVal != ""){
                    signupObj[signupName] = fieldVal;
                    hideFieldErrorMessage(signupTag);
                } else{
                    sendRequest = false;
                    showFieldErrorMessage(signupTag);
                }
            }
        } else if(signupType == "select-one"){
            var selectOpt = signupTag.options;
            if(selectOpt.length){
                var selectedIndex = selectOpt.selectedIndex;
                signupObj[signupName] = selectOpt[selectedIndex].value;
            }
        } else if(signupType == "checkbox"){
            var checkBoxLength = signupTag.length;
            if(signupTag.checked == true){
                signupObj[signupName] = signupTag.value;
            }
        }
    }
    var errorMsg;
    var errorContainer = document.getElementById("signup_error_msg_container");
    errorContainer.style.display = "none";
    var email_patt = new RegExp("^[a-zA-Z0-9]([\\w\\-\\.\\+\']*)@([\\w\\-\\.]*)(\\.[a-zA-Z]{2,8}(\\.[a-zA-Z]{2}){0,2})$","mig");
    if(sendRequest){
        if(signupObj.otp && !isNumber(signupObj.otp)){
            errorMsg = "* Please enter valid verification code received in your mail.";//NO I18N
            signupForm.otp.focus();
        } else if(signupObj.password.length < 8){
            errorMsg = "* Your password should have a minimum of 8 characters.";//No I18N
            signupForm.password.focus();
        } else if(signupObj.confirm_password && signupObj.confirm_password != signupObj.password){
            errorMsg = "* Password and Confirm Password does not match.";//No I18N
            signupForm.password.focus();
        } else if(signupObj.phone && !isNumber(signupObj.phone)){
            errorMsg = "* Invalid format entered for phone number.";//No I18N
            signupForm.phone.focus();
        } else if(signupObj.postal_code){
            if(signupObj.postal_code.length > 12){
                errorMsg = "* You have exceeded postal code character limit.";//N0 I18N
            }
            else if(!isPostalCode(signupObj.postal_code)){
                errorMsg = "* Invalid format entered for postal code.";//No I18N
            }
            signupForm.postal_code.focus();
        } else if(!email_patt.test(signupObj.email)){
            errorMsg = "* Enter a valid email.";//NO I18N
            signupForm.email.focus();
        } else if(signupObj.name && isNumber(signupObj.name)){
            errorMsg = "* Invalid format entered for name."; //NO I18N
            signupForm.name.focus();
        } else if(signupObj.state && isNumber(signupObj.state)){
            errorMsg = "* Invalid format entered for state."; //NO I18N
            signupForm.state.focus();
        } else if(signupObj.country && isNumber(signupObj.country)){
            errorMsg = "* Invalid format entered for country."; //NO I18N
            signupForm.country.focus();
        } else if(signupObj.city && isNumber(signupObj.city)){
            errorMsg = "* Invalid format entered for city."; //NO I18N
            signupForm.city.focus();
        } 
        if(errorMsg){
            errorContainer.innerHTML = errorMsg;
            errorContainer.style.display = "block";
            sendRequest = false;
        }
    }

    if(!sendRequest){
        return;
    }
    signupObj.email = signupObj.email.toLowerCase();

    var requestObj = {};
    requestObj.uri = "/createPortalUser";//No I18N
    requestObj.method = "POST";//No I18N
    requestObj.params = signupObj;
    requestObj.handler = "signupResponse";//NO I18N
    var iframe = document.getElementById("sitesIframe").contentWindow;
    iframe.postMessage(requestObj, "*");
}

signupPreConfirmation = function(){
    var errorCont = document.getElementById("signup_user_error_msg_container");
    errorCont.style.display = "none";
    var requestObj = {};
    requestObj.handler = "signupPreConfRes";//NO I18N
    var params = {};
    params.resend = "false";//NO I18N
    sendEmailConfirmation(requestObj, params);
}

signupPreConfRes = function(response){
    if(response.status == 0){
        document.getElementById("signupContinueDiv").style.display = "none";
        document.getElementById("signupDiv").style.display = "block";
        document.getElementById("changeSignupEmail").style.display = "block";
        document.getElementById("zs_signup_msg").style.display = "block";
        document.forms.portalSignUpForm.email.className = "action-field";
        document.forms.portalSignUpForm.email.value = document.forms.portalSignUpForm.email.value.trim();
        document.forms.portalSignUpForm.email.setAttribute("disabled", "true");
    } else{
        var errorCont = document.getElementById("signup_user_error_msg_container");
        errorCont.style.display = "block";
        errorCont.innerHTML = "* " + response.msg;
    }
}

fnChangeSignupEmail = function(){
    var errorCont = document.getElementById("signup_user_error_msg_container");
    errorCont.style.display = "none";
    document.getElementById("changeSignupEmail").style.display = "none";
    document.forms.portalSignUpForm.email.className = "";
    document.forms.portalSignUpForm.email.removeAttribute("disabled");
    document.getElementById("signupContinueDiv").style.display = "block";
    document.getElementById("signupDiv").style.display = "none";
    document.getElementById("zs_signup_msg").style.display = "none";
}

resendEmailConfirmation = function(){
    var requestObj = {};
    requestObj.handler = "resendEmailConfirmationRes";//NO I18N
    var params = {};
    params.resend = "true";//NO I18N
    sendEmailConfirmation(requestObj, params);
}

resendEmailConfirmationRes = function(response){
    var verElem = document.getElementById("zs_verification");
    var errorElem = verElem.getElementsByClassName("signupErrorElem")[0];
    if(response.status == 0){    
        errorElem.innerHTML = "Verification code has been sent again. Check your inbox and/or spam folder.";//NO I18N
    } else{
        errorElem.innerHTML = response.msg;
    }
    errorElem.style.display = "block";//NO I18N
}

sendEmailConfirmation = function(requestObj, params){
    var signupForm = document.forms.portalSignUpForm;
    //var params = {};
    var email_patt = new RegExp("^[a-zA-Z0-9]([\\w\\-\\.\\+\']*)@([\\w\\-\\.]*)(\\.[a-zA-Z]{2,8}(\\.[a-zA-Z]{2}){0,2})$","mig");
    if(!email_patt.test(signupForm.email.value.trim())){
        document.getElementById("signup_user_error_msg_container").innerHTML = "* Enter valid email ID.";//No I18N
        document.getElementById("signup_user_error_msg_container").style.display = "block";//No I18N
        return;
    }
    params.email = signupForm.email.value.trim().toLowerCase();
    params.domain = signupForm.domain.value;

    requestObj.params = params;
    requestObj.uri = "/checkSignupEmail";//No I18N
    requestObj.method = "POST";//No I18N
    var iframe = document.getElementById("sitesIframe").contentWindow;
    iframe.postMessage(requestObj, "*");
}

showFieldErrorMessage = function(elem){
    if(elem.type == "hidden"){
        return;
    }
    var parentElem = elem.parentNode;
    var errorElem = parentElem.querySelector("[class=signupErrorElem]");//No I18N
    errorElem.style.display = "block";
}

hideFieldErrorMessage = function(elem){
    if(elem.type == "hidden"){
        return;
    }
    var parentElem = elem.parentNode;
    var errorElem = parentElem.querySelector("[class=signupErrorElem]");//No I18N
    errorElem.style.display = "none";
}

trim = function(str) {
    str = str.replace(/^\s*(.*)/, "$1");
    str = str.replace(/(.*?)\s*$/, "$1");
    return str;
}

isNumber = function(text){
    var numberPatt = /^\d+$/;
    return numberPatt.test(text);
}
containsLetters = function(text){
    var atleastOneLetter = /[a-z]/i;
    return atleastOneLetter.test(text);
}
isPostalCode = function(text){
    var postal_code = /^[a-zA-Z0-9 -]*$/;
    var regex = /^[ -]*$/;
    if(text.length > 0 && text.match(regex)){
        return false;
    }
    return postal_code.test(text);
}
