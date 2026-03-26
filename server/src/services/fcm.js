const admin = require('firebase-admin');

let initialized = false;

function initFirebase() {
  if (initialized) return;

  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountRaw) {
    const parsed = JSON.parse(serviceAccountRaw);
    admin.initializeApp({
      credential: admin.credential.cert(parsed),
    });
    initialized = true;
    return;
  }

  if (serviceAccountPath) {
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath)),
    });
    initialized = true;
    return;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    initialized = true;
    return;
  }
}

async function sendToTokens(tokens, payload) {
  if (!tokens || tokens.length === 0) return { success: false, reason: 'no_tokens' };
  initFirebase();
  if (!initialized) {
    return { success: false, reason: 'firebase_not_configured' };
  }

  const message = {
    tokens,
    notification: payload.notification || undefined,
    data: payload.data || undefined,
  };

  const result = await admin.messaging().sendEachForMulticast(message);
  return result;
}

module.exports = {
  sendToTokens,
};
