# FoodLens 

FoodLens is an AI-driven web application that helps users **understand food products instantly** by analyzing product images. It converts complex food labels into **clear, actionable insights** such as ingredient quality, nutritional value, health impact, sustainability, and healthier alternatives.

The project focuses on **clarity, usability, and scalability**, combining a modern frontend with serverless AI-powered backend logic.

---

# Key Capabilities

- Image-based food product analysis
- AI-generated health score & explanation
- Ingredient classification (harmful, beneficial, allergens)
- Detailed nutrition breakdown
- Environmental & sustainability insights
- Healthier homemade alternatives with cost comparison
- Commercial product comparisons
- Modern animated UI with clean UX

--

# Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Three.js (animated shader background)

### Backend / AI
- Supabase Edge Functions (Deno)
- AI Vision & Language Models (provider-agnostic)

### Platform
- Supabase (Auth, Functions)
- Modular component architecture


---

##  Project Structure (Important Files Only)

```text
foodlens/
│
├── public/
│   └── favicon.png
│
├── src/
│   │
│   ├── pages/
│   │   ├── Index.tsx        # Main application page
│   │   ├── Login.tsx        # Authentication page
│   │   └── NotFound.tsx     # 404 fallback
│   │
│   ├── components/
│   │   ├── UploadSection.tsx     # Image upload entry point
│   │   ├── ImageGallery.tsx      # Uploaded image preview & handling
│   │   ├── InfoInput.tsx         # User prompt & input logic
│   │   ├── ResultsDisplay.tsx    # AI analysis output renderer
│   │   ├── HistoryPanel.tsx      # Previous analysis history
│   │   ├── NavigationDock.tsx    # App navigation
│   │   └── animated-characters-login-page.tsx
│   │
│   ├── components/ui/
│   │   └── (Reusable UI system – buttons, dialogs, inputs, etc.)
│   │
│   ├── hooks/
│   │   └── useAuth.ts        # Authentication & session logic
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts     # Supabase client
│   │       └── types.ts      # Supabase types
│   │
│   ├── lib/
│   │   └── utils.ts          # Shared helpers & utilities
│   │
│   ├── App.tsx               # App layout & routing
│   ├── main.tsx              # React entry point
│   └── index.css             # Global styles
│
├── supabase/
│   ├── functions/
│   │   ├── analyze-product/
│   │   │   └── index.ts      # Core AI food analysis logic
│   │   │
│   │   └── ai-chat/
│   │       └── index.ts      # AI conversation / reasoning support
│   │
│   ├── migrations/           # Database migrations
│   └── config.toml           # Supabase configuration
│
├── .env                      # Environment variables
├── index.html                # HTML entry
├── package.json              # Scripts & dependencies
├── tailwind.config.ts        # Tailwind configuration
├── vite.config.ts            # Vite configuration
└── README.md
