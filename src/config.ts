import settings from "./site.config.json" with { type: "json" };
import { language, locale, ogLocale, t, type TranslationKey } from "./i18n";

// Configure language and identity in site.config.json; edit copy in i18n/*.json.
export const siteInfo = {
  title: settings.site.name,
  titleSuffix: t("site.titleSuffix"),
  language,
  locale: ogLocale,
  dateLocale: locale,
  favicon: settings.site.favicon,
  description: t("site.description"),
  keywords: settings.site.keywords[language],
  // SITE comes from astro.config.mjs and is shared by all generated metadata.
  url: import.meta.env.SITE,
};

export const headerConfig = {
  title: settings.site.logoText,
  navLinks: settings.navigation.map(({ label, icon, url }) => ({
    name: t(label as TranslationKey),
    icon,
    url,
  })),
};

export const welcomeConfig = {
  title: t("hero.title"),
  subTitle: t("hero.subtitle"),
  bgImage: settings.hero.image,
};

export const personalInfo = {
  name: settings.author.name[language],
  englishName: settings.author.handle,
  avatar: settings.author.avatar,
  role: t("author.role"),
  bio: t("author.bio"),
  github: settings.author.github,
  socialLinks: settings.socialLinks.map(({ name, label, icon, url }) => ({
    name: label ? t(label as TranslationKey) : name,
    icon,
    url: url === "$author.github" ? settings.author.github : url,
  })),
};
