"use strict";

$(document).ready(function() {

    function handleError(message) {
        $("#errorMessage").text(message);
    }
    
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
	
	$(".joinRoomSubmit").on("click", function(e) {
		e.preventDefault();
		
		$("#errorMessage").animate({length:'hide'}, 350);
		
		//console.dir(this);
		sendAjax(this.parentNode.action, $(this.parentNode).serialize());
		
		return false;
	});
	
	$(".leaveRoomSubmit").on("click", function(e) {
		e.preventDefault();
		
		$("#errorMessage").animate({length:'hide'}, 350);
		
		//console.dir(this);
		sendAjax(this.parentNode.action, $(this.parentNode).serialize());
		
		return false;
	});
    
});