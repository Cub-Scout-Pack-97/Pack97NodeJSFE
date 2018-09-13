var _ = require('lodash'),getothers;

getothers  = function(attendees, context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    for(var i = 0; i < attendees.length; i ++){
        const attendee = JSON.parse(attendees[i].replace(/'/g, '"'));
    	if(attendee.type.toLowerCase() === "other"){
            context.data.other = {"name":attendee.name,"detail":attendee.detail};
            context.data.index = i;
            accum += context.fn(this);
        }
    }
    return accum;
}

module.exports = getothers;