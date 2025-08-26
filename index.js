require('dotenv').config();
const {
  Client, GatewayIntentBits, Events, REST, Routes,
  SlashCommandBuilder, EmbedBuilder, ActivityType   // << เพิ่ม ActivityType
} = require('discord.js');
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/* ===== ฟังก์ชันสถานะบอท: Watching 2rd.top ===== */
function setRotatingPresence(c) {
  const activities = [
    { name: '2rd.top', type: 3 },                    // Watching 2rd.top
    //{ name: 'Minecraft', type: 0 },                  // Playing Minecraft
    //{ name: 'เพลง Lo-Fi 🎵', type: 2 },               // Listening to Lo-Fi
    //{ name: 'การแข่งขัน Coding', type: 5 },          // Competing in Coding
  ];

  let i = 0;
  function update() {
    c.user.setPresence({
      activities: [activities[i]],
      status: 'online',
    });
    i = (i + 1) % activities.length; // วนลูป
  }

  update();                     // อัปเดตทันที
  setInterval(update, 30_000);  // อัปเดตทุก 30 วินาที
}

//เว็บ

const express = require('express');
const app = express();
app.get('/', (_, res) => res.send('Bot is running!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server running on ${PORT}`));

//==============

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
  setRotatingPresence(c); // << เรียกใช้ที่นี่
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'active') {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'เหรียญนักพัฒนาที่ใช้งานอยู่ของ Discord',
        iconURL: 'https://cdn.discordapp.com/emojis/1040325165512396830.webp?size=64&quality=lossless',
      })
      .setTitle('คุณเรียกใช้คำสั่งสแลชสำเร็จแล้ว!')
      .setColor('#34DB98')
      .setDescription(
        '- ไปที่ *https://discord.com/developers/active-developer* แล้วขอรับเหรียญของคุณ\n' +
        ' - การตรวจสอบอาจใช้เวลาสูงสุดถึง 24 ชั่วโมง กรุณารออย่างอดทนจนกว่าคุณจะได้รับเหรียญ'
      )
      .setFooter({
        text: 'สร้างโดย 2rd.top',
        iconURL: 'https://cdn.discordapp.com/emojis/1040325165512396830.webp?size=64&quality=lossless',
      });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

client.login(process.env.TOKEN);

/* ===== ลงทะเบียนคำสั่ง /active ===== */
const commands = [
  new SlashCommandBuilder()
    .setName('active')
    .setDescription('รับเหรียญนักพัฒนาที่ใช้งานอยู่ของ Discord')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Slash command registered!');
  } catch (error) {
    console.error(error);
  }
})();
