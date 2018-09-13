var _ = require('lodash'),lastname;

lastname  = function(name, context){
	if(_.isEmpty(context) || name === undefined || name.length < 1){
		return 0;
	}
	var accum = '';
    if(name.toLowerCase().substring(0,2) === "mc"){
        context.data.last_name =  name.substring(0,3);
    }else if(name.toLowerCase().substring(0,3) === "mac"){
        context.data.last_name =  name.substring(0,4);
    }else{
        context.data.last_name =  name.substring(0,1);
    }
    accum += context.fn(this);
    return accum;
}

module.exports = lastname;