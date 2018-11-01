var _ = require('lodash'),getscouts;

getscouts  = function(attendees, context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    for(var i = 0; i < attendees.length; i ++){
       // console.log(attendees[i].type);
        const attendee = JSON.parse(attendees[i]);
    	if(attendee.type.toLowerCase() === "scout"){
            context.data.scout = {"first_name":attendee.first_name,"last_name":attendee.last_name,"detail":attendee.detail};
            context.data.index = i;
            accum += context.fn(this);
        }
    }
    return accum;
}

module.exports = getscouts;