import { defaultLocale, type Locale } from './i18n-config'

export interface Translations {
  nav: {
    home: string
    blog: string
    projects: string
    cv: string
    stats: string
  }
  hero: {
    greeting: string
    cta_projects: string
    cta_cv: string
    cta_contact: string
  }
  sections: {
    about: string
    experience: string
    skills: string
    education: string
    contact: string
  }
  footer: {
    copyright: string
  }
  common: {
    loading: string
    error: string
    back: string
    coming_soon: string
  }
}

const es: Translations = {
  nav: {
    home: 'Inicio',
    blog: 'Blog',
    projects: 'Proyectos',
    cv: 'CV',
    stats: 'Estadísticas',
  },
  hero: {
    greeting: 'Hola, soy Javier Morcillo',
    cta_projects: 'Ver proyectos',
    cta_cv: 'Descargar CV',
    cta_contact: 'Contactar',
  },
  sections: {
    about: 'Sobre mí',
    experience: 'Experiencia',
    skills: 'Habilidades',
    education: 'Formación',
    contact: 'Contacto',
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} javiermorcillonuevo.com`,
  },
  common: {
    loading: 'Cargando...',
    error: 'Ha ocurrido un error',
    back: 'Volver',
    coming_soon: 'Próximamente',
  },
}

const translations: Record<Locale, Translations> = {
  es,
}

/**
 * Get translations for a given locale.
 * Falls back to default locale if the requested one is missing.
 */
export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations[defaultLocale]
}

/**
 * Simple type-safe t() function that returns raw translations for the default locale.
 * Useful for server components where locale is known at build time.
 *
 * For dynamic locale support, use getTranslations(locale) instead.
 */
export function t(): Translations {
  return translations[defaultLocale]
}
