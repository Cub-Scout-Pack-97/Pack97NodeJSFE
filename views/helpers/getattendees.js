var _ = require('lodash'),getattendees;

getattendees  = function(family, context){
	if(_.isEmpty(context) || family === undefined || family.length < 1){
		return 0;
	}
	var accum = '';
    const costs = JSON.parse(family.costs);
    for(var i = 0; i < family.length; i ++){
            let fam = family[i];
            console.log(fam);
            let price = 0;
            if(fam.type === "scout"){
                price = costs.scout;
            }else if(fam.type === "leader"){
                price = costs.leader;
            }else if(fam.type === "adult"){
                price = costs.adult;
            }else if(fam.type === "other"){
                fam.type = "Child";
                price = costs.other;
            }
            fam.price = price;
            context.data.attendee = family[i];
            context.data.attendee.family = JSON.stringify(fam);
            context.data.index = i;
            accum += context.fn(this);
        
    }
    return accum;
}
module.exports = getattendees;