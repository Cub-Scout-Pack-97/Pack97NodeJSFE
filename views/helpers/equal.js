var _ = require('lodash'),equal;

equal  = function(x, y, text, context){
	if(_.isEmpty(context)){
		return "";
	}
	var accum = false;//context.fn(this);
    console.log("\n\n\n"+ text +"\n" + x);
    console.log(y + "\n\n\n\n");
    if(x === y){
        accum = text;
    }
    // for(var i = 0; i < family.length; i ++){
    //     const attendee = JSON.parse(family[i].replace(/'/g, '"'));
    	
    //         context.data.attendee = {"type":attendee.type,"name":attendee.name,"detail":attendee.detail,"_id":attendee._id};
    //         context.data.index = i;
    //         accum += context.fn(this);
        
    // }
    return accum;
}

module.exports = equal;