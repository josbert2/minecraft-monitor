import { status } from 'minecraft-server-util';

const IP = 'perfumaditosmod.aternos.me';
const PORT = 52932;
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1358932959607918763/05KoAEu2FoPcsgvuKWbOixUr9LNsdgbraSSbzcCCk0qjWG49wDt6R_jdJH4HWQpxwDHe'; // tu webhook
const JSONBIN_ID = '67f44e388561e97a50fa97b5'; // tu bin ID
const JSONBIN_API_KEY = '$2a$10$IlQlYI4fYW26QU2eaybZnOyRUGsJEnrMyWdUV13WvTYykQ.Y64UKm'; // tu API Key

export default async function handler(req, res) {
  let lastStatus = null;

  // 1. Obtener último estado
  try {
    const resp = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    });
    const json = await resp.json();
    lastStatus = json.record?.status;
  } catch (err) {
    console.error('Error al leer último estado:', err);
  }

  // 2. Verificar estado actual
  try {
    const data = await status(IP, PORT);
    if (lastStatus !== 'online') {
      await notifyDiscord('✅ ¡El servidor de Minecraft está ONLINE!');
      await updateStatus('online');
    }
    return res.status(200).json({ status: 'online', players: data.players.online });
  } catch (err) {
    if (lastStatus !== 'offline') {
      await notifyDiscord('🔴 El servidor de Minecraft está OFFLINE.');
      await updateStatus('offline');
    }
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

async function updateStatus(status) {
  await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY
    },
    body: JSON.stringify({ status })
  });
}
