// import * as admin from 'firebase-admin';
// import * as path from 'path';

// const serviceAccount = require(path.resolve(__dirname, './serviceAccountKey.json'));

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// export class FirebaseService {
//     // Método para verificar un ID Token de Firebase
//     async verifyIdToken(idToken: string) {
//         try {
//             const decodedToken = await admin.auth().verifyIdToken(idToken);
//             return decodedToken;
//         } catch (error) {
//             throw new Error('Invalid Firebase token');
//         }
//     }

//     // Otros métodos si necesitas interactuar más con Firebase
// }
