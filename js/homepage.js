
$('.banner_conntainer').on('click',function(){
	window.location.replace(`/events#${$(this).find('#id').val()}`);
});
//Create a carousel that rotates a new panel ever 5secs\
$('.carousel').slick({
	dots:true,
	arrows:false,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 15000,
});