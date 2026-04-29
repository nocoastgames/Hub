import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export interface AppletLink {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  category: 'game' | 'utility';
  createdAt: number;
}

export function useApplets() {
  const [applets, setApplets] = useState<AppletLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'applets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results: AppletLink[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as AppletLink);
        });
        setApplets(results);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.GET, 'applets');
      }
    );

    return () => unsubscribe();
  }, []);

  return { applets, loading };
}

export async function deleteApplet(id: string) {
  try {
    await deleteDoc(doc(db, 'applets', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `applets/${id}`);
  }
}

export async function saveApplet(applet: Omit<AppletLink, 'id' | 'createdAt'> & { id?: string, createdAt?: number }) {
  try {
    const isNew = !applet.id;
    const id = applet.id || crypto.randomUUID();
    const dataToSave = {
      title: applet.title,
      url: applet.url,
      thumbnailUrl: applet.thumbnailUrl || '',
      description: applet.description || '',
      category: applet.category,
      createdAt: isNew ? Date.now() : applet.createdAt,
    };
    await setDoc(doc(db, 'applets', id), dataToSave);
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, `applets`);
  }
}
