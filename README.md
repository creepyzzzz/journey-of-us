# Journey of Us 💕

A romantic couple-bonding web game built with Next.js, TypeScript, and Framer Motion. Create personalized love journeys with custom questions, dares, secrets, and memories to deepen your connection with your partner.

## ✨ Features

### 🎮 Game Levels
- **Welcome Screen** - Set up player names and choose game mode
- **Guessing Game** - Test how well you know each other
- **Mystery Cards** - Flip cards to reveal truths and dares
- **Question Deck** - Deep questions to connect your hearts
- **Secret Sharing** - Safe space to share secrets
- **Memory Lane** - Walk down memory lane together
- **Custom Questions** - Personalized questions just for you
- **Personality Sketch** - Discover more about each other
- **Romance Chamber** - Share beautiful romantic messages
- **Journey Summary** - Celebrate your completed journey

### 🛠️ Creator Features
- **Drag & Drop Editor** - Reorder questions, dares, and content with intuitive drag & drop
- **Versioning** - Track changes and maintain game versions
- **Publishing** - Share your games with shareable links and access codes
- **Preview Mode** - Test your games before publishing
- **Content Management** - Create, edit, and organize all game content

### 📱 Player Experience
- **Mobile-First Design** - Optimized for mobile devices with touch-friendly interface
- **Progressive Flow** - Smooth level progression with beautiful animations
- **Romantic Animations** - Floating hearts, sparkles, and romantic transitions
- **Responsive Design** - Works perfectly on all screen sizes
- **Accessibility** - Keyboard navigation and screen reader support

### 🎨 UI/UX
- **Romantic Theme** - Pastel gradients and warm, loving colors
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Card-Based Interface** - Beautiful card designs for each level
- **Progress Tracking** - Visual progress indicators throughout the journey
- **Customizable Content** - Full control over all game content and styling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/journey-of-us.git
   cd journey-of-us
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Optional: Supabase configuration for cloud sync
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Custom domain for production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏗️ Project Structure

```
journey-of-us/
├── app/                    # Next.js 13+ app directory
│   ├── editor/[id]/       # Game editor pages
│   ├── play/[slug]/       # Game player pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── editor/           # Editor-specific components
│   ├── levels/           # Game level components
│   ├── ui/               # Reusable UI components
│   └── ...               # Other components
├── lib/                  # Utility libraries
│   ├── schemas.ts        # Zod validation schemas
│   ├── store.ts          # Zustand state management
│   ├── storage.ts        # Local storage utilities
│   └── ...               # Other utilities
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── ...                   # Configuration files
```

## 🎯 Usage

### Creating a Game

1. **Start from Home** - Click "Create from Scratch" or "Use Starter Pack"
2. **Edit Content** - Use the editor to customize truths, dares, secrets, and memories
3. **Drag & Drop** - Reorder content by dragging items up and down
4. **Preview** - Test your game before publishing
5. **Publish** - Share your game with a custom link or access code

### Playing a Game

1. **Enter Love Code** - Use the access code provided by the creator
2. **Set Names** - Enter both player names on the welcome screen
3. **Choose Mode** - Select quick play or full journey
4. **Play Together** - Go through each level at your own pace
5. **Share Responses** - Take turns answering questions and completing challenges
6. **Celebrate** - Enjoy the summary screen and your completed journey

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run format       # Format code with Prettier

# Testing (coming soon)
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

### Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **UI Components**: Radix UI + Custom components
- **Validation**: Zod
- **Storage**: IndexedDB (local-first) + optional Supabase sync

### Key Dependencies

```json
{
  "next": "13.5.1",
  "react": "18.2.0",
  "typescript": "5.2.2",
  "framer-motion": "^12.23.22",
  "@dnd-kit/core": "^6.3.1",
  "zustand": "^5.0.8",
  "zod": "^3.23.8",
  "tailwindcss": "3.3.3"
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository** - Link your GitHub repository to Vercel
2. **Configure Environment** - Add environment variables in Vercel dashboard
3. **Deploy** - Automatic deployments on every push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify** - Use the Next.js build command
- **Railway** - Connect your GitHub repository
- **DigitalOcean App Platform** - Deploy with automatic builds
- **AWS Amplify** - Full-stack deployment with CI/CD

### Environment Variables for Production

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_key
```

## 🔧 Configuration

### Local-First vs Cloud Sync

The app works completely offline with local storage, but you can optionally enable cloud sync:

1. **Local-First (Default)** - All data stored in browser's IndexedDB
2. **Cloud Sync** - Optional Supabase integration for cross-device sync

### Customization

- **Themes**: Modify colors in `tailwind.config.ts`
- **Animations**: Adjust Framer Motion settings in components
- **Content**: Edit starter content in `lib/seed-data.ts`
- **Levels**: Customize level behavior in `components/levels/`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** - For beautiful animations
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For utility-first styling
- **Next.js** - For the amazing React framework
- **All Contributors** - Thank you for making this project better!

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features on GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions
- **Email**: Contact us at support@journeyofus.app

## 🗺️ Roadmap

### Upcoming Features
- [ ] **Multiplayer Mode** - Real-time collaborative gameplay
- [ ] **Custom Themes** - User-created visual themes
- [ ] **Analytics Dashboard** - Game performance insights
- [ ] **Mobile App** - Native iOS and Android apps
- [ ] **Voice Integration** - Voice-to-text for responses
- [ ] **Photo Sharing** - Add photos to memories and responses
- [ ] **Calendar Integration** - Schedule regular game sessions
- [ ] **AI-Powered Questions** - Generate personalized content

### Version History
- **v1.0.0** - Initial release with all core features
- **v1.1.0** - Enhanced animations and mobile experience
- **v1.2.0** - Drag & drop editor and import/export
- **v2.0.0** - Cloud sync and advanced sharing features

---

Made with 💕 for couples everywhere. Create your own love story today!
