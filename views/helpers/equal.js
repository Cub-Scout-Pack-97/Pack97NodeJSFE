var _ = require('lodash'),equal;

equal  = function(x, y, text, context){
	if(_.isEmpty(context)){
		return "";
	}
	var accum = '';
    if(x === y){
        accum.data.title = text;
    }
    accum += context.fn(this);
    return accum;
}

module.exports = equal;