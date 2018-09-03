var _ = require('lodash'),getscouts;

getscouts  = function(attendees, context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    for(var i = 0; i < attendees.length; i ++){
        const attendee = JSON.parse(attendees[i].replace(/'/g, '"'));
    	if(attendee.type === "scout"){
            context.data.scout = {"name":attendee.name,"detail":attendee.detail};
            context.data.index = i;
            accum += context.fn(this);
        }
    }
    return accum;
}

module.exports = getscouts;