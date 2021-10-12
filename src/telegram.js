const util = require('util')
//const DB = require('../lib/db/postgres');
const path = require('path');
const reqPath = path.join(__dirname, '../');
const { default: i18n } = require('new-i18n');
const newi18n = new i18n({ folder: path.join(reqPath, process.env.Sprache), languages: ['de','en'], fallback: 'en' })

const Telebot = require('telebot');
const bot = new Telebot({
	token: process.env.TG_BotToken,
	limit: 1000,
        usePlugins: ['commandButton', 'askUser']
});

bot.start(); //Telegram bot start

bot.on(/^\/start$/i, (msg) => {
	let startmsg = newi18n.translate("startmsg")
	msg.reply.text(startmsg, { parseMode: 'html' });
});

bot.on('inlineQuery', msg => {
	
	const answers = bot.answerList(msg.id, {cacheTime: 1});
	
	if(msg.hasOwnProperty('location')){
		let lat = msg.location.latitude.toFixed(2)
		let lon = msg.location.longitude.toFixed(2)

		// Article
		answers.addPhoto({
			id: '1',
			thumb_url: `https://wttr.in/${lat},${lon}.png?lang=en`,
			photo_url: `https://wttr.in/${lat},${lon}.png?lang=en`
		});

		return bot.answerQuery(answers);
	}else{
		if(msg.query.length > 1){
			/* Does not work with TG for some reason lol*/
			answers.addPhoto({
				id: 1,
				thumb_url: `https://wttr.in/${msg.query}.png?lang=en`,
				photo_url: `https://wttr.in/${msg.query}.png?lang=en`
			});
			
			answers.addPhoto({
				id: 2,
				thumb_url: `https://v2.wttr.in/${msg.query}.png?lang=en`,
				photo_url: `https://v2.wttr.in/${msg.query}.png?lang=en`
			});
			
			return bot.answerQuery(answers);
		}else{
			Message = newi18n.translate("Inline.NoGPSAndQuery")
			answers.addArticle({
				id: 'GPS',
				title: newi18n.translate("Inline.NoGPSAndQueryTitle"),
				description: newi18n.translate("Inline.NoGPSAndQuerydescription"),
				message_text: (Message)
			});
			return bot.answerQuery(answers);
		}
	}

});