const util = require('util')
const DB = require('../lib/db/postgres');
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

bot.on(/^\/help$/i, (msg) => {
	let helpmsg = newi18n.translate("helpmsg")
	msg.reply.text(helpmsg, { parseMode: 'html' });
});

bot.on(/^\/setup( .+)*/i, (msg, props) => {
	let CheckAtributes = AtrbutCheck(props);
	if(!CheckAtributes.hasAtributes){
		bot.sendMessage(msg.chat.id, newi18n.translate("setup.help"), {parseMode: 'html'});
	}else{
		let private;
		if(msg.chat){
			if(msg.chat.type === "private"){private = true}
		}else{
			if(msg.message.chat.type === "private"){private = true}
		}
		if(!private){
			if(isChatAdmin(msg)){
				
			}else{
				bot.sendMessage(msg.chat.id, newi18n.translate("setup.nopermissions"), {parseMode: 'html'})
			}
		}else{

		}
	}
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

function AtrbutCheck(props) {
	let input = props.match.input.split(' ')
	if(input[0].endsWith(process.env.Telegram_Bot_Botname)){
		let atributesWName = [];
		for(let i=1; i <= input.length - 1; i++){
			atributesWName.push(input[i])
		}
		if(atributesWName.length >= 1){
			return {hasAtributes: true, atributes: atributesWName}
		}else{
			return {hasAtributes: false}
		}
	}else{
		if(typeof(props.match[1]) === 'undefined'){
			return {hasAtributes: false}
		}else{
			let atributeOName = [];
			let input = props.match[1].split(' ')
			for(let i=1; i <= input.length - 1; i++){
				atributeOName.push(input[i])
			}
			return {hasAtributes: true, atributes: atributeOName}
		}
	}
}

function isChatAdmin(msg) {
	bot.getChatAdministrators(msg.chat.id).then(function(Admins) {
		AdminArray = [];
		for(i in Admins){
			AdminArray.push(Admins[i].user.id)
		}
		if(AdminArray.includes(msg.from.id)){
			return true
		}else{
			return false
		}
	});
}