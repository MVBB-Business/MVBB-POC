-- 0001_init.sql's grades table was missing columns the app actually needs
-- for display/filtering — these exist in the prototype (mvbb-app.jsx
-- DEFAULT_GRADES) and in apps/customer/lib/seed-grades.ts, but were never
-- added to the live schema. Adding them now, before seeding real data.
alter table grades
  add column quality text,
  add column bulb_size text,
  add column cloves text,
  add column moisture text,
  add column shelf_life text,
  add column origin text,
  add column export_grade boolean not null default false,
  add column best_seller boolean not null default false,
  add column color text;
