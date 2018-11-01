var _ = require('lodash'),enableScopes;

enableScopes  = function(scope, context){
	if(_.isEmpty(context)){
		return 0;
	}
	var accum = '';
    context.data.events = false;
    context.data.hikes = false;
    context.data.contacts = false;
    scope.forEach((page) => {
        if(page === "events"){
            context.data.events = true;
        }
        if(page === "hikes"){
            context.data.hikes = true;
        }
        if(page === "contacts"){
            context.data.contacts = true;
        }
    });
    accum += context.fn(this);
    return accum;
}

module.exports = enableScopes;