'use strict';

const Hapi = require('hapi');
const Wreck = require('wreck');
const server = new Hapi.Server();

server.register([require('vision'),require('inert')], (err) => {

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
});

server.connection({ port: 3003, host: '0.0.0.0' });

//route to homepage
server.route({
	method:"GET",
	path:"/",
	handler: async (request,reply) => {
		const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/event/list/event_date/1');
		const events = JSON.parse(payload);
		const data = {"admin":false};
		data["events"] = events;
		return reply.view('homepage',data);
	}
});

//route to events
server.route({
	method:"GET",
	path:"/events",
	handler: async (request,reply) => {
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
		
		return reply.view('events_home',data);
	}
});

//route to program overview
server.route({
	method:"GET",
	path:"/program",
	handler: (request,reply) => {
		const data = {"admin":false};
		data["events"] = events.events;
		return reply.view('program',data);
	}
});

//route to leaders
server.route({
	method:"GET",
	path:"/leaders",
	handler: async (request,reply) => {
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
		return reply.view('leaders',data);
	}
});

//route to committee
server.route({
	method:"GET",
	path:"/committee",
	handler: async (request,reply) => {
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
		return reply.view('leaders',data);
	}
});

//route to images
server.route({
	method:'GET',
	path:'/images/{images}',
	handler:(request,reply)=>{
		return reply.file(`./images/${request.params.images}`);
	}
});

server.route({
	method:'GET',
	path:'/images/events/{images}',
	handler:(request,reply)=>{
		return reply.file(`./images/events/${request.params.images}`);
	}
});

//route to css
server.route({
	method:'GET',
	path:'/css/{css}',
	handler:(request,reply)=>{
		return reply.file(`./css/${request.params.css}`);
	}
});

//route to slick
server.route({
	method:'GET',
	path:'/slick/{slick}',
	handler:(request,reply)=>{
		return reply.file(`./slick/${request.params.slick}`);
	}
});

//route to slick fonts
server.route({
	method:'GET',
	path:'/slick/fonts/{slick}',
	handler:(request,reply)=>{
		return reply.file(`./slick/fonts/${request.params.slick}`);
	}
});

//route to js
server.route({
	method:'GET',
	path:'/js/{js}',
	handler:(request,reply)=>{
		return reply.file(`./js/${request.params.js}`);
	}
});

server.route({
	method:'GET',
	path:'/events/register/{event_id}',
	handler: async (request,reply) => {
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
		return reply.view(`events_reg`,data);
	}
});

server.route({
	method:'POST',
	path:'/events/registration',
	handler: async (request,reply) => {
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
			return reply.view(`events_reg`,data);
		}catch(err){
			console.log("failed" + err);
		}
	}
});

server.route({
	method:'POST',
	path:'/events/register/attendee',
	handler: async (request,reply) => {
		const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/event/add/attendees', { payload: request.payload }, (err, res, payload) => {
		    console.log(`Error ${err}`)
		});
		reply.redirect('/events');
		return true; 
		
	}
});

server.route({
	method:'POST',
	path:'/event/save',
	handler: async (request,reply) => {
		let payload = request.payload;
		payload.enabled = checkToBoolean(request.payload.enabled);
		payload.visible = checkToBoolean(request.payload.visible);
		payload.lead_notify = checkToBoolean(request.payload.lead_notify);
		payload.backpacking = checkToBoolean(request.payload.backpacking);
		payload.tshirt = checkToBoolean(request.payload.tshirt);
		
		const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/event/new', { payload: request.payload }, (err, res, payload) => {
		    console.log(`Error ${err}`)
		});
		reply.redirect('/events/admin/list/event_date/1');
		return true; 
	}
});

server.route({
	method: 'POST',
	path: '/events/add/family',
	handler: async (request,reply) => {
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
				return reply.view("events_reg",request.payload);
			}
		}

		attendee["family"] = family;
		const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/contact/add/family', { payload: attendee }, (err, res, payload) => {
		    console.log(`Error ${err}`)
		});
		reply.redirect(`/events/register/${request.payload.event_id}`);
		return true;
	}
});

server.route({
	method:'GET',
	path:'/events/admin/list/{field}/{direction}',
	handler: async (request,reply) => {
		const field = request.params.field;
		const direction = request.params.direction;
		const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/event/list/${field}/${direction}`);
		let data = {"events":JSON.parse(payload)};
		return reply.view('events_admin_list',data);
	}
});

server.route({
	method:'GET',
	path:'/events/admin/event',
	handler:(request,reply) =>{
		const pay = {"path":"/event/save"};
		reply.view('eventbuild',pay);
	}
});

server.route({
	method:'GET',
	path:'/events/admin/event/{id}',
	handler: async(request,reply) =>{
		const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/event/${request.params.id}`);
		const pay = JSON.parse(payload);
		pay.path = "/event/update";
		reply.view('eventbuild',pay);
	}
});

server.route({
	method:'POST',
	path:'/event/update',
	handler: async(request,reply) => {
		let payload = request.payload;
		payload.enabled = checkToBoolean(request.payload.enabled);
		payload.visible = checkToBoolean(request.payload.visible);
		payload.lead_notify = checkToBoolean(request.payload.lead_notify);
		payload.backpacking = checkToBoolean(request.payload.backpacking);
		payload.tshirt = checkToBoolean(request.payload.tshirt);
		const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/event/update', { payload: payload }, (err, res, payload) => {
		    console.log(`Error ${err}`)
		});
		reply.redirect('/events/admin/list/event_date/1');
		return true;
	}
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`${new Date()} Server running at: ${server.info.uri}/`);
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
