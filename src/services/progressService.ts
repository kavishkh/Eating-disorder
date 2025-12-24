import { ProgressMetrics } from "@/types/types";
import { progressAPI } from "@/utils/api";

export const updateUserProgress = async (userId: string, metrics: Partial<ProgressMetrics>) => {
  try {
    // Check if we're online first
    if (!navigator.onLine) {
      console.log("Device is offline, storing updates in queue");
      // Store the update in a queue to be processed when back online
      const offlineQueue = JSON.parse(localStorage.getItem('progressUpdateQueue') || '[]');
      offlineQueue.push({ userId, metrics, timestamp: new Date().toISOString() });
      localStorage.setItem('progressUpdateQueue', JSON.stringify(offlineQueue));
      return;
    }

    await progressAPI.getMetrics();

    // Process any updates that were queued while offline
    await processOfflineQueue();

  } catch (error) {
    console.error("Error updating user progress:", error);

    // If we have a network error, queue the update for later
    if (!navigator.onLine || (error instanceof Error && error.message.includes("offline"))) {
      const offlineQueue = JSON.parse(localStorage.getItem('progressUpdateQueue') || '[]');
      offlineQueue.push({ userId, metrics, timestamp: new Date().toISOString() });
      localStorage.setItem('progressUpdateQueue', JSON.stringify(offlineQueue));
    } else {
      throw error;
    }
  }
};

// Process any queued updates when back online
const processOfflineQueue = async () => {
  if (!navigator.onLine) return;

  const queueStr = localStorage.getItem('progressUpdateQueue');
  if (!queueStr) return;

  const queue = JSON.parse(queueStr);
  if (queue.length === 0) return;

  console.log(`Processing ${queue.length} queued progress updates`);

  // Create a new queue for any items that fail to process
  const newQueue = [];

  for (const item of queue) {
    try {
      await progressAPI.getMetrics();
    } catch (error) {
      console.error("Failed to process queued update:", error);
      newQueue.push(item);
    }
  }

  // Save any failed updates back to the queue
  localStorage.setItem('progressUpdateQueue', JSON.stringify(newQueue));
};

// Set up a listener to process the queue when the app comes back online
window.addEventListener('online', () => {
  console.log("App is back online, processing queued updates");
  processOfflineQueue();
});
