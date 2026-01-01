import 'server-only';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || 'mock-project-id',
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 'mock-email@example.com',
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvs062OuR8rd/1\noRlnM5mwuG2Lw7EaqMu0g4jlrHFRrZzazCiRx59Sj/U6NuAZ0oA+3g2tSMRpWIRT\nCriNfKcC94+UgnTWOooPWzyq4qWAeE1qY/laAAvEsOuW/6SZrjYigNSv29QvIZ0i\nL0zagLFskEqVv1tlf7NpBjKicOBerkxfjSzDbHu4AMe8rE7w/u2KAI3VIYCFfYrM\nrbYcmX5VIMn6Do2zBCuxftMwOzm2oo/hLHoK9zlFYiW0/cAF2LIqF5nbxDyeSBTd\ndiACC7NCU3Nwm4iReNPsf5k8dSJMuWXC5Aqljo3VLtzCx+1NH1KLEz/iaLnr8f/7\nDHLc1UAjAgMBAAECggEAQvUq4ICWFbuvl2yjATTlc7b9LF/R7Q55vxvHfnuWneFz\nXuCh71hra6vn8Rz7j2usqwi1np2WGG1+1CTIS0c/YH6Wrap/uyqI9aw39Qm1t71h\nB1P9MWLGGVmxFpTrFhQRllmRdElq1eFSADaVa8nSk8RzYBkSTB578WDGyCgLIZlY\n488V+tVVIqEXZm15Mnd7lM1dPPJF0SwUWDxiTdumGTyTENpgso1KYyYBAHbPTLzI\nRbe4PXOppKMtnk8r5wvQwq/8hjg4UedJQQMzvzJp0r59GTAzw3aD7cY9suTHQJJG\nRsxW34otr/XL3+esoRmAbxwAhZJYCIlU3pqYGTzebQKBgQDzDQ74vbON4SofS9Nu\nOAteQHBtsECYxTVlkVB4D+d52KxL/apQW36B2qIOWmv2nXEnAFrznOzmCuwD1oPY\nSgOn8jGcEsYTzG5lSw5Igh5CRI1X0xSF4C7m76yYfcqEtQNRM/irOtwmUzLoCZS+\nZOodtnJNOBJZphZx5kk+pPt3bwKBgQC5D6m2MZGhdh3j7o9mKx1UAigXoiJMQNwE\nfXGlCiDTegtlM7jNTfLeN7imvHvS88JN4SwTDwdONThrVhybbM6mp44DVqqbFgHF\nqv2mD0XSelWW8St3xaCLeyd/2q4ZX6s6IQr6G0i9SfkWbwuksVFH6O9IVFIGGr4B\nTXIVQncIjQKBgBNsBrc/yXpb9Na9Y27aUaY9df596BuNHsA4BXsiojetZc9IvPRg\n61ILG4oUFa6GVEVulNYEwzV6x/Nij/SXrYUdKHO1WFi6rFOx1LlclHhtK/JJrskn\n6feQTXV+D9Hc+R/jDEr6kB8L5PR/14ADZmXrb2TWRzkcuYxuf4ne+y1HAoGBAJjN\nbwMJ4MZhwgJu+yaQGPJBqZsB+7HcqA5pCcoNF9el4PzZ/RA/+XY0qhm6bb9cGCa3\n8u11rkGMPh6ahppq+CKxHNhy2gGd5S6ypidUWwGUk1FDpvGJU6t3r8Co7rHyxW4E\n1Ix4tNHe33X/kKyW4JcwpUqinOt/bz2iFb2qGKENAoGBANFDUmTo8hzfk3chCHcR\nd+DRcuZNwfJOOiUJoCNPEGEsHPyXV9Cq380wcw6rr9Bsu0qXhyL+nWg25x2yNVfi\n/iZ5m16n8ySvUqayMYvhFufhMiDMjtSbc7riVXNjPZFYRZu1CFlmO8ARBExiUnN8\nO2WRJ418iwcrE/9gBQPy7j4Q\n-----END PRIVATE KEY-----').replace(/\\n/g, '\n'),
};

let adminApp: any;

if (getApps().length === 0) {
  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  adminApp = getApps()[0];
}

const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminDb, adminAuth, adminApp };
