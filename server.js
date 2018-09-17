'use strict';

const Hapi = require('hapi');
const Wreck = require('wreck');
const server = new Hapi.Server();
const events = {"events":[
	{"event_name":"End of Year Pack Meeting/Pack Picnic Crossover",
	"event_date":"Sat, Jun 2nd, 2019",
	"reg_close":"04-21-2018",
	"event_id":"227",
	"event_desc":"2018 Super Trip to Gatlinburg TN. We will be sleeping with the sharks. Includes next day admission to Ripley's Aquarium. Must be at least 5 years old to attend!  For more information please see the",
	"event_lead":"test",
	"event_lead_email":"kittykolb@gmail.com",
	"event_payment":"https://squareup.com/store/bsa-pack-97/item/summer-daycamp",
	"participants":[
		{"contact_name":"John Kelley",
		"contact_phone":"7045551234",
		"contact_email":"johnkelley4477@gmail.com",
		"verified":true,
		"attendees":[
			{'type':'other','name':'Mason S.','detail':'Male'},
			{'type':'scout','name':'Cameron S.','detail':'Webelos: Nifflers'},
			{'type':'leader','name':'John K.','detail':'Male'},
			{'type':'adult','name':'Katie B.','detail':'Female'},
			{'type':'scout','name':'Cooper S.','detail':'Tiger: Den 3'}
		]},
		{"contact_name":"James Forbes",
		"contact_phone":"7045551234",
		"contact_email":"johnkelley4477@gmail.com",
		"verified":false,
		"attendees":[
			{"type":"other","name":"Everett F..","detail":"Male"},
			{"type":"adult","name":"James F.","detail":"Male"},
			{"type":"adult","name":"Chris F.","detail":"Female"},
			{"type":"scout","name":"Travis F.","detail":"Tiger: Den 3"}
		]}
	]},
	{"event_name":"End of Year Pack Meeting/Pack Picnic Crossover",
	"event_date":"Sat, Jun 2nd, 2018",
	"reg_close":"04-21-2018",
	"event_id":"226",
	"event_desc":"2018 Super Trip to Gatlinburg TN. We will be sleeping with the sharks. Includes next day admission to Ripley's Aquarium. Must be at least 5 years old to attend!  For more information please see the",
	"event_lead":"test",
	"event_lead_email":"kittykolb@gmail.com",
	"event_payment":"https://squareup.com/store/bsa-pack-97/item/summer-daycamp",
	"participants":[
		{"contact_name":"John Kelley",
		"contact_phone":"7045551234",
		"contact_email":"johnkelley4477@gmail.com",
		"verified":true,
		"attendees":[
			{"type":"other","name":"Mason S.","detail":"Male"},
			{"type":"scout","name":"Cameron S.","detail":"Webelos: Nifflers"},
			{"type":"leader","name":"John K.","detail":"Male"},
			{"type":"adult","name":"Katie B.","detail":"Female"},
			{"type":"scout","name":"Cooper S.","detail":"Tiger: Den 3"}
		]}
	]}
]};
const leaders = {"contacts":[
	{"scout_id":"8928398298392801",
	"contact_name":"John Kelley",
	"contact_title":"Tiger Den Leader",
	"contact_desc":"Long hikes in the woods",
	"contact_email":"johnkelley@cubscoutspack97.com"},
	{"scout_id":"1241356465461223",
	"contact_name":"James Barton",
	"contact_title":"Arrow of Light Patrol Leader",
	"contact_desc":"Long walks on the beach",
	"contact_email":"jamesbarton@cubscoutspack97.com"}
]};
const committee = {"contacts":[
	{"scout_id":"8928398298392801",
	"contact_name":"John Kelley",
	"contact_title":"Webmaster",
	"contact_desc":"Long hikes in the woods",
	"contact_email":"webmaster@cubscoutspack97.com"},
	{"scout_id":"1241356465461223",
	"contact_name":"Micheal Kolb",
	"contact_title":"Committee Chair",
	"contact_desc":"Long walks on the beach",
	"contact_email":"committeechair@cubscoutspack97.com"}
]};

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
	handler: (request,reply) => {
		const data = {"admin":false};
		data["events"] = events.events;
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
			const {res,payload} = await Wreck.get('http://10.5.0.7:4477/api/pack97/event/list');
			const events = JSON.parse(payload);
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
		const data = {
			"path":`/events/registration/${request.params.event_id}`,
			"method":"GET",
			"event_id":request.params.event_id
		};
		return reply.view(`events_reg`,data);
	}
});

server.route({
	method:'GET',
	path:'/events/registration/{event_id}',
	handler: async (request,reply) => {
		try{
			const {res,payload} = await Wreck.get(`http://10.5.0.7:4477/api/pack97/contact/email/${request.query.contact_email}`);
			const contact = JSON.parse(payload);
			let data = {};
			data['email'] = request.query.contact_email;
			data['event_id'] = request.params.event_id;
			data['contact'] = contact;
			data['path'] = "/events/register/attendee";
			data['method'] = "POST";
			
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
		//console.log(request.payload);
		const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/event/add/attendees', { payload: request.payload }, (err, res, payload) => {
		    console.log(`Error ${err}`)
		});
		reply.redirect('/events');
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
			family["scout_id"] = scout[0]._id;
			family["den"] = scout[0].den;
		}

		attendee["family"] = family;
		const wreck = await Wreck.post('http://10.5.0.7:4477/api/pack97/contact/add/family', { payload: attendee }, (err, res, payload) => {
		    console.log(`Error ${err}`)
		});
		reply.redirect(`/events/registration/${request.payload.event_id}?contact_email=${request.payload.contact_email}`);
		return true;
	}
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}/`);
});