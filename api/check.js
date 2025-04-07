import { status } from 'minecraft-server-util';

const IP = 'perfumaditosmod.aternos.me';
const PORT = 52932;
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1358919456671273041/wy8r36DE4HkcOSMKVOplXOfMoFcHc5yRsUMj2MEsecKD-MW865uGu7-FDAN3pxxIS9Fp';

export default async function handler(req, res) {
  try {
    const response = await status(IP, PORT);
    await notifyDiscord('✅ ¡El servidor de Minecraft está ONLINE!');
    return res.status(200).json({ status: 'online', players: response.players.online });
  } catch (err) {
    await notifyDiscord('🔴 El servidor de Minecraft está OFFLINE.');
    return res.status(200).json({ status: 'offline' });
  }
}

async function notifyDiscord(message) {
  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: message })
  });
}