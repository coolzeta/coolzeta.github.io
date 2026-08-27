# Zeta's Portfolio Website

A modern, interactive portfolio website showcasing Web3, AI, and frontend development projects. Built with Next.js 16, Material-UI, and Framer Motion for smooth animations and 3D effects.

🌐 **Live Site:** [https://coolzeta.github.io](https://coolzeta.github.io)

## ✨ Features

- **🎨 Modern UI/UX**: Advanced animations with parallax scrolling, 3D card effects, and smooth transitions
- **🌍 Bilingual Support**: Full English and Chinese (简体中文) localization with CSV-based translation system
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🔗 Web3 Showcase**: Interactive DApp portfolio with project details and demos
- **📝 Blog System**: MDX-powered blog with syntax highlighting and dynamic content
- **🎯 Career Timeline**: Visual journey through professional milestones
- **🚀 Tech Stack Display**: Showcasing Web3, AI, and frontend technologies

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: Material-UI (MUI) v6
- **Animation**: Framer Motion
- **Language**: TypeScript
- **Styling**: Emotion (CSS-in-JS)

### Content & Localization
- **i18n**: next-intl with CSV → JSON compilation workflow
- **Blog**: MDX with syntax highlighting (Prism.js)
- **Markdown**: Gray Matter, Remark GFM

### Web3 Integration
- **Library**: Web3.js
- **Smart Contracts**: Solidity integration examples

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/coolzeta/coolzeta.github.io.git

# Navigate to project directory
cd coolzeta.github.io

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Build
npm run build        # Compile i18n translations and build for production
npm run i18n:compile # Compile CSV translations to JSON

# Production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🌐 Internationalization (i18n)

This project uses a **CSV → JSON compilation workflow** for translations:

### Translation Workflow

1. **Edit translations** in `app/locales/translations.csv` (source of truth)
2. **Compile translations** to JSON:
   ```bash
   npm run i18n:compile
   ```
3. **Generated files**:
   - `app/locales/en/common.json` (English)
   - `app/locales/zh/common.json` (Chinese)

⚠️ **Important**: Never edit the JSON files directly. Always edit `translations.csv` and recompile.

### Adding New Translations

1. Open `app/locales/translations.csv`
2. Add new row: `key,English,中文`
3. Run `npm run i18n:compile`
4. Use in components: `t('your.new.key')`

## 📁 Project Structure

```
coolzeta.github.io/
├── app/
│   ├── [locale]/              # Localized routes (en/zh)
│   │   ├── page.tsx           # Landing page
│   │   └── apps/
│   │       ├── blog/          # Blog posts
│   │       └── playground/    # Independent tools
│   ├── components/            # Reusable components
│   │   ├── AppLayout.tsx      # Fixed header with scroll effects
│   │   ├── Card3D.tsx         # 3D tilt card component
│   │   ├── ParallaxSection.tsx # Parallax wrapper
│   │   ├── Timeline.tsx       # Career timeline
│   │   ├── TechShowcase.tsx   # Tech stack display
│   │   └── DAppsList.tsx      # DApp cards
│   ├── locales/
│   │   ├── translations.csv   # 🔑 Source of truth for translations
│   │   ├── en/common.json     # Generated English translations
│   │   └── zh/common.json     # Generated Chinese translations
│   ├── theme/
│   │   └── theme.ts           # Black-green color theme
│   └── config/
│       └── dapps.ts           # DApp configuration
├── content/
│   └── blog/                  # MDX blog posts
├── addons/
│   └── i18nCompiler.js        # CSV → JSON compiler
└── public/                    # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#4caf50`
- **Light Green**: `#81c784`, `#a5d6a7`
- **Dark Background**: `#000000`, `#121212`
- **Accent**: Green gradients with glassmorphism effects

### Key Components
- **Card3D**: Interactive 3D tilt cards with mouse tracking
- **ParallaxSection**: Smooth parallax scrolling effects
- **Timeline**: Animated career journey visualization
- **TechShowcase**: Categorized technology stack display

## 📝 Adding New Content

### Adding a Blog Post

1. Create new MDX file in `content/blog/`:
   ```markdown
   ---
   title: "Your Post Title"
   date: "2025-01-22"
   excerpt: "Brief description"
   ---
   
   Your content here...
   ```

2. Post will automatically appear on the blog page

### Adding a Tool

1. Edit `app/config/dapps.ts`:
   ```typescript
   {
     id: 'your-dapp',
     nameKey: 'dapp.yourDapp.name',
     descriptionKey: 'dapp.yourDapp.description',
     status: 'live',
     tags: ['DeFi', 'NFT'],
     imageUrl: '/images/your-dapp.png',
     url: '/tools/your-tool'
   }
   ```

2. Add translations to `app/locales/translations.csv`
3. Run `npm run i18n:compile`

## 🔧 Build & Deployment

### Build for Production

```bash
npm run build
```

This will:
1. Compile i18n translations from CSV to JSON
2. Run TypeScript type checking
3. Build optimized Next.js production bundle
4. Generate static pages for SSG routes

### Deploy to GitHub Pages

The site is automatically deployed to GitHub Pages from the `master` branch.

Manual deployment:
```bash
npm run build
# Push to master branch
git push origin master
```

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Zeta Zhang**
- GitHub: [@coolzeta](https://github.com/coolzeta)
- LinkedIn: [Zeta Zhang](https://www.linkedin.com/in/zeta-zhang-98065334b/)

---

Built with ❤️ using Next.js, Material-UI, and Framer Motion
