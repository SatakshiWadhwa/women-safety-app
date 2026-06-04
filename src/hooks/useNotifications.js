import { useState } from "react";
import API from "../api/api";

export function useNotifications() {
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const subscribe = async () => {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setError("Push notifications not supported in this browser.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Notification permission denied.");
        return;
      }

      const res = await API.get("/notifications/vapid-key");
      const vapidPublicKey = res.data.publicKey;

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      await API.post("/notifications/subscribe", subscription);
      setSubscribed(true);
    } catch (err) {
      setError("Failed to enable notifications: " + err.message);
    }
  };

  const sendNotification = async (title, body) => {
    try {
      await API.post("/notifications/send", { title, body });
    } catch (err) {
      console.error("Failed to send notification:", err);
    }
  };

  return { subscribe, subscribed, sendNotification, error };
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
