-- Grades (the product catalog) are readable by anyone, including
-- unauthenticated visitors — matches current app behavior, where browsing
-- the catalog doesn't require login.
--
-- Every other table stays RLS-enabled with zero policies (default deny)
-- until real auth exists (MVBB-5 real OTP provider, MVBB-14 real
-- authentication) — writing auth.uid()-scoped policies against a login
-- system that isn't built yet would be security theater, not real
-- protection. Add those policies alongside the auth work, not before it.
create policy "Public read access to grades"
  on grades
  for select
  to anon, authenticated
  using (true);
