# Triskeloum Theme - Quick Start Guide

## 🎨 Quick Reference

### Color Classes (Tailwind)

#### Backgrounds
```jsx
// Dark mode backgrounds
<div className="dark:bg-bg-primary">     {/* Pure black #000000 */}
<div className="dark:bg-bg-secondary">   {/* #0a0a0a */}
<div className="dark:bg-bg-tertiary">    {/* #1a1a1a */}
<div className="dark:bg-bg-elevated">    {/* #1f2937 */}
```

#### Text Colors
```jsx
<p className="dark:text-text-primary">    {/* White #ffffff */}
<p className="dark:text-text-secondary">  {/* #d1d5db */}
<p className="dark:text-text-tertiary">   {/* #9ca3af */}
<p className="dark:text-text-accent">     {/* Gold #D4AF37 */}
```

#### Primary Colors (Gold/Amber)
```jsx
<div className="bg-primary-500">   {/* #FFD700 - Pure Gold */}
<div className="bg-primary-600">   {/* #D4AF37 - Ancient Gold */}
<div className="bg-primary-700">   {/* #B8860B - Dark Goldenrod */}

<div className="bg-gold">          {/* #D4AF37 */}
<div className="bg-gold-light">    {/* #FFD700 */}
<div className="bg-gold-dark">     {/* #B8860B */}
```

#### Borders
```jsx
<div className="dark:border-border">       {/* #374151 */}
<div className="dark:border-border-light"> {/* #4b5563 */}
```

### Gradients
```jsx
<div className="bg-gradient-gold">              {/* Gold gradient */}
<div className="bg-gradient-amber">             {/* Amber gradient */}
<button className="bg-gradient-to-r from-amber-600 to-amber-800">
```

### Animations
```jsx
<svg className="animate-spin-slow">      {/* 30s rotation */}
<div className="animate-float">          {/* Floating effect */}
<div className="animate-scroll-dot">     {/* Scroll indicator */}
<div className="animate-bounce-slow">    {/* Gentle bounce */}
```

### Shadows
```jsx
<div className="shadow-gold">      {/* Gold glow */}
<div className="shadow-gold-lg">   {/* Larger gold glow */}
<div className="shadow-amber">     {/* Amber shadow */}
```

---

## 🔧 Using the Theme

### In React Components

#### Toggle Theme
```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

#### Check if Dark Mode
```tsx
import { useIsDark } from './contexts/ThemeContext';

function MyComponent() {
  const isDark = useIsDark();

  return <div>{isDark ? 'Dark mode active' : 'Light mode active'}</div>;
}
```

#### Use Theme Toggle Button
```tsx
import ThemeToggle from './components/ThemeToggle';

function Navbar() {
  return (
    <nav>
      <ThemeToggle showLabel={true} />
    </nav>
  );
}
```

---

## 📋 Common Patterns

### Card Component
```tsx
<div className="bg-white dark:bg-bg-tertiary border border-gray-200 dark:border-border rounded-lg p-4">
  <h3 className="text-gray-900 dark:text-text-primary">Title</h3>
  <p className="text-gray-600 dark:text-text-secondary">Description</p>
</div>
```

### Button (Primary)
```tsx
<button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-gold">
  Click Me
</button>
```

### Input Field
```tsx
<input
  className="w-full px-4 py-2 bg-white dark:bg-bg-secondary border border-gray-300 dark:border-border text-gray-900 dark:text-text-primary rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-colors"
  placeholder="Enter text..."
/>
```

### Modal/Dialog
```tsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm">
  <div className="bg-white dark:bg-bg-tertiary border dark:border-border rounded-xl p-6 max-w-md mx-auto mt-20">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-4">
      Modal Title
    </h2>
    <p className="text-gray-600 dark:text-text-secondary">
      Modal content...
    </p>
  </div>
</div>
```

### Navigation Link
```tsx
<a
  href="#"
  className="text-gray-700 dark:text-text-secondary hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
>
  Link Text
</a>
```

---

## 🎯 Design Tokens (CSS Variables)

Use these in custom CSS:

```css
.my-component {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}

.my-button {
  background-color: var(--color-primary);
}
```

Available variables:
- `--color-primary` - #D4AF37
- `--color-primary-light` - #FFD700
- `--color-primary-dark` - #B8860B
- `--color-bg-primary` - #000000
- `--color-bg-secondary` - #0a0a0a
- `--color-bg-tertiary` - #1a1a1a
- `--color-bg-elevated` - #1f2937
- `--color-text-primary` - #ffffff
- `--color-text-secondary` - #d1d5db
- `--color-text-tertiary` - #9ca3af
- `--color-text-muted` - #6b7280
- `--color-border` - #374151
- `--color-border-light` - #4b5563

---

## 🌟 Best Practices

### 1. Always Consider Both Modes
When styling a new component, test both light and dark modes:
```tsx
// ✅ Good
<div className="bg-white dark:bg-bg-tertiary text-gray-900 dark:text-text-primary">

// ❌ Bad (only works in light mode)
<div className="bg-white text-gray-900">
```

### 2. Use Semantic Colors
```tsx
// ✅ Good (uses theme colors)
<button className="dark:bg-bg-tertiary dark:text-amber-400">

// ❌ Bad (hardcoded colors)
<button className="bg-gray-800 text-yellow-500">
```

### 3. Maintain Consistent Spacing
```tsx
// ✅ Good (uses theme spacing)
<div className="p-4 space-y-4">

// ❌ Bad (random values)
<div className="p-3.5 space-y-4.5">
```

### 4. Gold Accents for Interactive Elements
Use gold/amber colors for:
- Primary buttons
- Links on hover
- Active states
- Focus indicators
- Important icons

### 5. Smooth Transitions
Always add transitions for theme-aware properties:
```tsx
<div className="transition-colors duration-300">
```

---

## 🐛 Troubleshooting

### Theme Not Applying
1. Check if `ThemeProvider` wraps your app in [App.tsx](src/App.tsx#L32)
2. Verify `<html>` has `dark` class when in dark mode
3. Ensure Tailwind config includes `darkMode: 'class'`

### Colors Look Wrong
1. Check if component uses dark mode classes
2. Verify CSS variables are defined in [App.css](src/App.css#L4-L17)
3. Make sure Ant Design overrides are loaded

### Toggle Not Working
1. Import `useTheme` from correct path
2. Check if `ThemeContext` is provided
3. Verify localStorage permissions

---

## 📦 File Structure

```
src/
├── config/
│   └── theme.ts                    # Theme configuration
├── contexts/
│   └── ThemeContext.tsx            # Theme provider & hooks
├── components/
│   └── ThemeToggle.tsx             # Toggle button component
├── App.tsx                         # ThemeProvider wrapper
├── App.css                         # Dark mode CSS overrides
├── index.css                       # Base styles
└── tailwind.config.js              # Tailwind extensions
```

---

## 🚀 Getting Started Checklist

- [x] ThemeProvider added to App.tsx
- [x] Tailwind config extended with theme colors
- [x] App.css dark mode overrides added
- [x] Theme toggle added to Navbar
- [x] All components support dark mode
- [x] Documentation created

---

## 📞 Need Help?

Refer to the complete documentation in [THEME_IMPLEMENTATION.md](./THEME_IMPLEMENTATION.md)

---

**Happy Theming! 🎨✨**
