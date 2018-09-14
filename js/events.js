$('#showNewAttendee').on('click', () => {
	$('.modal').show();
});

$(".close").on('click',() => {
	$("#newAttendee").hide();
});
$(window).on('click',(event) => {
	if(event.target == $('#newAttendee')){
		$("#newAttendee").hide();
	}
});