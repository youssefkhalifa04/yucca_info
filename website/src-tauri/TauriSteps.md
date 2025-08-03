
# 🖥️ Tauri + React + Vite Desktop App

## 📋 Summary
This guide outlines how to integrate an existing Vite + React + TypeScript project with **Tauri** to create a cross-platform desktop app.

---

## ✅ Prerequisites
- Node.js ✅
- Rust (`rustc 1.88.0`) ✅

---

## 🛠️ Steps Followed

### 1. 📁 Project Setup
- Navigated to an existing **Vite + React + TypeScript** project.
- Verified the project structure and dependencies.

### 2. ⚙️ Tauri Installation

Installed Tauri CLI globally:
```bash
npm install -g @tauri-apps/cli
Installed Tauri API in the project:

bash
Copy
Edit
npm install @tauri-apps/api
Initialized Tauri:

bash
Copy
Edit
npx @tauri-apps/cli init
3. 📝 Configuration
Updated tauri.conf.json located at:

makefile
Copy
Edit
c:\Users\foued\Desktop\website\src-tauri\tauri.conf.json
Changes made:

Set distDir to "../dist" (Vite’s output directory)

Set devPath to "http://localhost:8080" (Vite dev server)

Updated bundle identifier to: "com.eggincubator.app"

4. 📦 package.json Scripts
Added new scripts for Tauri:

json
Copy
Edit
"scripts": {
  "tauri": "tauri",
  "desktop": "tauri dev",
  "desktop:build": "tauri build"
}
5. 🚀 Development
Start the Tauri desktop app in development mode:

bash
Copy
Edit
npm run desktop
6. 🛠️ Building the App
Build the Windows executable:

bash
Copy
Edit
npm run desktop:build
📦 Output
After building, the application will be available in:

Standalone Executable:
src-tauri/target/release/app.exe

Installer (MSI):
src-tauri/target/release/bundle/msi/app_0.1.0_x64_en-US.msi

📌 Next Steps
Test the installer and app on your target machine.

Sign the installer if needed.

Share the installer or bundle for distribution.

vbnet
Copy
Edit

Let me know if you'd like a multilingual version or a folder diagram!







Do