import { status } from 'minecraft-server-util';
import fetch from 'node-fetch';

const IP = 'perfumaditosmod.aternos.me';
const PORT = 52932;
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1358919456671273041/wy8r36DE4HkcOSMKVOplXOfMoFcHc5yRsUMj2MEsecKD-MW865uGu7-FDAN3pxxIS9Fp'; // tu webhook
const JSONBIN_ID = '67f44e388561e97a50fa97b5'; // tu bin ID
const JSONBIN_API_KEY = '$2a$10$IlQlYI4fYW26QU2eaybZnOyRUGsJEnrMyWdUV13WvTYykQ.Y64UKm'; // tu API Key

async function main() {
  let lastStatus = null;

  try {
    // Leer el último estado desde JSONBin
    const resp = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    });
    const json = await resp.json();
    console.log('📥 Leyendo últimos datos de JSONBin:', json);
    lastStatus = json.record?.status;
  } catch (err) {
    console.log('❗ No se pudo leer el último estado:', err.message);
  }

  try {
    // Verificar si el servidor está online
    const data = await status(IP, PORT);
    if (lastStatus !== 'online') {
      await notifyDiscord('✅ ¡El servidor de Minecraft está ONLINE!');
      await updateStatus('online');
    } else {
      console.log('🟢 El servidor sigue online, no se envía alerta.');
    }
  } catch (err) {
    if (lastStatus !== 'offline') {
      await notifyDiscord('🔴 El servidor de Minecraft está OFFLINE.');
      await updateStatus('offline');
    } else {
      console.log('🔴 El servidor sigue offline, no se envía alerta.');
    }
  }
}

async function notifyDiscord(message) {
  console.log('📣 Enviando mensaje a Discord:', message);
  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: message })
  });
}

async function updateStatus(status) {
  console.log('💾 Guardando nuevo estado:', status);
  await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY
    },
    body: JSON.stringify({ status })
  });
}

main();
