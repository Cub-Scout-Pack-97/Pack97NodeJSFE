var _ = require('lodash'),getattendees;

getattendees  = function(family, context){
	if(_.isEmpty(context) || family === undefined || family.length < 1){
		return 0;
	}
	var accum = '';
    for(var i = 0; i < family.length; i ++){
    	
            context.data.attendee = family[i];
            context.data.index = i;
            accum += context.fn(this);
        
    }
    return accum;
}

module.exports = getattendees;