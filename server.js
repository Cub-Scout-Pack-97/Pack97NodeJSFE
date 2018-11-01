'use strict';

const Hapi = require('hapi');
const Wreck = require('wreck');

const server = new Hapi.Server({
	port: 3003, 
	host: '0.0.0.0'
});

let uuid = 1;

function locationHREF(location){
	let address = location.replace(/ /g,"+");
	address = address.replace(/,/g,"%2C");
	return'href',"https://www.google.com/maps/embed/?api=1&query=" + address;
}
function tildaToSlash(str){
	return str.replace(/~/g,'/');
}
function onToBoolen(value){
	if(value === 'on'){
		return true;
	}else{
		return false;
	}
}

async function startVision() {
	await server.register({
		plugin: require('vision')
	});
	server.views({
        engines: {
            html: require('handlebars')
        },
        path: './views',
	    layoutPath: './views/layout',
	    partialsPath: './views/partials',
	    helpersPath: './views/helpers',
	    layout: 'default'
    });
}

async function startInsert(){
	await server.register({
		plugin: require('inert')
	});
}

async function startAuth(){
	await server.register({
		plugin: require('hapi-auth-cookie')
	});
}



const init = async () => {
	await startAuth();

	const cache = server.cache({ segment: 'sessions', expiresIn: 2 * 60000 });
    server.app.cache = cache;

	server.auth.strategy('session', 'cookie', {
	        password: 'CnBEYC2EWb9WffbEofjG6Js0aIJZN1hO',
	        cookie: 'scout_code',
	     	keepAlive: true,
	     	ttl: 90 * 60000, //30 minutes
	        isSecure: false,
	        clearInvalid: true,
	        validateFunc: async (request, session) => {

	            const cached = await cache.get(session.sid);
	            const out = {
	                valid: !!cached
	            };

	            if (out.valid) {
	                out.credentials = cached.account;
	            }

	            return out;
	        }
	    });
	
	
	server.route([
			{
				/** Functions -----------------------------------------*/
				method:'GET',
				path:'/images/{images}',
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler:(request,h)=>{
						return h.file(`./images/${request.params.images}`);
					}
				}
			},
			{
				method:'GET',
				path:'/images/events/{images}',
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler:(request,h)=>{
						return h.file(`./images/events/${request.params.images}`);
					}
				}
			},
			{
				method:'GET',
				path:'/css/{css}',
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler:(request,h)=>{
						return h.file(`./css/${request.params.css}`);
					}
				}
			},
			{
				method:'GET',
				path:'/slick/{slick}',
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler:(request,h)=>{
						return h.file(`./slick/${request.params.slick}`);
					}
				}
			},
			{
				method:'GET',
				path:'/slick/fonts/{slick}',
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler:(request,h)=>{
						return h.file(`./slick/fonts/${request.params.slick}`);
					}
				}
			},
			{
				method:'GET',
				path:'/js/{js}',
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler:(request,h)=>{
						return h.file(`./js/${request.params.js}`);
					}
				}
			},
			{
				/** Home Route --------------------------*/
				method:"GET",
				path:"/",
				config: {
					auth: {
						mode:'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/event/list/event_date/1');
						const events = JSON.parse(payload);
						const data = {};
						if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
							const credentials = request.auth.credentials.scope;
							credentials.forEach((cred) => {
								data[cred + "_admin"] = cred;
							}); 
						}
					    data["redirect"] = "~";
						data["events"] = events;
						return h.view('homepage',data);
					}
				}
			},
			{
				/** Program page route --------------------*/
				method:"GET",
				path:"/program",
				config: {
					auth: {
						mode:'try',
      					strategy: 'session'
					},
					handler: (request,h) => {
						const data = {};
						if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
							const credentials = request.auth.credentials.scope;
							credentials.forEach((cred) => {
								data[cred + "_admin"] = cred;
							}); 
						}
						data["redirect"] = "~program";
						return h.view('program',data);
					}
				}
			},
			{
				/** Leader Page Routes --------------------*/
				method:"GET",
				path:"/leaders",
				config: {
					auth: {
						mode:'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						let data;
						try{	
							const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/leader/list');
							const leader = JSON.parse(payload);
							data = {
								"leaders":leader,
								"page_title":"Leaders"
							};
							if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
								const credentials = request.auth.credentials.scope;
								credentials.forEach((cred) => {
									data[cred + "_admin"] = cred;
								}); 
							}
							data["redirect"] = "~leaders";
						}catch(err){
							console.log("failed" + err);
						}
						return h.view('leaders',data);
					}
				}
			},
			{
				/** Comittee Page Routes ------------------*/
				method:"GET",
				path:"/committee",
				config: {
					auth: {
						mode:'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						let data;
						try{	
							const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/committee/list');
							const committee = JSON.parse(payload);
							data = {
								"leaders":committee,
								"page_title":"Committee"
							};
							if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
								const credentials = request.auth.credentials.scope;
								credentials.forEach((cred) => {
									data[cred + "_admin"] = cred;
								}); 
							}
							data["redirect"] = "~committee";
						}catch(err){
							console.log("failed" + err);
						}
						return h.view('leaders',data);
					}	
				}
			},
			{
				/** Events page Routes -------------------*/
				method:"GET",
				path:"/events",
				config: {
					auth: {
						mode:'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						let data;
						try{	
							const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/event/list/event_date/1');
							const events = JSON.parse(payload);
							for(var i=0;i < events.length;i++){
								if(events[i].location !== undefined){
									events[i].location = locationHREF(events[i].location);
								}
							};
							data = {
								"events":events
							};
							if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
								const credentials = request.auth.credentials.scope;
								credentials.forEach((cred) => {
									data[cred + "_admin"] = cred;
								}); 
							}
							data["redirect"] = "~events";
						}catch(err){
							console.log("failed" + err);
						}
						
						return h.view('events_home',data);
					}
				}
			},
			{
				/** */
				method:'GET',
				path:'/events/register/{event_id}',
				config: {
					auth: {
						mode:'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/event/${request.params.event_id}`);
						const event = JSON.parse(payload);
						let costs = {};
						costs['scout'] = event.cost_scout.$numberDecimal;
						costs['leader'] = event.cost_leader.$numberDecimal;
						costs['adult'] = event.cost_adult.$numberDecimal;
						costs['other'] = event.cost_other.$numberDecimal;
						costs['min'] = event.child_age_min;
						costs['max'] = event.child_age_max;
						costs['other2'] = event.cost_other2.$numberDecimal;
						costs['min2'] = event.child_age_min2;
						costs['max2'] = event.child_age_max2;
						const data = {
							"path":`/events/registration`,
							"method":"POST",
							"event_id":request.params.event_id,
							"payment":JSON.stringify(event.payment),
							"costs":JSON.stringify(costs)
						};
						if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
							const credentials = request.auth.credentials.scope;
							credentials.forEach((cred) => {
								data[cred + "_admin"] = cred;
							}); 
						}
						data["redirect"] = `~events~register~${request.params.event_id}`;
						return h.view(`events_reg`,data);
					}
				}
			},
			{
				method:'POST',
				path:'/events/registration',
				config: {
					auth: {
						mode:'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						try{
							const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/contact/email/${request.payload.contact_email}`);
							const contact = JSON.parse(payload);
							let data = {};
							contact[0].family['costs'] = request.payload.costs;
							if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
								const credentials = request.auth.credentials.scope;
								credentials.forEach((cred) => {
									data[cred + "_admin"] = cred;
								}); 
							}
							data['email'] = request.payload.contact_email;
							data['event_id'] = request.payload.event_id;
							data['contact'] = contact;
							data['path'] = "/events/register/attendee";
							data['method'] = "POST";
							data['payment'] = request.payload.payment;
							data["redirect"] = "~events~registration";
							return h.view(`events_reg`,data);
						}catch(err){
							console.log("failed" + err);
						}
					}
				}
			},
			{
				method:'POST',
				path:'/events/register/attendee',
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/event/add/attendees', { payload: request.payload }, (err, res, payload) => {
						    console.log(`Error ${err}`)
						});
						return h.redirect('/events');
						
					}
				}
			},
			{
				method:'POST',
				path:'/event/save',
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						let payload = request.payload;
						payload.enabled = onToBoolean(request.payload.enabled);
						payload.visible = onToBoolean(request.payload.visible);
						payload.lead_notify = onToBoolean(request.payload.lead_notify);
						payload.backpacking = onToBoolean(request.payload.backpacking);
						payload.tshirt = onToBoolean(request.payload.tshirt);
						
						const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/event/new', { payload: request.payload }, (err, res, payload) => {
						    console.log(`Error ${err}`)
						});
						return h.redirect('/events/admin/list/event_date/1');
					}
				}
			},
			{
				method: 'POST',
				path: '/events/add/family',
				config: {
					auth: {
						mode:'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						const attendee = {"_id":request.payload._id};

						let family = {
							"type":request.payload.type,
							"first_name":request.payload.attendee_first_name,
							"last_name":request.payload.attendee_last_name,
							"detail":request.payload.detail
						}
						if(request.payload.type === 'scout'){
							const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/scout/name/${request.payload.attendee_first_name}/${request.payload.attendee_last_name}`);
							const scout = JSON.parse(payload);
							if(scout.length > 0){	
								family["scout_id"] = scout[0]._id;
								family["den"] = scout[0].den;
								family["rank"] = scout[0].rank;
							}else{
								request.payload.error = `We were unable to find ${request.payload.attendee_first_name} ${request.payload.attendee_last_name} as scout in our system. If this continues please notify the <a href="mailto://webmaster@cunscoutpack97.org">Webmaster</a>`
								request.payload.path = "/events/registration";
								request.payload.method= "POST";
								const data = request.payload
								data['admin'] = request.auth.isAuthenticated;
								data["redirect"] = "~events~add~family";
								return h.view("events_reg",data);
							}
						}
						attendee["family"] = family;
						const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/contact/add/family', { payload: attendee }, (err, res, payload) => {
						    console.log(`Error ${err}`)
						});
						return h.redirect(`/events/register/${request.payload.event_id}`);
					}
				}
			},
			{
				method:'GET',
				path:'/events/admin/list/{field}/{direction}',
				config: {
					auth: {
      					strategy: 'session',
      					scope: "events"
					},
					handler: async (request,h) => {
						
						let data = {};
						if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
							const credentials = request.auth.credentials.scope;
							credentials.forEach((cred) => {
								data[cred + "_admin"] = cred;
							}); 
						}
						const field = request.params.field;
						const direction = request.params.direction;
						const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/event/list/${field}/${direction}`);
						data["events"] = JSON.parse(payload);
						data["redirect"] = `~events~admin~list~${field}~${direction}`;
						return h.view('events_admin_list',data);
					}
				}
			},
			{
				method:'GET',
				path:'/events/admin/event',
				config: {
					auth: {
      					strategy: 'session',
      					scope: "events"
					},
					handler: async(request,h) =>{
						if (!request.auth.isAuthenticated) {
					        return h.redirect('/login');
					    }
						const data = {"path":"/event/save"};
						if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
							const credentials = request.auth.credentials.scope;
							credentials.forEach((cred) => {
								data[cred + "_admin"] = cred;
							}); 
						}
						data["redirect"] = "~events~admin~event";
						return h.view('eventbuild',data);
					}
				}
			},
			{
				method:'GET',
				path:'/events/admin/event/{id}',
				config: {
					auth: {
      					strategy: 'session',
      					scope: "events"
					},
					handler: async(request,h) =>{
						if (!request.auth.isAuthenticated) {
					        return h.redirect('/login');
					    }
						const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/event/${request.params.id}`);
						const data = JSON.parse(payload);
						data["path"] = "/event/update";
						if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
							const credentials = request.auth.credentials.scope;
							credentials.forEach((cred) => {
								data[cred + "_admin"] = cred;
							}); 
						}
						data["redirect"] = `~events~admin~event~${request.params.id}`;
						return h.view('eventbuild',data);
					}
				}
			},
			{
				method:'POST',
				path:'/event/update',
				config: {
					auth: {
      					strategy: 'session',
      					scope: "events"
					},
					handler: async(request,h) => {
						let payload = request.payload;
						payload.enabled = onToBoolean(request.payload.enabled);
						payload.visible = onToBoolean(request.payload.visible);
						payload.lead_notify = onToBoolean(request.payload.lead_notify);
						payload.backpacking = onToBoolean(request.payload.backpacking);
						payload.tshirt = onToBoolean(request.payload.tshirt);
						const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/event/update', { payload: payload }, (err, res, payload) => {
						    console.log(`Error ${err}`)
						});
						return h.redirect('/events/admin/list/event_date/1');
					}
				}
			},
			{
				method:"GET",
				path:"/login",
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler:(request,h) => {
						const data = {};
						if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
							const credentials = request.auth.credentials.scope;
							credentials.forEach((cred) => {
								data[cred + "_admin"] = cred;
							}); 
						}
						return h.view('login',data);
					}
				}
			},
			{
				method:"POST",
				path:"/login",
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						if (!request.auth.isAuthenticated) {
					        request.cookieAuth.clear()
					    }
					    
						let data = {};
						data["email"] = request.payload.username;
						data["password"] = request.payload.password;

						const {res,payload} = await Wreck.post('http://10.5.0.7:4477/api/pack97/user/validation',{payload: data}, (err, res, payload) => {
						    console.log(`Error ${err}`)
						});
						const response = JSON.parse(payload);
						if (response.response === 'success'){
							const sid = String(++uuid);
							await request.server.app.cache.set(sid, { response }, 0);
							request.cookieAuth.set({ sid });
							request.cookieAuth.set("scope",response.scope);
							let redirect = request.payload.redirect;
							if(redirect === undefined || redirect === null || redirect === ""){
								redirect = "/";
							}
							return h.redirect(tildaToSlash(redirect));

						}else{
							return h.view('login',response);
						}
					}
				}
			},
			{
				method:"GET",
				path:"/logout",
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler: async (request,h) =>{
						request.cookieAuth.clear()
						return h.redirect('/login');
					}
				}
			},
			{
				method:"GET",
				path:"/forgotpassword",
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler: (request,h) => {
						return h.view('forgotpassword');
					}
				}
			},
			{
				method:"POST",
				path:"/forgotpassword",
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/contact/email/${request.payload.username}`);
						const data = JSON.parse(payload);
						if(data.length > 0){
							const payload = {
								"to": data[0].email,
								"scope": data[0].scope,
								"_id": data[0]._id
							};
							const wreck = await Wreck.post('http://10.5.0.9:7777/campaign/passreset', { payload: payload }, (err, res, payload) => {
							    console.log(`Error ${err}`)
							});
							data["response"] = "An email has been sent with instructions on resetting your password";
						}else{
							data["response"] = "Sorry, we don't have your email as a username";
						}
						return h.view('forgotpassword',data);
					}
				}
			},
			{
				method:"GET",
				path:"/contacts/admin",
				config: {
					auth: {
						mode:'try',
      					strategy: 'session',
      					// scope: "contacts"
					},
					handler: async (request,h) => {
						const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/contact/list`);
						const data = {};
						if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
							const credentials = request.auth.credentials.scope;
							credentials.forEach((cred) => {
								data[cred + "_admin"] = cred;
							}); 
						}
						data['contacts'] = JSON.parse(payload);
						return h.view('contact_management',data);
					}
				}
			},
			{
				method:"GET",
				path:"/contacts/admin/edit",
				config: {
					auth: {
						mode:'try',
      					strategy: 'session',
      					// scope: "contacts"
					},
					handler: async (request,h) => {
						let data = {};
						if(request.query.id !== undefined){
							const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/contact/id/${request.query.id}`);
							if(request.auth.credentials !== null && request.auth.credentials.scope.length > 0){
								const credentials = request.auth.credentials.scope;
								credentials.forEach((cred) => {
									data[cred + "_admin"] = cred;
								}); 
							}
							data['contact'] = JSON.parse(payload);
						}else{
							data = {
								"contact":{
									"scope":[]
								}
							}
						}
						return h.view('contact_edit',data);
					}
				}
			},
			{
				method:"POST",
				path:"/contact/admin/update",
				config: {
					auth: {
						mode:'try',
      					strategy: 'session',
      					// scope: "contacts"
					},
					handler: async (request,h) => {
						let data = request.payload;
						let scope = [];
						data.isCommitee = onToBoolen(data.isCommitee);
						data.isLeader = onToBoolen(data.isLeader);
						data.isUser = onToBoolen(data.isUser);
						if (data.events_admin === 'on'){
							scope.push('events');
						}
						if (data.hikes_admin === 'on'){
							scope.push('hikes');
						}
						if (data.contacts_admin === 'on'){
							scope.push('contacts');
						}
						data.events_admin = undefined;
						data.hikes_admin = undefined;
						data.contacts_admin = undefined;
						data.scope = scope;

						let update = '/update';
						if(data._id.length < 1){
							update = '';
						}

						const {res,payload} = await Wreck.post(`http://10.5.0.7:4477/api/pack97/contact${update}`,{payload: data}, (err, res, payload) => {
						    console.log(`Error ${err}`)
						});

						if(data.isUser && onToBoolen(data.isUserChanged)){
							const payload = {
								"to": data.email,
								"scope": scope,
								"_id": data._id
							};
							const wreck = await Wreck.post('http://10.5.0.9:7777/campaign/newuser', { payload: payload }, (err, res, payload) => {
							    console.log(`Error ${err}`)
							});
						}
						
						
						return h.redirect('/contacts/admin');
					}
				}
			},
			{
				method:"GET",
				path: "/contact/admin/newpassword/{_id}",
				config: {
					auth: {
						mode:'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						const data = {"_id":request.params._id};
						return h.view("change_pass",data);
					}
				}
			},
			{
				method:"POST",
				path:"/contact/admin/newpass",
				config: {
					auth: {
						mode:'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						const data = {
							'_id' :request.payload._id,
							'email': request.payload.email,
							'password': request.payload.password
						}
						const {res,payload} = await Wreck.post('http://10.5.0.7:4477/api/pack97/password/new',{payload: data}, (err, res, payload) => {
						    console.log(`Error ${err}`)
						});
						console.log(JSON.parse(payload));
						return h.redirect("/login");
					}
				}
			}
		]);
	try {  
		await startVision();
		await startInsert();

	  	await server.start();
	   	console.log(`${new Date()} Server running at: ${server.info.uri}/`);
	}
	catch (err) {  
	  console.log(err);
	}
}
init();
