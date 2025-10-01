import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

// 備用數據 - 僅在 Firebase 完全無法連接時使用
const sampleData = [
  {
    id: 'fallback',
    title: '無法載入資料',
    date: new Date(),
    mediaType: 'text',
    content: '請檢查網路連接或聯繫管理員'
  }
];

export const useTimeline = () => {
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 嘗試從 Firebase 獲取數據
    const fetchFromFirebase = () => {
      const q = query(
        collection(db, 'getsuka-timeline'), 
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTimelineItems(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching timeline:', err);
          setTimelineItems(sampleData);
          setError(`無法載入時間軸資料: ${err.message}`);
          setLoading(false);
        }
      );

      return unsubscribe;
    };

    let unsubscribe;
    try {
      unsubscribe = fetchFromFirebase();
    } catch (err) {
      console.error('Firebase 初始化錯誤:', err);
      setTimelineItems(sampleData);
      setError('Firebase 連接失敗');
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return {
    timelineItems,
    loading,
    error
  };
};