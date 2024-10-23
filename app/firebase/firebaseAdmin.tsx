import admin from 'firebase-admin';

// Initialize the Firebase Admin SDK only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: "https://ma-aji-game-default-rtdb.firebaseio.com"
  });
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();


