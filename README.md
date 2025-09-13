# RHYTM

A modern AI-powered music curation platform for DJs. Discover, curate, and sync tracks effortlessly. Built with Next.js, TypeScript, and intelligent personalization.

## 🚀 Features

### Core Functionality
- **Discover**: Browse tracks with advanced filtering (genre, BPM, key) and sorting
- **Library**: Save and organize your favorite tracks
- **Collections**: Create curated playlists with tags and metadata
- **Export/Sync**: Automatic Beatport DJ sync or manual export (CSV, M3U, JSON)
- **Mini-Player**: Global audio player with preview support

### AI Personalization
- Learn your DJ style from listening habits and explicit preferences
- Natural language search ("vibes") that maps to filters and recommendations
- Personalized recommendations with explanations
- Cold start onboarding with genre, BPM, and artist preferences

### ToS Compliance
- No scraping or automated browsing
- Uses official Beatport endpoints when available
- Manual mode for user-provided URLs/IDs only
- Respects rate limits and implements proper backoff

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for server state (planned)
- **Lucide React** for icons

### Backend (Planned)
- **Supabase** for database and authentication
- **Next.js API Routes** for server logic
- **Beatport OAuth2** integration

### AI/ML (Planned)
- **OpenAI Embeddings** or local ONNX models
- **Vector search** with pgvector/Supabase Vector
- **Recommendation pipeline** with preference learning

## 📁 Project Structure

```
rhytm/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── collections/        # Collections pages
│   │   ├── export/            # Export & sync page
│   │   ├── library/           # Library page
│   │   ├── settings/          # Settings page
│   │   └── page.tsx           # Discover page (home)
│   ├── components/            # React components
│   │   ├── Collections/       # Collection-specific components
│   │   ├── Discover/          # Discovery & table components
│   │   └── Layout/            # Navigation and layout
│   ├── lib/                   # Utilities and business logic
│   │   ├── stores/            # Zustand state stores
│   │   └── sampleData.ts      # Mock data for development
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── ...config files
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with HTML5 audio support

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd rhytm
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development

The app includes sample data for development and testing. Key features you can try:

1. **Discover Page**: Browse sample tracks, use filters, and sort columns
2. **Mini-Player**: Click play buttons (▶) to test audio preview functionality
3. **Library**: Add tracks to your personal library
4. **Collections**: Create playlists and organize tracks
5. **Export**: View export options and sync status

## 🎯 Current Status

### ✅ Completed (MVP)
- [x] Project setup with Next.js, TypeScript, Tailwind
- [x] Core type definitions and data models
- [x] Main layout with sticky navigation and mini-player
- [x] Discover page with table layout and filters
- [x] Library and Collections pages
- [x] Basic state management with Zustand
- [x] Sample data and filtering/sorting logic
- [x] Export and Settings pages (UI only)

### 🚧 In Progress
- [ ] Mini-player HTML5 audio implementation
- [ ] Supabase database setup
- [ ] Beatport OAuth2 integration
- [ ] AI personalization pipeline
- [ ] Export functionality (CSV, M3U, JSON)
- [ ] Offline support with IndexedDB
- [ ] Comprehensive testing

### 📋 Planned Features
- [ ] Real Beatport API integration
- [ ] Advanced AI recommendations
- [ ] Natural language search
- [ ] Drag-and-drop collection reordering
- [ ] Waveform visualization
- [ ] Progressive Web App (PWA) support
- [ ] Admin dashboard and analytics

## 🧪 Testing

### Manual Testing Checklist

**Discover Page:**
- [ ] Filters work correctly (genre, BPM, key)
- [ ] Column sorting toggles asc/desc
- [ ] Play button updates mini-player
- [ ] Add to Library/Collection actions work

**Library:**
- [ ] Shows saved tracks
- [ ] Filters apply to library tracks
- [ ] Empty state displays correctly

**Collections:**
- [ ] Create new collections
- [ ] View collection details
- [ ] Add tracks to collections
- [ ] Delete collections (with confirmation)

**Mini-Player:**
- [ ] Displays current track info
- [ ] Play/pause controls work
- [ ] Volume and progress controls
- [ ] Handles tracks without preview URLs

### Automated Testing (Planned)
- Unit tests for stores and utilities
- Integration tests for key user flows
- E2E tests with Playwright
- AI evaluation for recommendations

## 🔒 Privacy & Compliance

- **Local-first**: User data stored locally, never shared
- **ToS Compliant**: No scraping, only official APIs
- **Manual Mode**: Complete ToS compliance option
- **Data Export**: Users can export all their data
- **Profile Reset**: Clear all learned preferences

## 🤝 Contributing

This is a practice project, but contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🎵 About

Built as a comprehensive example of modern web development with AI integration, demonstrating:
- Clean architecture and type safety
- Responsive design and accessibility
- State management patterns
- API integration best practices
- AI/ML integration in web apps
- Terms of Service compliance

Perfect for learning Next.js, TypeScript, and building music/DJ applications!