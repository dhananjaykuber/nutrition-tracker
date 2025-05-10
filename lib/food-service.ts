import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { FoodItem, FoodEntry, DailySummary } from './types';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';

// Food Items
export const addFoodItem = async (foodItem: Omit<FoodItem, 'id'>) => {
  const docRef = await addDoc(collection(db, 'foodItems'), {
    ...foodItem,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...foodItem };
};

export const getFoodItems = async (userId: string) => {
  const q = query(
    collection(db, 'foodItems'),
    where('createdBy', '==', userId),
    orderBy('name')
  );

  const querySnapshot = await getDocs(q);
  const foodItems: FoodItem[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Omit<FoodItem, 'id'>;
    foodItems.push({ id: doc.id, ...data });
  });

  return foodItems;
};

export const getFoodItem = async (id: string) => {
  const docRef = doc(db, 'foodItems', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as Omit<FoodItem, 'id'>;
    return { id: docSnap.id, ...data };
  }

  return null;
};

export const updateFoodItem = async (
  id: string,
  foodItem: Partial<FoodItem>
) => {
  const docRef = doc(db, 'foodItems', id);
  await updateDoc(docRef, foodItem);
  return { id, ...foodItem };
};

export const deleteFoodItem = async (id: string) => {
  const docRef = doc(db, 'foodItems', id);
  await deleteDoc(docRef);
  return id;
};

// Food Entries
export const addFoodEntry = async (entry: Omit<FoodEntry, 'id'>) => {
  const docRef = await addDoc(collection(db, 'foodEntries'), {
    ...entry,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...entry };
};

export const getFoodEntries = async (userId: string, date: string) => {
  const startDate = startOfDay(parseISO(date));
  const endDate = endOfDay(parseISO(date));

  const q = query(
    collection(db, 'foodEntries'),
    where('userId', '==', userId),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    orderBy('date', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const entries: FoodEntry[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Omit<FoodEntry, 'id'>;
    entries.push({ id: doc.id, ...data });
  });

  return entries;
};

export const deleteFoodEntry = async (id: string) => {
  const docRef = doc(db, 'foodEntries', id);
  await deleteDoc(docRef);
  return id;
};

// Daily Summary
export const getDailySummary = async (
  userId: string,
  date: string
): Promise<DailySummary> => {
  const entries = await getFoodEntries(userId, date);

  const summary: DailySummary = {
    date,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalCalories: 0,
    entries,
  };

  entries.forEach((entry) => {
    summary.totalProtein += entry.protein;
    summary.totalCarbs += entry.carbs;
    summary.totalFat += entry.fat;
    summary.totalCalories += entry.calories;
  });

  return summary;
};

// Get Weekly Summary
export const getWeeklySummaries = async (
  userId: string,
  startDate: string,
  endDate: string
) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const q = query(
    collection(db, 'foodEntries'),
    where('userId', '==', userId),
    where('date', '>=', Timestamp.fromDate(startOfDay(start))),
    where('date', '<=', Timestamp.fromDate(endOfDay(end))),
    orderBy('date', 'asc')
  );

  const querySnapshot = await getDocs(q);
  const entriesByDate: Record<string, FoodEntry[]> = {};

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Omit<FoodEntry, 'id'>;
    const entry = { id: doc.id, ...data };
    const dateKey = format(entry.date.toDate(), 'yyyy-MM-dd');

    if (!entriesByDate[dateKey]) {
      entriesByDate[dateKey] = [];
    }

    entriesByDate[dateKey].push(entry);
  });

  const summaries: DailySummary[] = [];

  for (const [dateKey, dateEntries] of Object.entries(entriesByDate)) {
    const summary: DailySummary = {
      date: dateKey,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalCalories: 0,
      entries: dateEntries,
    };

    dateEntries.forEach((entry) => {
      summary.totalProtein += entry.protein;
      summary.totalCarbs += entry.carbs;
      summary.totalFat += entry.fat;
      summary.totalCalories += entry.calories;
    });

    summaries.push(summary);
  }

  return summaries;
};
