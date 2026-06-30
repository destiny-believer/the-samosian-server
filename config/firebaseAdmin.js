import { initializeApp, cert, getApps } from "firebase-admin/app";
import fs from "fs";

const serviceAccount = JSON.parse(
    fs.readFileSync(
        new URL("./firebaseServiceAccount.json", import.meta.url),
        "utf8"
    )
);

const app =
    getApps().length === 0
        ? initializeApp({
              credential: cert(serviceAccount)
          })
        : getApps()[0];

export default app;