'use client';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useDoc<T>(path: string, docId: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !path || !docId) {
      setLoading(false);
      return;
    }
    const docRef = doc(firestore, path, docId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData({ id: snapshot.id, ...snapshot.data() } as T);
      } else {
        setData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, path, docId]);

  return { data, loading };
}
