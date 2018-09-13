var _ = require('lodash'),getleaders;

getleaders  = function(attendees, context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    for(var i = 0; i < attendees.length; i ++){
        const attendee = JSON.parse(attendees[i].replace(/'/g, '"'));
    	if(attendee.type.toLowerCase() === "leader"){
            context.data.leader = {"name":attendee.name,"detail":attendee.detail};
            context.data.index = i;
            accum += context.fn(this);
        }
    }
    return accum;
}

module.exports = getleaders;