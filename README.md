# 💱 RUB→KRW Currency Exchange Calculator

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/choivadims-projects/v0-rub-to-krw-calculator)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A sophisticated currency exchange calculator for converting Russian Rubles (RUB) to Korean Won (KRW) with multiple transfer methods, real-time rate comparison, and arbitrage analysis.

## ✨ Features

### 🔄 Multiple Transfer Methods
- **Mid-Market Rate**: Theoretical ideal exchange rate
- **P2P Method**: Peer-to-peer cryptocurrency exchange (RUB→USDT→KRW)
- **Korona + E9Pay**: Traditional remittance service combination
- **Gmoneytrans**: Direct money transfer service

### 📊 Advanced Analytics
- **Real-time Rate Comparison**: Compare all methods side-by-side
- **Arbitrage Calculator**: Full-cycle arbitrage analysis (RUB→USDT→KRW→USDT→RUB)
- **Loss Analysis**: Calculate losses vs mid-market rates
- **Waterfall Visualization**: Step-by-step transaction flow analysis
- **Interactive Charts**: Visual comparison of exchange methods

### 🎨 User Experience
- **Bilingual Support**: English and Russian interfaces
- **Dark/Light Theme**: Automatic theme switching
- **Responsive Design**: Mobile-first, works on all devices
- **PWA Ready**: Progressive Web App with offline capabilities
- **Local Storage**: Saves your preferences and inputs

### 🔧 Professional Features
- **CSV Export**: Export calculations for record-keeping
- **Copy Summary**: Quick sharing of results
- **Auto-save**: Automatic saving of user inputs
- **Rate Monitoring**: Track exchange rate trends
- **Fee Calculator**: Comprehensive fee analysis including fixed and percentage fees

## 🚀 Live Demo

**[View Live Application →](https://vercel.com/choivadims-projects/v0-rub-to-krw-calculator)**

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Geist Sans & Mono](https://vercel.com/font)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Deployment**: [Vercel](https://vercel.com/)

## 📁 Project Structure

```
├── app/
│   ├── arbitrage-calculator/     # Full arbitrage cycle calculator
│   │   └── page.tsx
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main calculator page
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── switch.tsx
│   ├── comparison-chart.tsx     # Rate comparison visualization
│   ├── number-input.tsx         # Custom number input component
│   ├── results-card.tsx         # Results display component
│   └── theme-provider.tsx       # Theme management
├── lib/
│   ├── formatters.ts            # Currency and number formatting
│   └── utils.ts                 # Utility functions
├── public/
│   ├── manifest.json            # PWA manifest
│   └── [icons...]               # App icons and assets
└── styles/
    └── globals.css              # Additional global styles
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rub-to-krw-calculator.git
   cd rub-to-krw-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 💡 Usage

### Basic Currency Conversion
1. Enter the RUB amount you want to convert
2. Adjust exchange rates for different methods
3. Compare results across all transfer methods
4. View detailed loss analysis vs mid-market rates

### Arbitrage Analysis
1. Navigate to the Arbitrage Calculator (`/arbitrage-calculator`)
2. Input rates and fees for each step of the cycle
3. Analyze potential profit/loss from full-cycle arbitrage
4. View waterfall analysis of losses per step

### Customization
- Toggle between English and Russian languages
- Switch between light and dark themes
- Save custom rate presets
- Export results as CSV

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic functionality.

### Customization
- **Colors**: Modify CSS variables in `app/globals.css`
- **Default Rates**: Update `defaultInputs` in respective page components
- **Localization**: Add new languages in the `strings` objects

## 📱 PWA Features

The application is configured as a Progressive Web App with:
- Offline functionality
- App-like experience on mobile devices
- Custom app icons and splash screens
- Installable on iOS and Android

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app) for rapid prototyping
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/rub-to-krw-calculator/issues) page
2. Create a new issue with detailed information
3. For urgent matters, contact the maintainers directly

---

**Made with ❤️ for the international transfer community**