/*
*	This library will create the menu and header functionality 
*/


/* Show or Hide the menu. 
	The reason that we are moving the menu out of the visable are instead of hiding it is because of SEO.
	Web crawlers ignore hidden elements
*/ 
const mainMenu = $(".main_menu");
$(".item84").on('click',() => {
	if(mainMenu.css('left') === "-300px"){  
		mainMenu.css('left',"0px"); //Show the menu
	}else{
		mainMenu.css('left',"-300px"); //Hide the menu
	}
});
// $(".item84").on('mouseenter',() => {
// 	mainMenu.css('left',"0px"); //Show the menu
// });
//Bind menu items
//bind home menu buttons
$("#mm .item1").on('touchstart click',() => {window.location = '/'});
//bind Program Overview menu buttons
$("#mm .item27").on('touchstart click',() => {window.location = '/program'});
//bind Pack menu nCommittee buttons
$("#mm .item58").on('touchstart click',() => {window.location = '/committee'});
//bind Leaders menu buttons
$("#mm .item59").on('touchstart click',() => {window.location = '/leaders'});
//bind Resources menu buttons
$("#mm .item66").on('touchstart click',() => {window.location = '/events'});
//bind Calendar menu buttons
$("#mm .item69").on('touchstart click',() => {window.location = 'http://www.cubscoutpack97.org/index.php?option=com_content&amp;view=category&amp;id=41&amp;Itemid=69'});
//bind Scout Camps menu buttons
$("#mm .item81").on('touchstart click',() => {window.location = 'http://www.cubscoutpack97.org/PDF/2017_2018_Den_Room_Assignments.pdf'});
//bind Resources menu buttons
$("#mm .item48").on('touchstart click',() => {window.location = 'http://www.cubscoutpack97.org/index.php?option=com_weblinks&amp;view=categories&amp;Itemid=48'});
//bind Den Meeting Times menu buttons
$("#mm .item82").on('touchstart click',() => {window.location = 'https://www.scouttrack.com/ScoutTrack'});
//bind Scout Hike Totals menu buttons
$("#mm .item83").on('touchstart click',() => {window.location = 'http://www.cubscoutpack97.org/hike/hike_home.php'});
//bind Multimedia Gallery menu buttons
$("#mm .item86").on('touchstart click',() => {window.location = 'http://www.cubscoutpack97.org/index.php?option=com_content&amp;view=article&amp;id=140&amp;Itemid=86'});
	
$("#mm .item87").on('touchstart click',() => {window.location = '/events/admin/list/event_date/1'});

$("#mm .item88").on('touchstart click',() => {window.location = '/events/admin/list/event_date/1'});

$("#mm .item89").on('touchstart click',() => {window.location = '/contacts/admin'});
// function addCarousel() {
// //Create a carousel that rotates a new panel ever 5secs\
//   $('.carousel').slick({
//     dots:true,
//     arrows:false,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 10000,
//   });
// }

let iScrollPos = 0;

$(window).scroll(function () {
    var iCurScrollPos = $(this).scrollTop();
    if (iCurScrollPos > iScrollPos) {
        $('.imgHeader').css('top','-170px');
    } else {
       $('.imgHeader').css('top','-3px');
    }
    iScrollPos = iCurScrollPos;
});
