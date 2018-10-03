'use strict';

const Hapi = require('hapi');
//const HapiAuthCookie = require('hapi-auth-cookie');
const Wreck = require('wreck');
const server = new Hapi.Server({
	port: 3003, 
	host: '0.0.0.0'
});

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


// let uuid = 1;

// async function authCookie(){
// 	await server.register(require('hapi-auth-cookie'));

// 	const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
//     server.app.cache = cache;

//     server.auth.strategy('session', 'cookie', {
//         password: 'CnBEYC2EWb9WffbEofjG6Js0aIJZN1hO',
//         cookie: 'scout_code',
//         redirectTo: '/login',
//         isSecure: false,
//         validateFunc: async (request, session) => {
//         	console.log(request);
//             const cached = await cache.get(session.sid);
//             const out = {
//                 valid: !!cached
//             };
 
//             if (out.valid) {
//                 out.credentials = cached.account;
//             }
 
//             return out;
//         }
//     });
 
//     server.auth.default('session');
// }

const init = async () => {
	await startAuth();
	server.auth.strategy('session','cookie',{
		password: 'CnBEYC2EWb9WffbEofjG6Js0aIJZN1hO',
		isSameSite: 'Lax',
		cookie: 'scout_code',
        redirectTo: '/login'
	});
	
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
				handler: async (request,h) => {
					const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/event/list/event_date/1');
					const events = JSON.parse(payload);
					const data = {"admin":false};
					data["events"] = events;
					return h.view('homepage',data);
				}
			},
			{
				/** Program page route --------------------*/
				method:"GET",
				path:"/program",
				handler: (request,h) => {
					const data = {"admin":false};
					data["events"] = events.events;
					return h.view('program',data);
				}
			},
			{
				/** Leader Page Routes --------------------*/
				method:"GET",
				path:"/leaders",
				handler: async (request,h) => {
					let data;
					try{	
						const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/leader/list');
						const leader = JSON.parse(payload);
						data = {
							"admin":false,
							"leaders":leader,
							"page_title":"Leaders"
						};
						
					}catch(err){
						console.log("failed" + err);
					}
					return h.view('leaders',data);
				}
			},
			{
				/** Comittee Page Routes ------------------*/
				method:"GET",
				path:"/committee",
				handler: async (request,h) => {
					let data;
					try{	
						const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/committee/list');
						const committee = JSON.parse(payload);
						data = {
							"admin":false,
							"leaders":committee,
							"page_title":"Committee"
						};
						
					}catch(err){
						console.log("failed" + err);
					}
					return h.view('leaders',data);
				}	
			},
			{
				/** Events page Routes -------------------*/
				method:"GET",
				path:"/events",
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
							"admin":false,
							"events":events
						};
						
					}catch(err){
						console.log("failed" + err);
					}
					
					return h.view('events_home',data);
				}
			},
			{
				/** */
				method:'GET',
				path:'/events/register/{event_id}',
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
					return h.view(`events_reg`,data);
				}
			},
			{
				method:'POST',
				path:'/events/registration',
				handler: async (request,h) => {
					try{
						const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/contact/email/${request.payload.contact_email}`);
						const contact = JSON.parse(payload);
						let data = {};
						contact[0].family['costs'] = request.payload.costs;
						data['email'] = request.payload.contact_email;
						data['event_id'] = request.payload.event_id;
						data['contact'] = contact;
						data['path'] = "/events/register/attendee";
						data['method'] = "POST";
						data['payment'] = request.payload.payment;
						return h.view(`events_reg`,data);
					}catch(err){
						console.log("failed" + err);
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
							return h.view("events_reg",request.payload);
						}
					}

					attendee["family"] = family;
					const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/contact/add/family', { payload: attendee }, (err, res, payload) => {
					    console.log(`Error ${err}`)
					});
					return h.redirect(`/events/register/${request.payload.event_id}`);
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
						console.log(request.auth.credentials);
						const field = request.params.field;
						const direction = request.params.direction;
						const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/event/list/${field}/${direction}`);
						let data = {"events":JSON.parse(payload)};
						return h.view('events_admin_list',data);
					}
				}
			},
			{
				method:'GET',
				path:'/events/admin/event',
				handler: async(request,h) =>{
					const pay = {"path":"/event/save"};
					return h.view('eventbuild',pay);
				}
			},
			{
				method:'GET',
				path:'/events/admin/event/{id}',
				handler: async(request,h) =>{
					const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/event/${request.params.id}`);
					const pay = JSON.parse(payload);
					pay.path = "/event/update";
					return h.view('eventbuild',pay);
				}
			},
			{
				method:'POST',
				path:'/event/update',
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
			},
			{
				method:"GET",
				path:"/login",
				handler:(request,h) => {
					return h.view('login');
				}
			},
			{
				method:"POST",
				path:"/login",
				handler: async (request,h) => {
					let data = {};
					data["email"] = request.payload.username;
					data["password"] = request.payload.password;

					const {res,payload} = await Wreck.post('http://10.5.0.7:4477/api/pack97/user/validation',{payload: data}, (err, res, payload) => {
					    console.log(`Error ${err}`)
					});
					const response = JSON.parse(payload);
					if (response.response === 'success'){
						request.cookieAuth.set({id: data.email});
						return h.redirect('/events/admin/list/event_date/1');
					}else{
						return h.view('login',response);
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
