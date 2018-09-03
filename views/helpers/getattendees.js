var _ = require('lodash'),getattendees;

getattendees  = function(family, context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    for(var i = 0; i < family.length; i ++){
        const attendee = JSON.parse(family[i].replace(/'/g, '"'));
    	
            context.data.attendee = {"type":attendee.type,"name":attendee.name,"detail":attendee.detail,"_id":attendee._id};
            context.data.index = i;
            accum += context.fn(this);
        
    }
    return accum;
}

module.exports = getattendees;