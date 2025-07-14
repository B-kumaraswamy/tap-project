#  Budget Visualizer

A simple React + TypeScript app that visualizes your expenses as a pie chart and showcases five browser APIs:

* **Canvas API**: Draws an interactive pie chart of expenses.
* **Intersection Observer API**: Lazy‑mounts and animates the chart on scroll.
* **Network Information API**: Shows offline/slow‑2G banners.
* **Geolocation API** & **Reverse Geocoding**: Displays your location as a human‑readable place name.
* **Background Tasks API** (`requestIdleCallback`): Cleans up expense entries older than 30 days in the background.

## 🛠 Tech Stack

* **Framework**: React 18 + TypeScript
* **Bundler**: Vite
* **Styling**: Tailwind CSS 

## Installation

```bash
git clone <repo-url>
cd tap-assignment
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

##  Usage

1. **Mock Data**: On first load, the app seeds with 5 mock expenses.
2. **Pie Chart**: Scroll down to reveal and animate the chart.
3. **Dark/Light Mode**: Toggle via the button in the header.
4. **Location**: Allow geolocation to see your place name fetched in real time.
5. **Network Banners**: Simulate offline/2G in DevTools → Network to see status messages.
6. **Cleanup**: Expenses older than 30 days are pruned automatically when the browser is idle.

### Testing the 30-day Cleanup

To verify the automatic pruning of expenses older than 30 days:

1. **Open DevTools** and switch to the **Application** panel.
2. Under **Local Storage ▶ [http://localhost:5173](http://localhost:5173)**, locate the **expenses** key.
3. **Edit Value** (right-click the cell) and change any expense’s `date` to more than 30 days in the past (e.g., `2025-05-01`). Press **Enter** to save.
4. **Reload** the page without clearing DevTools.
5. Observe that the back-dated expense is removed from both the pie chart and the stored data.


After reload, you’ll see the old entry vanish from the chart, confirming the cleanup logic.
