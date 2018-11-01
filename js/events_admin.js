$("#isUser").change(function(){
	$("#isUserChanged").prop('checked','true');
	if(this.checked){
		$(".edit_scope").show();
	}else{
		$(".edit_scope").hide();
	}
});

$("#password").on("keyup",function(){
	comparePass($(this),$("#password_verify"));
});

$("#password_verify").on("keyup",function(){
	comparePass($(this),$("#password"));
});

$("#email").on("keyup",function(){
	comparePass($("#password_verify"),$("#password"));
});

function comparePass(pass, vari){
	if(pass.val() !== "" && vari.val() !== ""){
		if(pass.val() !== vari.val()){
			$(pass).css('border-color','#f00');
			$(vari).css('border-color','#f00');
			$("#new_pass_sub").prop("disabled",true);
			$("#nonmatch").show();
		}else if(pass.val() === vari.val() && $("#email").val() !== ""){
			$(pass).css('border-color','initial');
			$(vari).css('border-color','initial');
			$("#new_pass_sub").prop("disabled",false);
			$("#nonmatch").hide();
		}else if($("#email").val() === ""){
			$(pass).css('border-color','initial');
			$(vari).css('border-color','initial');
			$("#new_pass_sub").prop("disabled",true);
			$("#nonmatch").hide();
		}
	}
}