# 🌐 GeoSpot - Modern IP & Leak Tester

[![Platform](https://img.shields.io/badge/Platform-Chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.google.com/chrome/)
[![Platform](https://img.shields.io/badge/Platform-Firefox-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://www.mozilla.org/firefox/browsers/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A sleek, modern, and transparent privacy dashboard for your browser. GeoSpot provides an instant, live analysis of your IP address, geolocation, DNS leaks, and WebRTC leaks for both **Chrome** and **Firefox**.

<p align="center">
  <img src="https://i.imgur.com/4fX7K8i.png" alt="GeoSpot Popup Screenshot" width="400">
  <br>
  <em>(Replace this with your own screenshot)</em>
</p>

---

## ✨ Key Features

* **Cross-Browser Support:** Fully functional on both Google Chrome and Mozilla Firefox.
* **Live IP & Geolocation:** Instantly view your current public IP address, city, and country.
* **Live DNS Leak Test:** Automatically checks if your DNS queries are leaking and reveals the ISP of the leaking server.
* **Transparent WebRTC Leak Test:** Performs a live test to see if your browser is leaking your real IP via WebRTC. If a leak is detected, the leaking IP is shown as proof.
* **Dynamic Country Icon:** The extension icon is a dynamic, code-generated badge showing the two-letter country code of your current IP. It updates automatically.
* **Modern & Minimalist UI:** A clean, visually appealing interface with a custom background and a locked-down, app-like feel.
* **Zero Configuration:** Works out of the box with no settings to configure.

---

## 🚀 Installation

You can load this extension in developer mode in your browser of choice.

### For Google Chrome

1.  **Download:** Download or clone the repository and find the `GeoSpot-Chrome` folder.
2.  **Open Chrome Extensions:** Open Google Chrome and navigate to `chrome://extensions`.
3.  **Enable Developer Mode:** In the top right corner, toggle on "Developer mode".
4.  **Load Unpacked:** Click the "Load unpacked" button.
5.  **Select Folder:** Select the `GeoSpot-Chrome` folder.

### For Mozilla Firefox

1.  **Download:** Download or clone the repository and find the `GeoSpot-Firefox` folder.
2.  **Open Firefox Debugging:** Open Firefox and navigate to `about:debugging`.
3.  **Select "This Firefox":** Click on the "This Firefox" tab on the left.
4.  **Load Temporary Add-on:** Click the "Load Temporary Add-on..." button.
5.  **Select File:** Navigate into the `GeoSpot-Firefox` folder and select the `manifest.json` file.

---

## 🛠️ How It Works

GeoSpot is built on the standard WebExtensions API, ensuring core functionality works seamlessly on both Chrome and Firefox with minimal manifest adjustments.

* **IP & Geolocation:** Fetches data from the reliable **ip-api.com** service.
* **DNS Leak Test:** Uses the **ipleak.net** JSON API to get a list of DNS servers.
* **WebRTC Leak Test:** Implemented using the `RTCPeerConnection` API to discover potential IP leaks.
* **Dynamic Icon:** The icon is generated on-the-fly using the **OffscreenCanvas API**.

---

## 📁 File Structure

The repository is structured with separate folders for each browser version to ensure compatibility. The core code (`popup.js`, `background.js`, `popup.html`) is identical in both.

```
GeoSpot-Project/
│
├── LICENSE
├── README.md
├── chrome/
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html
│   ├── popup.js
│   └── images/
│       └── background.jpg
│
└── firefox/
    ├── manifest.json   # (Slightly different for Firefox)
    ├── background.js
    ├── popup.html
    ├── popup.js
    └── images/
        └── background.jpg
```

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Created with ❤️ by GeekNeuron
</p>
