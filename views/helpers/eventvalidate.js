var _ = require('lodash'),eventvalidate;

eventvalidate  = function(enabled, date, context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    const eventdate = new Date(date);
    const today = new Date(); 
    let isValid = false; 
    if(enabled && eventdate.getTime() >== today.getTime()){
        isValid = true;
    }

    context.data.valid = isValid;
    accum = context;//.fn(this);
    return accum;
}

module.exports = eventvalidate;