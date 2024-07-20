 const TelegramBot = require('node-telegram-bot-api');
const { spawn } = require('child_process');

// Ganti dengan token bot kamu
const token = '7392967430:AAEWky63is69WKIy0DIMbXKkObDLcBNtD4M';

// Buat instance bot
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const command = msg.text.split(' ')[0];
  const args = msg.text.split(' ').slice(1);

  // Jalankan perintah di terminal Termux
  const child = spawn('sh', ['-c', `${command} ${args.join(' ')}`]);

  // Kirim output stdout secara real-time ke chat Telegram
  child.stdout.on('data', (data) => {
    bot.sendMessage(chatId, data.toString());
  });

  // Kirim output stderr secara real-time ke chat Telegram
  child.stderr.on('data', (data) => {
    bot.sendMessage(chatId, `Stderr: ${data.toString()}`);
  });

  // Kirim pesan saat perintah selesai
  child.on('close', (code) => {
    bot.sendMessage(chatId, `Process exited with code ${code}`);
  });
});

console.log('Bot is running...');
