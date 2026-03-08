# Next.js Login Page

A modern, responsive login page built with Next.js, React.js, and Tailwind CSS.

## Features

- 🎨 Modern UI design with Tailwind CSS
- 🔐 Email and password authentication
- 👁️ Password visibility toggle
- 🔄 Loading states
- 📱 Fully responsive design
- 🎯 Social login buttons (Google, GitHub)
- ✅ Remember me checkbox
- 🔗 Forgot password link
- 📝 Sign up link

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles with Tailwind
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Login page component
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## Technologies Used

- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Customization

### Colors
You can customize the primary color in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  }
}
```

### Styling
The login page uses Tailwind CSS classes for styling. You can modify the appearance by changing the classes in `app/page.tsx`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
