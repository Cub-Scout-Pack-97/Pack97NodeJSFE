$('.contact').on('click',(contact)=>{
	$(contact.currentTarget).find('.contact_details').toggle();
});