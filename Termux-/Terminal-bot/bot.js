const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

// Ganti dengan token bot kamu
const token = '....';

// Buat instance bot
const bot = new TelegramBot(token, { polling: true });

// Listener untuk setiap pesan yang diterima
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const command = msg.text;

  // Jalankan perintah di terminal
  exec(command, (error, stdout, stderr) => {
    if (error) {
      bot.sendMessage(chatId, `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      bot.sendMessage(chatId, `Stderr: ${stderr}`);
      return;
    }
    bot.sendMessage(chatId, `Output: ${stdout}`);
  });
});

console.log('Bot is running...');
