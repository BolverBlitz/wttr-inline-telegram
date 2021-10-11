//Include needed jsons
var config = require('./config');
if(config.bottoken === 'Bottoken from @Botfather'){
	throw new Error("Ich brauche einen Bottoken von dem Bot @Botfather in Telegram!\nBitte in config.json schreiben!\n\n");
}

const Telebot = require('telebot');
const bot = new Telebot({
	token: config.bottoken,
	limit: 1000,
        usePlugins: ['commandButton']
});


bot.start(); //Telegram bot start


bot.on('inlineQuery', msg => {
	
	const answers = bot.answerList(msg.id, {cacheTime: 1});
	let Message = "";
	
	if(msg.hasOwnProperty('location')){
		
		let query = msg.query;
		let lat = msg.location.latitude;
		let lon = msg.location.longitude;
		//https://www.google.com/maps?ll=-30.184327,139.576322&q=-30.184327,139.576322+(Beverly+Mine+Visitor+Centre)
		//https://intel.ingress.com/intel?ll=47.859004,11.482016&z=17&pll=47.859004,11.482016
		let Google = "https://www.google.com/maps?" + lat + "," + lon + "&q=" + lat + "," + lon; 
		let IITC = "https://intel.ingress.com/intel?ll=" + lat + "," + lon;
		Message = "Position " + lat + "," + lon + "\n\n" + "[Google](" + Google + ")\n[IITC]( " + IITC + ")"
		// Article
		answers.addArticle({
			id: 'GPS',
			title: 'Give GPS',
			description: `Give GPS`,
			message_text: (Message)
		});
		return bot.answerQuery(answers);
	}else{
		Message = "You didn´t allow this bot to use GPS or your Device has no GPS Postition..."
		answers.addArticle({
			id: 'GPS',
			title: 'Give GPS',
			description: `Give GPS`,
			message_text: (Message)
		});
		return bot.answerQuery(answers);
	}

});