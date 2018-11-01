var _ = require('lodash'),formatdate;

formatdate  = function(date, context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
    context.data.formatteddate = `${month}-${day}-${year}`;
    accum = context.fn(this);
    return accum;
}

module.exports = formatdate;