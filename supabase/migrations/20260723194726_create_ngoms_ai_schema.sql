/*
# Ngoms AI — Full Schema & Seed Data

Creates the complete data model for the Ngoms AI education platform,
migrated from Firebase/Base44 to Supabase. Single-tenant app (no sign-in);
all tables are readable/writable by the anon-key client.

1. New Tables
- app_settings   — single-row app configuration (name, tagline, colors, maintenance)
- app_banner      — single-row promotional banner shown on dashboard
- courses         — catalog of courses with category, icon, lessons, status
- flashcard_decks — decks with embedded cards (jsonb array of {front, back})
- quizzes         — quizzes with embedded questions (jsonb array)
- documents       — study material links/resources
- plans           — subscription tiers (Free, Premium, Annual)
- badges          — achievement definitions
- leaderboard     — ranked learner entries
- faqs            — FAQ entries
- testimonials    — learner testimonials
- announcements   — broadcast messages
- notifications   — per-app notifications
- features        — feature toggle flags (key, enabled, name, icon)
- contact_messages — contact form submissions
- system_logs     — admin action audit log (column "actor" used instead of reserved "user")

2. Security
- RLS enabled on every table.
- All tables allow anon + authenticated CRUD (intentionally public/shared data
  for this single-tenant education app; documented here).

3. Seed Data
- Pre-populates app_settings, banner, features, courses, sample decks,
  quizzes, badges, plans, leaderboard, FAQs, testimonials, and a welcome
  announcement so the app renders content on first load.
*/

-- ── app_settings ──
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name text NOT NULL DEFAULT 'Ngoms AI',
  tagline text NOT NULL DEFAULT 'Learn Smarter. Not Harder.',
  primary_color text NOT NULL DEFAULT '#0F73F7',
  version text NOT NULL DEFAULT '2.0.0',
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_message text NOT NULL DEFAULT 'We are upgrading Ngoms AI. Back soon!',
  support_email text NOT NULL DEFAULT 'support@ngoms.ai',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_app_settings" ON app_settings;
CREATE POLICY "anon_select_app_settings" ON app_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_app_settings" ON app_settings;
CREATE POLICY "anon_insert_app_settings" ON app_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_app_settings" ON app_settings;
CREATE POLICY "anon_update_app_settings" ON app_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_app_settings" ON app_settings;
CREATE POLICY "anon_delete_app_settings" ON app_settings FOR DELETE TO anon, authenticated USING (true);

-- ── app_banner ──
CREATE TABLE IF NOT EXISTS app_banner (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Welcome to Ngoms AI Premium',
  subtitle text NOT NULL DEFAULT 'Unlock unlimited AI tutoring, flashcards & quizzes',
  action_text text NOT NULL DEFAULT 'Upgrade Now',
  action_route text NOT NULL DEFAULT '/settings',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE app_banner ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_app_banner" ON app_banner;
CREATE POLICY "anon_select_app_banner" ON app_banner FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_app_banner" ON app_banner;
CREATE POLICY "anon_insert_app_banner" ON app_banner FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_app_banner" ON app_banner;
CREATE POLICY "anon_update_app_banner" ON app_banner FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_app_banner" ON app_banner;
CREATE POLICY "anon_delete_app_banner" ON app_banner FOR DELETE TO anon, authenticated USING (true);

-- ── courses ──
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  icon text NOT NULL DEFAULT '📚',
  lessons integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Active',
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_courses" ON courses;
CREATE POLICY "anon_select_courses" ON courses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_courses" ON courses;
CREATE POLICY "anon_insert_courses" ON courses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_courses" ON courses;
CREATE POLICY "anon_update_courses" ON courses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_courses" ON courses;
CREATE POLICY "anon_delete_courses" ON courses FOR DELETE TO anon, authenticated USING (true);

-- ── flashcard_decks ──
CREATE TABLE IF NOT EXISTS flashcard_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL DEFAULT 'Ngoms AI',
  status text NOT NULL DEFAULT 'Active',
  cards jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_flashcard_decks" ON flashcard_decks;
CREATE POLICY "anon_select_flashcard_decks" ON flashcard_decks FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_flashcard_decks" ON flashcard_decks;
CREATE POLICY "anon_insert_flashcard_decks" ON flashcard_decks FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_flashcard_decks" ON flashcard_decks;
CREATE POLICY "anon_update_flashcard_decks" ON flashcard_decks FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_flashcard_decks" ON flashcard_decks;
CREATE POLICY "anon_delete_flashcard_decks" ON flashcard_decks FOR DELETE TO anon, authenticated USING (true);

-- ── quizzes ──
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  difficulty text NOT NULL DEFAULT 'Medium',
  status text NOT NULL DEFAULT 'Active',
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_quizzes" ON quizzes;
CREATE POLICY "anon_select_quizzes" ON quizzes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_quizzes" ON quizzes;
CREATE POLICY "anon_insert_quizzes" ON quizzes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_quizzes" ON quizzes;
CREATE POLICY "anon_update_quizzes" ON quizzes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_quizzes" ON quizzes;
CREATE POLICY "anon_delete_quizzes" ON quizzes FOR DELETE TO anon, authenticated USING (true);

-- ── documents ──
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  url text,
  description text,
  status text NOT NULL DEFAULT 'Active',
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_documents" ON documents;
CREATE POLICY "anon_select_documents" ON documents FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_documents" ON documents;
CREATE POLICY "anon_insert_documents" ON documents FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_documents" ON documents;
CREATE POLICY "anon_update_documents" ON documents FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_documents" ON documents;
CREATE POLICY "anon_delete_documents" ON documents FOR DELETE TO anon, authenticated USING (true);

-- ── plans ──
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL DEFAULT '0',
  period text NOT NULL DEFAULT 'month',
  status text NOT NULL DEFAULT 'Active',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_plans" ON plans;
CREATE POLICY "anon_select_plans" ON plans FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_plans" ON plans;
CREATE POLICY "anon_insert_plans" ON plans FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_plans" ON plans;
CREATE POLICY "anon_update_plans" ON plans FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_plans" ON plans;
CREATE POLICY "anon_delete_plans" ON plans FOR DELETE TO anon, authenticated USING (true);

-- ── badges ──
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT '🏅',
  status text NOT NULL DEFAULT 'Active',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_badges" ON badges;
CREATE POLICY "anon_select_badges" ON badges FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_badges" ON badges;
CREATE POLICY "anon_insert_badges" ON badges FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_badges" ON badges;
CREATE POLICY "anon_update_badges" ON badges FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_badges" ON badges;
CREATE POLICY "anon_delete_badges" ON badges FOR DELETE TO anon, authenticated USING (true);

-- ── leaderboard ──
CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  xp integer NOT NULL DEFAULT 0,
  rank integer NOT NULL DEFAULT 0,
  badge text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_leaderboard" ON leaderboard;
CREATE POLICY "anon_select_leaderboard" ON leaderboard FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_leaderboard" ON leaderboard;
CREATE POLICY "anon_insert_leaderboard" ON leaderboard FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_leaderboard" ON leaderboard;
CREATE POLICY "anon_update_leaderboard" ON leaderboard FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_leaderboard" ON leaderboard;
CREATE POLICY "anon_delete_leaderboard" ON leaderboard FOR DELETE TO anon, authenticated USING (true);

-- ── faqs ──
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_faqs" ON faqs;
CREATE POLICY "anon_select_faqs" ON faqs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_faqs" ON faqs;
CREATE POLICY "anon_insert_faqs" ON faqs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_faqs" ON faqs;
CREATE POLICY "anon_update_faqs" ON faqs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_faqs" ON faqs;
CREATE POLICY "anon_delete_faqs" ON faqs FOR DELETE TO anon, authenticated USING (true);

-- ── testimonials ──
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  content text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'Active',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_testimonials" ON testimonials;
CREATE POLICY "anon_select_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_testimonials" ON testimonials;
CREATE POLICY "anon_insert_testimonials" ON testimonials FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_testimonials" ON testimonials;
CREATE POLICY "anon_update_testimonials" ON testimonials FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_testimonials" ON testimonials;
CREATE POLICY "anon_delete_testimonials" ON testimonials FOR DELETE TO anon, authenticated USING (true);

-- ── announcements ──
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text,
  type text NOT NULL DEFAULT 'announcement',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_announcements" ON announcements;
CREATE POLICY "anon_select_announcements" ON announcements FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_announcements" ON announcements;
CREATE POLICY "anon_insert_announcements" ON announcements FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_announcements" ON announcements;
CREATE POLICY "anon_update_announcements" ON announcements FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_announcements" ON announcements;
CREATE POLICY "anon_delete_announcements" ON announcements FOR DELETE TO anon, authenticated USING (true);

-- ── notifications ──
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text,
  type text NOT NULL DEFAULT 'info',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_notifications" ON notifications;
CREATE POLICY "anon_select_notifications" ON notifications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_notifications" ON notifications;
CREATE POLICY "anon_insert_notifications" ON notifications FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_notifications" ON notifications;
CREATE POLICY "anon_update_notifications" ON notifications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_notifications" ON notifications;
CREATE POLICY "anon_delete_notifications" ON notifications FOR DELETE TO anon, authenticated USING (true);

-- ── features (toggles) ──
CREATE TABLE IF NOT EXISTS features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  key text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT '⚙️',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_features" ON features;
CREATE POLICY "anon_select_features" ON features FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_features" ON features;
CREATE POLICY "anon_insert_features" ON features FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_features" ON features;
CREATE POLICY "anon_update_features" ON features FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_features" ON features;
CREATE POLICY "anon_delete_features" ON features FOR DELETE TO anon, authenticated USING (true);

-- ── contact_messages ──
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_contact_messages" ON contact_messages;
CREATE POLICY "anon_select_contact_messages" ON contact_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_contact_messages" ON contact_messages;
CREATE POLICY "anon_update_contact_messages" ON contact_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_contact_messages" ON contact_messages;
CREATE POLICY "anon_delete_contact_messages" ON contact_messages FOR DELETE TO anon, authenticated USING (true);

-- ── system_logs ──
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  actor text NOT NULL DEFAULT 'admin',
  level text NOT NULL DEFAULT 'info',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_system_logs" ON system_logs;
CREATE POLICY "anon_select_system_logs" ON system_logs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_system_logs" ON system_logs;
CREATE POLICY "anon_insert_system_logs" ON system_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_system_logs" ON system_logs;
CREATE POLICY "anon_update_system_logs" ON system_logs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_system_logs" ON system_logs;
CREATE POLICY "anon_delete_system_logs" ON system_logs FOR DELETE TO anon, authenticated USING (true);

-- ════════════════════════════════════════════
-- SEED DATA
-- ════════════════════════════════════════════

INSERT INTO app_settings (app_name, tagline, primary_color, version)
SELECT 'Ngoms AI', 'Learn Smarter. Not Harder.', '#0F73F7', '2.0.0'
WHERE NOT EXISTS (SELECT 1 FROM app_settings);

INSERT INTO app_banner (title, subtitle, action_text, action_route, active)
SELECT 'Welcome to Ngoms AI Premium', 'Unlock unlimited AI tutoring, flashcards & quizzes', 'Upgrade Now', '/settings', true
WHERE NOT EXISTS (SELECT 1 FROM app_banner);

INSERT INTO features (name, key, icon, enabled)
SELECT * FROM (VALUES
  ('AI Chat Tutor',    'ai_chat',     '💬', true),
  ('Flashcard Studio', 'flashcards',  '🎴', true),
  ('Quiz Engine',      'quiz',        '⚡', true),
  ('Smart Notes',      'notes',       '📝', true),
  ('Study Planner',    'planner',     '📅', true),
  ('Analytics',        'analytics',   '📊', true),
  ('Leaderboard',      'leaderboard', '🏆', true)
) AS v(name, key, icon, enabled)
WHERE NOT EXISTS (SELECT 1 FROM features);

INSERT INTO courses (title, category, icon, lessons, status, description)
SELECT * FROM (VALUES
  ('Introduction to Computer Science', 'Technology', '💻', 12, 'Active', 'Learn the fundamentals of computing, algorithms, and programming.'),
  ('Mathematics for AI',               'Mathematics', '🔢', 8,  'Active', 'Linear algebra, calculus, and statistics tailored for AI.'),
  ('English Literature Essentials',    'Languages',   '📖', 10, 'Active', 'Explore classic literature, themes, and critical analysis.'),
  ('Biology: Human Body Systems',       'Science',     '🧬', 15, 'Active', 'A deep dive into the systems that keep the human body running.'),
  ('Business Fundamentals',             'Business',    '📈', 6,  'Active', 'Core concepts in entrepreneurship, finance, and management.')
) AS v(title, category, icon, lessons, status, description)
WHERE NOT EXISTS (SELECT 1 FROM courses);

INSERT INTO flashcard_decks (title, author, status, cards)
SELECT * FROM (VALUES
  ('Python Programming Basics', 'Ngoms AI', 'Active',
    '[{"front":"What is a variable?","back":"A named storage location for data in memory"},{"front":"What does print() do?","back":"Outputs text to the console"},{"front":"What is a list?","back":"An ordered, mutable collection of items"},{"front":"What is a dictionary?","back":"A key-value pair data structure"}]'::jsonb),
  ('Cell Biology', 'Ngoms AI', 'Active',
    '[{"front":"Powerhouse of the cell?","back":"Mitochondria"},{"front":"What is DNA?","back":"Deoxyribonucleic acid — the genetic blueprint"},{"front":"What is photosynthesis?","back":"Plants convert sunlight + CO₂ into glucose"}]'::jsonb),
  ('Algebra Formulas', 'Ngoms AI', 'Active',
    '[{"front":"Quadratic formula","back":"x = (-b ± √(b²-4ac)) / 2a"},{"front":"Slope formula","back":"m = (y₂ - y₁) / (x₂ - x₁)"},{"front":"Distance formula","back":"d = √((x₂-x₁)² + (y₂-y₁)²)"}]'::jsonb)
) AS v(title, author, status, cards)
WHERE NOT EXISTS (SELECT 1 FROM flashcard_decks);

INSERT INTO quizzes (title, difficulty, status, questions)
SELECT * FROM (VALUES
  ('Python Basics Quiz', 'Easy', 'Active',
    '[{"question":"What symbol starts a Python comment?","options":["//","/*","#","--"],"answer":"#"},{"question":"How do you create a variable x with value 5?","options":["var x=5","x = 5","let x=5","const x=5"],"answer":"x = 5"},{"question":"What does len() return?","options":["The length of an object","A boolean","A number type","None"],"answer":"The length of an object"}]'::jsonb),
  ('Cell Biology Quiz', 'Medium', 'Active',
    '[{"question":"What is the powerhouse of the cell?","options":["Nucleus","Ribosome","Mitochondria","Golgi body"],"answer":"Mitochondria"},{"question":"What carries genetic information?","options":["RNA","DNA","Protein","Lipid"],"answer":"DNA"},{"question":"What is osmosis?","options":["Movement of solutes","Movement of water across a membrane","Cell division","Energy production"],"answer":"Movement of water across a membrane"}]'::jsonb),
  ('Algebra Quiz', 'Hard', 'Active',
    '[{"question":"Solve: 2x + 5 = 15","options":["x=3","x=5","x=7","x=10"],"answer":"x=5"},{"question":"What is x² if x = 4?","options":["8","12","16","20"],"answer":"16"}]'::jsonb)
) AS v(title, difficulty, status, questions)
WHERE NOT EXISTS (SELECT 1 FROM quizzes);

INSERT INTO badges (name, description, icon, status)
SELECT * FROM (VALUES
  ('First Steps',    'Complete your first lesson',     '🎯', 'Active'),
  ('Quiz Master',    'Pass 10 quizzes with 80%+',      '🧠', 'Active'),
  ('Streak Warrior', '7-day study streak',             '🔥', 'Active'),
  ('Scholar',        'Complete a full course',          '🎓', 'Active')
) AS v(name, description, icon, status)
WHERE NOT EXISTS (SELECT 1 FROM badges);

INSERT INTO plans (name, price, period, status, features)
SELECT * FROM (VALUES
  ('Free',    '0',     'month', 'Active', '["5 AI queries/day","Basic flashcards","Community access"]'::jsonb),
  ('Premium', '15000', 'month', 'Active', '["Unlimited AI tutoring","All courses","Quiz engine","Analytics"]'::jsonb),
  ('Annual',  '150000','year',  'Active', '["Everything in Premium","2 months free","Early feature access"]'::jsonb)
) AS v(name, price, period, status, features)
WHERE NOT EXISTS (SELECT 1 FROM plans);

INSERT INTO leaderboard (name, xp, rank, badge)
SELECT * FROM (VALUES
  ('Davie Kuminga', 5420, 1, 'Scholar'),
  ('Chisomo Banda', 4890, 2, 'Quiz Master'),
  ('Tadala Mvula',  4210, 3, 'Streak Warrior'),
  ('Kondwani D.',   3780, 4, 'First Steps'),
  ('Zione Phiri',   3210, 5, 'Scholar')
) AS v(name, xp, rank, badge)
WHERE NOT EXISTS (SELECT 1 FROM leaderboard);

INSERT INTO announcements (title, message, type)
SELECT '🎉 Ngoms AI v2.0 is Live!', 'Welcome to the new and improved Ngoms AI platform. Explore AI tutoring, flashcards, quizzes and more!', 'announcement'
WHERE NOT EXISTS (SELECT 1 FROM announcements);

INSERT INTO faqs (question, answer, status)
SELECT * FROM (VALUES
  ('Is Ngoms AI free to use?', 'Yes! The Free plan gives you 5 AI queries per day, basic flashcards, and community access. Upgrade to Premium for unlimited features.', 'Active'),
  ('Can I use Ngoms AI offline?', 'The app is a PWA, so cached pages work offline. Live AI features and data sync require an internet connection.', 'Active'),
  ('How do I earn badges?', 'Complete lessons, pass quizzes with high scores, and maintain study streaks to earn achievement badges.', 'Active')
) AS v(question, answer, status)
WHERE NOT EXISTS (SELECT 1 FROM faqs);

INSERT INTO testimonials (name, role, content, rating, status)
SELECT * FROM (VALUES
  ('Thandiwe M.', 'University Student', 'Ngoms AI helped me pass my biology exam. The AI tutor explains things way better than my textbook!', 5, 'Active'),
  ('Joseph K.', 'High School Student', 'The flashcards and quizzes make studying feel like a game. My grades went up in just two weeks.', 5, 'Active'),
  ('Grace P.', 'Teacher', 'I use Ngoms AI to generate notes and quizzes for my students. It saves me hours every week.', 5, 'Active')
) AS v(name, role, content, rating, status)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);
