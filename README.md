🚚 Mini Delivery App — Offline-First React Native (Expo)

A production-minded offline-first delivery management application built with React Native + Expo + TypeScript.
The app supports local order creation without connectivity, data consolidation from multiple sources, and map-based delivery tracking with simulated real-time movement.

Designed to demonstrate architectural decision-making, state orchestration, and mobile systems thinking rather than only UI implementation.

✨ Key Capabilities

📦 Create delivery requests with address search

📴 Full offline order persistence using SQLite

🔄 Unified order list (mock + local database)

🏷️ Visual sync status indicators for offline data

🧭 Map-based tracking with animated marker movement

📍 Live device location as delivery origin

🧠 Deterministic route simulation without paid APIs

🔁 Pull-to-refresh data reconciliation

🧠 Architectural Highlights
Offline-First Data Strategy

Orders created without connectivity are stored in Expo SQLite, ensuring:

Durable persistence

Structured querying (not key-value)

Future background sync readiness

Each locally created order is tagged:

status: "offline"
syncStatus: "local"

This enables clear UI state, merge logic, and eventual consistency design.

Data Consolidation Layer

The hub screen merges:

In-memory mock dataset (simulated remote source)

SQLite persisted offline orders

This demonstrates handling heterogeneous data sources and building a single presentation model for UI.

State Management — Context over Redux

Used React Context intentionally:

Minimal boilerplate

Predictable shared state

Appropriate for app scope

Avoids premature over-engineering

This reflects a right-sizing mindset rather than tool-driven architecture.

Tracking Simulation Engine

Instead of relying on paid routing APIs, the tracking flow:

Captures device GPS as origin (expo-location)

Geocodes destination from address

Generates a polyline route

Decodes into coordinate steps

Animates marker along the path with timed updates

Auto-terminates at destination

This showcases algorithmic control of map state, not just rendering.

🗺️ Map & Movement Logic

Smooth camera follow using animateToRegion

Step-based coordinate interpolation

Deterministic interval scheduler

Automatic stop condition at final coordinate

This mimics real delivery telemetry while remaining fully local.

🧰 Technology Choices
Technology Rationale
Expo Fast iteration, native APIs, reduced setup overhead
TypeScript Strong typing for order models and DB mapping
Expo SQLite Relational offline storage, scalable beyond AsyncStorage
React Context Lightweight global state without unnecessary complexity
react-native-maps Mature, performant native map rendering
expo-location Reliable cross-platform GPS access
Google Places Autocomplete Accurate address input UX
@mapbox/polyline Efficient route decoding for animation
expo-network Online/offline awareness for save logic
axios Prepared for future sync layer
🔁 Order Lifecycle

User creates request

Network check:

Online → (ready for API integration)

Offline → stored in SQLite

Hub merges datasets

Unsynced orders flagged visually

“In Transit” orders open tracking view

This mirrors real production delivery flows.

🎯 Evaluation Alignment

This implementation focuses on:

Architectural clarity → offline-first, merge layer, deterministic tracking

Problem solving → local persistence, data reconciliation, route simulation

Code quality → typed models, isolated DB module, reusable logic

Scalability thinking → sync-ready schema, network abstraction

User experience → immediate offline feedback, smooth map animation

⚙️ Run the Project
npm install
npx expo start

Works on:

Android device / emulator

iOS simulator (macOS)

Expo Go

🔮 Production-Ready Extensions

Background sync queue for offline orders

Server reconciliation & conflict handling

Real routing API with ETA calculation

WebSocket live tracking

Distance-based interpolation instead of fixed steps

👨‍💻 Author

Utshav Nepal
React Native Developer
