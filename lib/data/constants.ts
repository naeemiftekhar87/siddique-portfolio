// Fixed pick-lists shared by the admin forms, server validation, and the
// public filters. Owner-managed lists (portfolio categories, research
// interests) live in the database instead.

export const skillCategories = ["INDUSTRY KNOWLEDGE", "TOOLS & TECHNOLOGIES", "INTERPERSONAL", "OTHER"] as const;

/** Certificate categories: the admin form options and the public /certificates tabs. */
export const certificateCategories = ["Academic Certificates", "Professional Certificates", "Training", "Awards"] as const;

export const achievementCategories = ["Academic", "Professional", "Research", "Community", "Competition"] as const;

export const educationStatuses = ["In Progress", "Completed", "On Hold"] as const;

export const projectStatuses = ["Completed", "Research", "In Progress", "Planned", "On Hold"] as const;

/** One paper list covers the whole pipeline, from working paper to published. */
export const paperStatuses = ["Working Paper", "Submitted", "Under Review", "Revision Requested", "Accepted", "Published"] as const;

export const upcomingStatuses = ["Idea", "Conceptualized", "Literature Review", "Data Collection", "In Progress"] as const;

export const galleryCategories = ["Data Visualization", "Dashboard", "Model Output", "Report", "Presentation", "Other"] as const;

export const portfolioColors = ["blue", "teal", "violet", "amber", "green", "rose", "orange", "sky"] as const;

export type SkillCategory = (typeof skillCategories)[number];
export type PaperStatus = (typeof paperStatuses)[number];
