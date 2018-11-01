var _ = require('lodash'),eventmetrics;

eventmetrics  = function(participants, context){
	if(_.isEmpty(context)){
		return "";
	}
	let accum = '';
	context.data.scouts = 0;
	context.data.leaders = 0;
	context.data.adults = 0;
	context.data.other = 0;
	context.data.males = 0;
	context.data.females = 0;

    participants.forEach((participant) => {
    	participant.attendees.forEach((attendee)=>{
    		att = JSON.parse(attendee);
	    	switch(att.type) {
	    		case "scout":
	    			context.data.scouts += 1;
	    			break;
				case "leader":
					context.data.leaders += 1;
					break;
				case "adult":
					context.data.adults += 1;
					break;
				case "other":
					context.data.other += 1;
					break;
	    	}
	    	switch(att.detail){
	    		case "male":
	    			context.data.males += 1;
	    			break;
				case "female":
					context.data.females += 1;
					break;
	    	}
    	});
    });
    accum += context.fn(this);
    
    return accum;
}

module.exports = eventmetrics;