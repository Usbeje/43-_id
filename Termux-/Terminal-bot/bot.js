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

  // Tambahkan path Termux ke PATH lingkungan
  const env = Object.create(process.env);
  env.PATH = '/data/data/com.termux/files/usr/bin:' + env.PATH;

  // Debugging log untuk melihat PATH
  console.log('PATH:', env.PATH);

  // Gunakan 'tsu' untuk menjalankan perintah dengan hak akses root jika diperlukan
  const isRootCommand = command === 'apt' || command === 'tsu';
  const fullCommand = isRootCommand ? `tsu -c "${command} ${args.join(' ')}"` : `${command} ${args.join(' ')}`;

  // Jalankan perintah di terminal Termux dengan path yang benar
  const child = spawn('sh', ['-c', fullCommand], { env });

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
