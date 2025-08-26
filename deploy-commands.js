require('dotenv').config();
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!TOKEN || !CLIENT_ID) {
  console.error('Missing TOKEN or CLIENT_ID in .env');
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName('active')
    .setDescription('รับเหรียญนักพัฒนาที่ใช้งานอยู่ของ Discord')
    // ปิดใช้ใน DM (คำสั่งนี้ไว้ใช้ในกิลด์)
    .setDMPermission(false)
    // (ถ้าต้องการกำหนด default member perms เช่นต้องเป็น member ปกติพอแล้ว ก็ไม่ต้องตั้งค่า)
    // .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    if (GUILD_ID) {
      // แบบกิลด์ — เหมาะสำหรับทดสอบ (อัปเดตไว)
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
      console.log('✅ Guild slash commands registered');
    } else {
      // แบบ Global — ใช้จริงทั่วโลก (รอเผยแพร่สักพัก)
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
      console.log('✅ Global slash commands registered');
    }
  } catch (err) {
    console.error('Failed to register commands:', err);
    process.exit(1);
  }
})();
