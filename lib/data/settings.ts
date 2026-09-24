import type { z } from "zod";
import {
  aboutSettingsSchema,
  colorSettingsSchema,
  footerSettingsSchema,
  homeSettingsSchema,
  linksSettingsSchema,
  navigationSettingsSchema,
  profileSettingsSchema,
  researchInterestsSettingsSchema,
  researchProfileSettingsSchema,
  resumeConfigSchema,
} from "./schemas";
import {
  defaultAbout,
  defaultColors,
  defaultFooter,
  defaultHome,
  defaultLinks,
  defaultNavigation,
  defaultProfile,
  defaultResearchInterests,
  defaultResearchProfile,
  defaultResumeConfigs,
} from "./defaults";

/** Every site_settings row: its key, validation schema, and default value. */
export const settingsRegistry = {
  profile: { schema: profileSettingsSchema, defaults: defaultProfile },
  links: { schema: linksSettingsSchema, defaults: defaultLinks },
  research_profile: { schema: researchProfileSettingsSchema, defaults: defaultResearchProfile },
  research_interests: { schema: researchInterestsSettingsSchema, defaults: defaultResearchInterests },
  home: { schema: homeSettingsSchema, defaults: defaultHome },
  about: { schema: aboutSettingsSchema, defaults: defaultAbout },
  navigation: { schema: navigationSettingsSchema, defaults: defaultNavigation },
  footer: { schema: footerSettingsSchema, defaults: defaultFooter },
  colors: { schema: colorSettingsSchema, defaults: defaultColors },
  resume_professional: { schema: resumeConfigSchema, defaults: defaultResumeConfigs.professional },
  resume_infographic: { schema: resumeConfigSchema, defaults: defaultResumeConfigs.infographic },
} as const;

export type SettingsKey = keyof typeof settingsRegistry;
export type SettingsValue<K extends SettingsKey> = z.infer<(typeof settingsRegistry)[K]["schema"]>;

/**
 * Validates a stored value against its schema. Values saved before a field
 * was added are filled in from the defaults; anything still invalid falls
 * back to the defaults entirely.
 */
export function parseSettings<K extends SettingsKey>(key: K, stored: unknown): SettingsValue<K> {
  const { schema, defaults } = settingsRegistry[key];
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    const merged = schema.safeParse({ ...defaults, ...stored });
    if (merged.success) return merged.data as SettingsValue<K>;
  }
  return defaults as SettingsValue<K>;
}
