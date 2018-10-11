'use strict';

const Hapi = require('hapi');
//const HapiAuthCookie = require('hapi-auth-cookie');
const Wreck = require('wreck');
const server = new Hapi.Server({
	port: 3003, 
	host: '0.0.0.0'
});

let uuid = 1;

function checkToBoolean(checkbox){
	let bool = false;
	if (checkbox === 'on'){
		bool = true;
	}
	return bool;
}
function locationHREF(location){
	let address = location.replace(/ /g,"+");
	address = address.replace(/,/g,"%2C");
	return'href',"https://www.google.com/maps/embed/?api=1&query=" + address;
}
function tildaToSlash(str){
	return str.replace(/~/g,'/');
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
	     	ttl: 30 * 60000, //30 minutes
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
	//server.auth.default('session');
	
	server.route([
			{
				/** Functions -----------------------------------------*/
				method:'GET',
				path:'/images/{images}',
				handler:(request,h)=>{
					return h.file(`./images/${request.params.images}`);
				}
			},
			{
				method:'GET',
				path:'/images/events/{images}',
				handler:(request,h)=>{
					return h.file(`./images/events/${request.params.images}`);
				}
			},
			{
				method:'GET',
				path:'/css/{css}',
				handler:(request,h)=>{
					return h.file(`./css/${request.params.css}`);
				}
			},
			{
				method:'GET',
				path:'/slick/{slick}',
				handler:(request,h)=>{
					return h.file(`./slick/${request.params.slick}`);
				}
			},
			{
				method:'GET',
				path:'/slick/fonts/{slick}',
				handler:(request,h)=>{
					return h.file(`./slick/fonts/${request.params.slick}`);
				}
			},
			{
				method:'GET',
				path:'/js/{js}',
				handler:(request,h)=>{
					return h.file(`./js/${request.params.js}`);
				}
			},
			{
				/** Home Route --------------------------*/
				method:"GET",
				path:"/",
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/event/list/event_date/1');
						const events = JSON.parse(payload);
						const data = {};
					    data["admin"] = request.auth.isAuthenticated;
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
						mode: 'try',
      					strategy: 'session'
					},
					handler: (request,h) => {
						const data = {"admin":request.auth.isAuthenticated};
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
						mode: 'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						let data;
						try{	
							const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/leader/list');
							const leader = JSON.parse(payload);
							data = {
								"admin":request.auth.isAuthenticated,
								"leaders":leader,
								"page_title":"Leaders"
							};
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
						mode: 'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						let data;
						try{	
							const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/committee/list');
							const committee = JSON.parse(payload);
							data = {
								"admin":request.auth.isAuthenticated,
								"leaders":committee,
								"page_title":"Committee"
							};
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
						mode: 'try',
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
								"admin":request.auth.isAuthenticated,
								"events":events
							};
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
						mode: 'try',
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
							"admin":request.auth.isAuthenticated,
							"path":`/events/registration`,
							"method":"POST",
							"event_id":request.params.event_id,
							"payment":JSON.stringify(event.payment),
							"costs":JSON.stringify(costs)
						};
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
						mode: 'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						try{
							const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/contact/email/${request.payload.contact_email}`);
							const contact = JSON.parse(payload);
							let data = {};
							contact[0].family['costs'] = request.payload.costs;
							data['admin'] = request.auth.isAuthenticated;
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
				handler: async (request,h) => {
					const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/event/add/attendees', { payload: request.payload }, (err, res, payload) => {
					    console.log(`Error ${err}`)
					});
					return h.redirect('/events');
					
				}
			},
			{
				method:'POST',
				path:'/event/save',
				handler: async (request,h) => {
					let payload = request.payload;
					payload.enabled = checkToBoolean(request.payload.enabled);
					payload.visible = checkToBoolean(request.payload.visible);
					payload.lead_notify = checkToBoolean(request.payload.lead_notify);
					payload.backpacking = checkToBoolean(request.payload.backpacking);
					payload.tshirt = checkToBoolean(request.payload.tshirt);
					
					const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/event/new', { payload: request.payload }, (err, res, payload) => {
					    console.log(`Error ${err}`)
					});
					return h.redirect('/events/admin/list/event_date/1');
				}
			},
			{
				method: 'POST',
				path: '/events/add/family',
				config: {
					auth: {
						mode: 'try',
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
						mode: 'try',
      					strategy: 'session'
					},
					handler: async (request,h) => {
						let data = {};
						data["admin"] = request.auth.isAuthenticated;
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
						mode: 'try',
      					strategy: 'session'
					},
					handler: async(request,h) =>{
						if (!request.auth.isAuthenticated) {
					        return h.redirect('/login');
					    }
						const pay = {"path":"/event/save"};
						pay["admin"] = request.auth.isAuthenticated;
						pay["redirect"] = "~events~admin~event";
						return h.view('eventbuild',pay);
					}
				}
			},
			{
				method:'GET',
				path:'/events/admin/event/{id}',
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler: async(request,h) =>{
						if (!request.auth.isAuthenticated) {
					        return h.redirect('/login');
					    }
						const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/event/${request.params.id}`);
						const pay = JSON.parse(payload);
						pay.path = "/event/update";
						pay["admin"] = request.auth.isAuthenticated;
						pay["redirect"] = `~events~admin~event~${request.params.id}`;
						return h.view('eventbuild',pay);
					}
				}
			},
			{
				method:'POST',
				path:'/event/update',
				config: {
					auth: {
						mode: 'try',
      					strategy: 'session'
					},
					handler: async(request,h) => {
						let payload = request.payload;
						payload.enabled = checkToBoolean(request.payload.enabled);
						payload.visible = checkToBoolean(request.payload.visible);
						payload.lead_notify = checkToBoolean(request.payload.lead_notify);
						payload.backpacking = checkToBoolean(request.payload.backpacking);
						payload.tshirt = checkToBoolean(request.payload.tshirt);
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
				handler:(request,h) => {
					const data = {'redirect':request.query.redirect};
					return h.view('login',data);
				}
			},
			{
				method:"POST",
				path:"/login",
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

						//request.cookieAuth.set(response);
						return h.redirect(tildaToSlash(request.payload.redirect));
					}else{
						return h.view('login',response);
					}
				}
			},
			{
				method:"GET",
				path:"/logout",
				handler: async (request,h) =>{
					request.cookieAuth.clear()
					return h.redirect('/login');
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
