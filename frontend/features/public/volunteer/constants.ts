export const VOLUNTEER_PROFESSIONS = [
  "Lawyer",
  "Doctor",
  "Counselor",
  "Financial Advisor",
  "IT Professional",
  "Teacher",
  "Social Worker",
  "Engineer",
  "Student",
  "Architect",
  "Journalist",
  "Business Owner",
  "Consultant",
  "Retired",
  "Other"
] as const;

export type VolunteerProfession = typeof VOLUNTEER_PROFESSIONS[number];
