# 13 - Internationalization (i18n)

## Overview

The application supports two languages:

| Code | Language | Flag | Direction |
|------|----------|------|-----------|
| `en` | English | US flag | LTR |
| `tl` | Tagalog | PH flag | LTR |

English is the default language. The user's preference is stored in `localStorage`.

## Architecture

### Translation Files

**Location**: `src/locales/`

- `src/locales/en.json` - English translations
- `src/locales/tl.json` - Tagalog translations

These are JSON files with nested key-value pairs:

```json
{
  "nav": {
    "home": "Home",
    "configurator": "Configurator",
    "about": "About",
    "faq": "FAQ",
    "contact": "Contact",
    "login": "Sign In"
  },
  "footer": {
    "company": "Company",
    "products": "Products",
    "support": "Support",
    "newsletter": "Stay Updated",
    "email": "hello@atlasadaptive.com",
    "copyright": "All rights reserved."
  }
}
```

### i18n Library (`src/lib/i18n.ts`)

Core i18n utilities:

```typescript
// Available locales
export const locales = ["en", "tl"] as const;
export type Locale = "en" | "tl";
export const defaultLocale: Locale = "en";

// Locale configuration
export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: { code: "en", name: "English", nativeName: "English", flag: "US", dir: "ltr" },
  tl: { code: "tl", name: "Tagalog", nativeName: "Tagalog", flag: "PH", dir: "ltr" },
};

// Load translations dynamically
export async function loadTranslations(locale: Locale): Promise<NestedRecord>

// Resolve dot-separated key path
export function resolveTranslation(translations: NestedRecord, key: string): string

// LocalStorage persistence
export function getStoredLocale(): Locale
export function setStoredLocale(locale: Locale): void
```

### Translation Resolution

The `resolveTranslation()` function resolves dot-separated keys:

```typescript
resolveTranslation(translations, "nav.home")
// Traverses: translations -> nav -> home
// Returns the string value, or the key itself if not found
```

### Translation Caching

Translations are cached in memory after first load:

```typescript
const translationCache: Partial<Record<Locale, NestedRecord>> = {};
```

### Language Context (`src/context/LanguageContext.tsx`)

React context provider that manages the current locale and provides the `t()` function.

```typescript
interface LanguageContextValue {
  locale: Locale;                    // Current locale code
  setLocale: (locale: Locale) => void;  // Change language
  t: (key: string) => string;       // Translate a key
  dir: "ltr" | "rtl";              // Text direction
  isLoading: boolean;               // True while translations load

  // Deprecated aliases (backward compat)
  language: Locale;
  setLanguage: (locale: Locale) => void;
}
```

#### Provider Behavior

1. On mount, reads stored locale from `localStorage`
2. Loads translation JSON for current locale (async)
3. Sets `<html>` `lang` and `dir` attributes
4. When locale changes: persists to `localStorage`, reloads translations, updates HTML attributes

### Hooks

```typescript
// Preferred hook
export function useTranslation(): LanguageContextValue

// Deprecated alias (backward compat)
export function useLanguage(): LanguageContextValue
```

## Usage in Components

### Basic Translation

```tsx
import { useLanguage } from "@/context/LanguageContext";

function MyComponent() {
  const { t } = useLanguage();
  return <h1>{t("nav.home")}</h1>;
}
```

### Language Switching

```tsx
const { language, setLanguage } = useLanguage();

// Toggle between EN and TL
<button onClick={() => setLanguage(language === "en" ? "tl" : "en")}>
  {language.toUpperCase()}
</button>
```

### Admin Content (API-driven i18n)

Admin-editable content (products, FAQ, about, etc.) stores localized strings directly in the data:

```typescript
name: { en: "Ceramic", tl: "Seramiko" }
```

Components access the correct language based on the current locale:

```tsx
const { locale } = useTranslation();
const name = product.name[locale] || product.name.en;
```

## Adding a New Language

1. Create a new translation file: `src/locales/{code}.json`
2. Add the locale to `src/lib/i18n.ts`:

```typescript
export const locales = ["en", "tl", "xx"] as const;

export const localeConfigs = {
  // ...existing...
  xx: {
    code: "xx",
    name: "Language Name",
    nativeName: "Native Name",
    flag: "flag-emoji",
    dir: "ltr", // or "rtl"
  },
};
```

3. Add the language option to admin content fields (name, description for each data type)
4. The `LanguageSwitcher` component auto-discovers locales from the config

## RTL Support

The architecture supports RTL languages through the `dir` property in locale configs. When a locale with `dir: "rtl"` is selected:

- `<html dir="rtl">` is set automatically
- Tailwind CSS `ltr:` / `rtl:` variants can be used
- The `LanguageSwitcher` uses `end-0` instead of `right-0` for positioning

Currently no RTL languages are configured, but the infrastructure is in place.
