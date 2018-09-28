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
$('.card_container').on('click',function(event){
	console.log(event.target == $('.payment'));
	if(event.target != $('img') || event.target != $('a')){
		$(this).find('.participants').toggle();
	}
});
$('.attendees').on('click',function(attendee){
	$('#total_container').show();
	let total;
	if($('#total').html() !== ""){
		total = parseFloat($('#total').html());
	}else{
		total = 0.00;
	}
	let cost = parseFloat($(this).siblings('label').find('.cost').html());
	if($(this).prop("checked")){
		$('#total').html((total + cost).toFixed(2));
	}else{
		$('#total').html((total - cost).toFixed(2));
	}
});
$('#att_type').on('change',function(type){
	const selected = $("select option:selected").val();
	if(selected === "other"){
		$('.birthdate').css('display','block');
	}else{
		$('.birthdate').hide();
	}
});
$('#second_child_range').on('click',()=>{
	$('#other_child_range').toggle();
})
function showhide(id){
	$(id).toggle();
};
$("#event_image").slick({
	dots:true,
    arrows:true,
    slidesToShow: 1,
    slidesToScroll: 1
});
$('#events_home').slick({
  dots: true,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  centerMode: true,
  variableWidth: true
});
$("#event_image").on('click',function(image){
	$('#select_image').val($('.slick-current').find('img').attr('src'));
});
