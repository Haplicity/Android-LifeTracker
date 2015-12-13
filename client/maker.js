"use strict";

$(document).ready(function() {

	//displays error message to user
    function handleError(message) {
        $("#errorMessage").text(message);
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
                $("#errorMessage").animate({length:'hide'}, 350);

                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
            
                handleError(messageObj.error);
            }
        });        
    }
    
	//sends createRoom form data to server
    $("#makeRoomSubmit").on("click", function(e) {
        e.preventDefault();
    
        $("#errorMessage").animate({length:'hide'}, 350);
    
        if($("#roomName").val() == '') {
            handleError("All fields are required");
            return false;
        }

        sendAjax($("#roomForm").attr("action"), $("#roomForm").serialize());
        
        return false;
    });
	
	//sends joinRoom form data to server
	$(".joinRoomSubmit").on("click", function(e) {
		e.preventDefault();
		
		$("#errorMessage").animate({length:'hide'}, 350);
		
		sendAjax(this.parentNode.action, $(this.parentNode).serialize());
		
		return false;
	});
	
	//sends leaveRoom form data to server
	$(".leaveRoomSubmit").on("click", function(e) {
		e.preventDefault();
		
		$("#errorMessage").animate({length:'hide'}, 350);
		
		sendAjax(this.parentNode.action, $(this.parentNode).serialize());
		
		return false;
	});
    
});