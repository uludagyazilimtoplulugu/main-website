-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Blog categories policies (read by all, write by admin)
CREATE POLICY "Categories are viewable by everyone"
  ON public.blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON public.blog_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can update categories"
  ON public.blog_categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can delete categories"
  ON public.blog_categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Blog posts policies
CREATE POLICY "Published posts are viewable by everyone"
  ON public.blog_posts FOR SELECT
  USING (published = true OR author_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Authenticated users can create posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors and admins can update posts"
  ON public.blog_posts FOR UPDATE
  USING (
    auth.uid() = author_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Authors and admins can delete posts"
  ON public.blog_posts FOR DELETE
  USING (
    auth.uid() = author_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Blog comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON public.blog_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.blog_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors and admins can delete comments"
  ON public.blog_comments FOR DELETE
  USING (
    auth.uid() = author_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Events policies
CREATE POLICY "Published events are viewable by everyone"
  ON public.events FOR SELECT
  USING (published = true OR organizer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers and admins can update events"
  ON public.events FOR UPDATE
  USING (
    auth.uid() = organizer_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Organizers and admins can delete events"
  ON public.events FOR DELETE
  USING (
    auth.uid() = organizer_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Event registrations policies
CREATE POLICY "Registrations viewable by event organizers, admins, and own user"
  ON public.event_registrations FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND organizer_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Authenticated users can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
  ON public.event_registrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can cancel own registrations"
  ON public.event_registrations FOR DELETE
  USING (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Badges are viewable by everyone"
  ON public.badges FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage badges"
  ON public.badges FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- User badges policies
CREATE POLICY "User badges are viewable by everyone"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "Only admins can award badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Activities policies
CREATE POLICY "Users can view own activities"
  ON public.activities FOR SELECT
  USING (user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "System can insert activities"
  ON public.activities FOR INSERT
  WITH CHECK (true);

-- Contact submissions policies
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view submissions"
  ON public.contact_submissions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Only admins can update submissions"
  ON public.contact_submissions FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
