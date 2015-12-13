"use strict";

$(document).ready(function() {

	//displays error messages to user
    function handleError(message) {
        $("#errorMessage").text(message);
        $("#error").animate({height:'toggle'},350);
    }
    
	//sends Ajax data to server
    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                $("#error").animate({height:'hide'},350);

                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
            
                handleError(messageObj.error);
            }
        });        
    }
    
	//sends signup form data to server
    $("#signupSubmit").on("click", function(e) {
        e.preventDefault();
    
        $("#error").animate({height:'hide'},350);
    
        if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("All fields are required");
            return false;
        }
        
        if($("#pass").val() !== $("#pass2").val()) {
            handleError("Passwords do not match");
            return false;           
        }

        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());
        
        return false;
    });

	//sends login form data to server
    $("#loginSubmit").on("click", function(e) {
        e.preventDefault();
    
        $("#error").animate({height:'hide'},350);
    
        if($("#user").val() == '' || $("#pass").val() == '') {
            handleError("Username or password is empty");
            return false;
        }
    
        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        return false;
    });
});