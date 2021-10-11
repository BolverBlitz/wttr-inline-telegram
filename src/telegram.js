const util = require('util')
const DB = require('../lib/db/postgres');
const path = require('path');
const reqPath = path.join(__dirname, '../');
const { default: i18n } = require('new-i18n');
const newi18n = new i18n({ folder: path.join(reqPath, process.env.Sprache), languages: ['de'], fallback: 'de' })

const Telebot = require('telebot');
const bot = new Telebot({
	token: process.env.TG_BotToken,
	limit: 1000,
        usePlugins: ['commandButton', 'askUser']
});