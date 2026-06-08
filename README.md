# Whaatachi - Premium Habesha Compatibility Platform

Whaatachi is Ethiopia’s safest, highest-integrity matching and community platform. It is designed specifically to help Habesha singles discover authentic relationships, high-quality friendships, and secure connections. Whaatachi prioritizes user security and high-authenticity profiles, helping members browse real candidates in Addis Ababa, Hawassa, Bahir Dar, and beyond, with offline verification and integrated telebirr/CBE Birr secure contact unlocking.

---

## 🌟 Key Features

### 1. Separate Landing Pages (Before vs. After Login)
*   **Aesthetic Home (Guest View)**: High-fidelity presentation displaying VIP profiles, interactive platform statistics, testimonials, safety instructions, and clean registration/sign-in flows.
*   **Interactive Hub Dashboard (Logged-in View)**: A personalized panel displaying the user's active connection trust level, lifetime membership counters, and a curated list of compatible recommendations of the opposite gender.

### 2. Live Profile Customization
*   **Virtual Identity Card**: Logged-in users can update their profile bio instantly with local cache preservation.
*   **Dynamic Matching Status**: Real-time toggling of live statuses—choose between **Active (Online)**, **Quiet (Offline)**, or **Recent (Recently Active)**.
*   **Locker Registration Data**: Transparent verification showing partial phone numbers and direct Telegram handles ensuring secure identity management.

### 3. Discover Matches Dashboard
*   **Advanced Semantic Filter Engine**: Search and filter cards by specific cities (Addis Ababa, Adama, Hawassa, Bahir Dar, Dire Dawa, Gondar), genders, and relationship intents (True Relationship, Friendship, Friends with Benefits).
*   **Contextual Carousel "Pro Tip" Box**: A rolling slider showing dynamic, helpful tricks for writing irresistible bios, staying safe over Telegram, selecting high-quality profile photos, constructing polite initial greetings, and identifying scams.

### 4. Interactive Private Credentials Locker
*   **Simulated Secure Handshake**: Verify identity handles with mock telebirr or Commercial Bank of Ethiopia (CBE) Birr payment gateways.
*   **Unlock History Log**: A private page showing historical details of successfully unlocked candidates along with direct copy-to-clipboard Telegram handles and telephone vectors.

### 5. Multi-Mode Design Language
*   **Modern Ambient Dark Mode**: Fully responsive dark mode paired with warm slate-gray tones and delicate golden and pink brand accents.
*   **Fluid Visual Enhancements**: Crafted with Tailwind CSS and premium animations imported from React Motion.

---

## 📂 Project Directory Structure

```text
├── src/
│   ├── main.tsx              # Main entry point bootstrapping React + Vite
│   ├── App.tsx               # Primary layout controller, view routers & state engine
│   ├── index.css             # Global stylesheet configured with modern Tailwind v4
│   ├── types.ts              # TypeScript interface definitions (Profile, PaymentRequest, etc.)
│   ├── components/           # Modular visual components
│   │   ├── Header.tsx        # Dynamic navigation header supporting dark mode and profile info
│   │   ├── Footer.tsx        # Standard footer controls
│   │   ├── ProfileCard.tsx   # Visual grid-profile representation with unlock states
│   │   ├── AuthModal.tsx     # Sign-in & profile registration overlay
│   │   └── PaymentModal.tsx  # telebirr & CBE Birr verification modal
│   └── views/                # Full-screen view modules
│       ├── HomeLanding.tsx   # Landing home display for guest visitors
│       ├── HomeLoggedIn.tsx  # Dynamic dashboard hub showing custom user profile & recommendations
│       ├── Dashboard.tsx     # Search platform & rotating safety rotating Pro Tips
│       ├── UnlockHistory.tsx # Wallet history containing unlocked Telegram / phone handles
│       ├── FaqSection.tsx    # Technical support guidelines and safe-dating FAQ
│       └── AdminPanel.tsx    # Operational verification screen to approve or deny penning locks
├── package.json              # Script configurations and library dependencies
├── tailwind.config.js        # Core style utility extensions
└── vite.config.ts            # Vite bundler options and plugins
```

---

## 🛠️ Local Development & Setup

Follow these steps to run the application on your local machine:

### Prerequisites
*   **Node.js**: Ensure you have Node.js version 18.x or above installed.
*   **npm**: Package manager typically bundled with Node.js.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd whaatachi-app
```

### 2. Install Project Dependencies
Run the package installation command to pull down required modules:
```bash
npm install
```

### 3. Start the Development Server
Execute the standard host-bound script to spin up the local server inside Vite:
```bash
npm run dev
```
The server will boot and display the interactive platform on:
👉 `http://localhost:3000` (or the custom port printed in your shell output).

### 4. Build and Compile for Production
To bundle the client-side single page application into standard optimized static assets within `/dist`:
```bash
npm run build
```

### 5. Lint and Type-Checking
Validate code syntax and compile safety by running:
```bash
npm run lint
```

---

## 🛡️ Safer Connections Protocol

Whaatachi strives to prevent bad actors and bots. Keep the following matching principles in mind during your sessions:
1.  **Stay Digital First**: Chat over Telegram or WhatsApp secured handles before sharing direct physical locations.
2.  **No Financial Pre-payments**: Avoid sending money or cash advance requests for bus fares, phone cards, or registration fees to any individual.
3.  **Report Instantly**: Use the Support/Faq panel to request review or report profiles that breach our community guidelines.
