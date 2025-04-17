const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Ulanyjynyň başda gelende
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  users.add(chatId); // ulanyjy goş

  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '➕ Kanala Agza Bol', url: `https://t.me/${CHANNEL_ID.replace('@', '')}` }],
        [{ text: '✅ Agza boldum', callback_data: 'check_member' }]
      ]
    }
  };

  bot.sendMessage(chatId, 'Kanala agza bolmak üçin aşakdaky düwmä basyň:', opts);
});

// Callback-lar
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'check_member') {
    try {
      const member = await bot.getChatMember(CHANNEL_ID, chatId);
      if (['member', 'administrator', 'creator'].includes(member.status)) {
        // Agza bolan
        const opts = {
          reply_markup: {
            inline_keyboard: [
              [{ text: '📖 Habarlary oka', url: WEB_URL }]
            ]
          }
        };
        bot.sendMessage(chatId, 'Şu ýerde täzelikleri okap bilersiňiz:', opts);
      } else {
        bot.sendMessage(chatId, 'Ilki bilen kanala agza bolmaly!');
      }
    } catch (error) {
      bot.sendMessage(chatId, 'Ýalňyşlyk ýüze çykdy.');
    }
  }
});

// Admin täze habar goşanda
app.post('/newpost', (req, res) => {
  const { secret, message } = req.body;

  if (secret !== ADMIN_ID) {
    return res.status(403).send('Access Denied');
  }

  users.forEach(userId => {
    bot.sendMessage(userId, `🆕 Täze habar goşuldy: ${message}\n\nOkamak üçin: ${WEB_URL}`);
  });

  res.send('Sent successfully.');
});

// Ulanyjy sanyny görkezmek
app.get('/users', (req, res) => {
  res.send(`Ulanyjylaryň sany: ${users.size}`);
});

// Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server işleýär: ${PORT}`);
});
