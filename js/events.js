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
$("#sortdate").on('click',() => {
	const URLarray = window.location.href.split('/');
	const direction = URLarray[URLarray.length -1];
	const by = URLarray[URLarray.length -2];
	if(by === "event_date" && direction === "1"){
		window.location.replace("/events/admin/list/event_date/-1");
	}else{
		window.location.replace("/events/admin/list/event_date/1");
	}
});
$("#sortname").on('click',() => {
	const URLarray = window.location.href.split('/');
	const direction = URLarray[URLarray.length -1];
	const by = URLarray[URLarray.length -2];
	if(by === "event_name" && direction === "1"){
		window.location.replace("/events/admin/list/event_name/-1");
	}else{
		window.location.replace("/events/admin/list/event_name/1");
	}
});
$('#location').blur(function(){
	let address = this.value.replace(/ /g,"+");
	address = address.replace(/,/g,"%2C");
	console.log(address);
	$('#goog_maps').attr('href',"https://www.google.com/maps/embed/?api=1&query=" + address);
});

function showhide(id){
	$(id).toggle();
};