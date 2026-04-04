export const locales = ["en", "tl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    dir: "ltr",
  },
  tl: {
    code: "tl",
    name: "Tagalog",
    nativeName: "Tagalog",
    flag: "🇵🇭",
    dir: "ltr",
  },
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return localeConfigs[locale].dir;
}

type NestedRecord = { [key: string]: string | NestedRecord };

const translationCache: Partial<Record<Locale, NestedRecord>> = {};

export async function loadTranslations(locale: Locale): Promise<NestedRecord> {
  if (translationCache[locale]) {
    return translationCache[locale]!;
  }

  const translations = await import(`@/locales/${locale}.json`);
  translationCache[locale] = translations.default ?? translations;
  return translationCache[locale]!;
}

/**
 * Resolve a dot-separated key path against a nested translation object.
 * Returns the key itself if the path cannot be resolved.
 */
export function resolveTranslation(
  translations: NestedRecord,
  key: string
): string {
  const parts = key.split(".");
  let current: unknown = translations;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : key;
}

const STORAGE_KEY = "babakatlas-locale";

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidLocale(stored)) return stored;
  } catch {
    // localStorage may be unavailable
  }
  return defaultLocale;
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // localStorage may be unavailable
  }
}
