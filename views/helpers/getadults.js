var _ = require('lodash'),getadults;

getadults  = function(attendees, context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    for(var i = 0; i < attendees.length; i ++){
        const attendee = JSON.parse(attendees[i]);
    	if(attendee.type.toLowerCase() === "adult"){
            context.data.adult = {"first_name":attendee.first_name,"last_name":attendee.last_name,"detail":attendee.detail};
            context.data.index = i;
            accum += context.fn(this);
        }
    }
    return accum;
}

module.exports = getadults;