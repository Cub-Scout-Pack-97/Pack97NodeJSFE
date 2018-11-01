var _ = require('lodash'),geteventimages;
const folder = "./images/events/";
const fs = require('fs');

geteventimages  = function(context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    fs.readdirSync(folder).forEach(file => {
        context.data.path = "/images/events/" + file;
       accum += context.fn(this); 
    });
    return accum;
}

module.exports = geteventimages;