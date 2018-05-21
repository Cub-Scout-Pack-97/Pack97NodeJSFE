var _ = require('lodash'),getscouts;

getscouts  = function(attendees, context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    for(var i = 0; i < attendees.length; i ++){
        
    	if(attendees[i].type === "scout"){
            context.data.scout = {"name":attendees[i].name,"detail":attendees[i].detail};
            context.data.index = i;
            accum += context.fn(this);
        }
    }
    return accum;
}

module.exports = getscouts;