var _ = require('lodash'),titlecase;

titlecase  = function(str, context){
	if(_.isEmpty(context)){
		return "";
	}
	var accum = '';
    let text = str.toLowerCase();
    const stringArray = text.split(' ');
    stringArray.forEach((text) => {

        let textArray = text.split("");
        let propercaseStr = '';
        const first = textArray[0].toUpperCase();
        textArray[0] = first;
        textArray.forEach((value) =>{
            propercaseStr += value;
        });

        accum += propercaseStr + " ";
    });

    return accum.trim();
}

module.exports = titlecase;