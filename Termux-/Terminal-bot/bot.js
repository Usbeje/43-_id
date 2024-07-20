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

  // Inisialisasi loading message
  let loadingMessage = "__loading__";
  let loadingInterval;

  // Kirim pesan loading pertama kali
  bot.sendMessage(chatId, loadingMessage).then(sentMessage => {
    const messageId = sentMessage.message_id;

    // Atur interval untuk memperbarui pesan loading
    loadingInterval = setInterval(() => {
      loadingMessage += "__";
      bot.editMessageText(loadingMessage, { chat_id: chatId, message_id: messageId });
    }, 1000);

    // Jalankan perintah di terminal Termux
    const child = spawn(command, args);

    // Kirim output stdout secara real-time ke chat Telegram
    child.stdout.on('data', (data) => {
      clearInterval(loadingInterval); // Hentikan pesan loading
      bot.sendMessage(chatId, data.toString());
    });

    // Kirim output stderr secara real-time ke chat Telegram
    child.stderr.on('data', (data) => {
      clearInterval(loadingInterval); // Hentikan pesan loading
      bot.sendMessage(chatId, `Stderr: ${data.toString()}`);
    });

    // Kirim pesan saat perintah selesai
    child.on('close', (code) => {
      clearInterval(loadingInterval); // Hentikan pesan loading
      bot.sendMessage(chatId, `Process exited with code ${code}`);
    });
  });
});

console.log('Bot is running...');
