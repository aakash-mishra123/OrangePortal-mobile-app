import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { pwaManager } from "./lib/pwa";

// Initialize PWA features
if (typeof window !== 'undefined') {
  console.log('PWA Manager initialized');
  
  // Request notification permission after user interaction
  document.addEventListener('click', async () => {
    await pwaManager.requestNotificationPermission();
  }, { once: true });
}

createRoot(document.getElementById("root")!).render(<App />);
