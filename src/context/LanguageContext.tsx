"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  type Locale,
  defaultLocale,
  getDirection,
  getStoredLocale,
  loadTranslations,
  resolveTranslation,
  setStoredLocale,
} from "@/lib/i18n";

type NestedRecord = { [key: string]: string | NestedRecord };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  isLoading: boolean;
  /** @deprecated Use `locale` instead */
  language: Locale;
  /** @deprecated Use `setLocale` instead */
  setLanguage: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<NestedRecord>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load stored locale on mount
  useEffect(() => {
    const stored = getStoredLocale();
    setLocaleState(stored);
  }, []);

  // Load translations whenever locale changes
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    loadTranslations(locale).then((data) => {
      if (!cancelled) {
        setTranslations(data);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  // Apply dir and lang attributes to <html>
  useEffect(() => {
    const dir = getDirection(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => resolveTranslation(translations, key),
    [translations]
  );

  const dir = getDirection(locale);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      dir,
      isLoading,
      // Backward-compatible aliases
      language: locale,
      setLanguage: setLocale,
    }),
    [locale, setLocale, t, dir, isLoading]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

/**
 * Hook to access translations and the current locale.
 *
 * Returns:
 *  - `t(key)` -- resolve a dot-separated translation key (e.g. "nav.home")
 *  - `locale` -- current locale code
 *  - `setLocale` -- switch to a different locale
 *  - `dir` -- text direction ("ltr" | "rtl")
 *  - `isLoading` -- true while translations are being loaded
 */
export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a <LanguageProvider>");
  }
  return ctx;
}

/**
 * @deprecated Use `useTranslation` instead. This alias is kept for backward
 * compatibility with existing components.
 */
export function useLanguage() {
  return useTranslation();
}
