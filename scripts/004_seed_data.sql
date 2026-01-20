-- Insert sample blog categories
INSERT INTO public.blog_categories (name, slug, description, color) VALUES
  ('Teknoloji', 'teknoloji', 'Yazılım ve teknoloji haberleri', '#44657A'),
  ('Eğitim', 'egitim', 'Eğitim içerikleri ve dersler', '#334252'),
  ('Etkinlik', 'etkinlik', 'Topluluk etkinlikleri', '#5A7C99'),
  ('Proje', 'proje', 'Topluluk projeleri', '#6B8BA8')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample badges
INSERT INTO public.badges (name, description, icon, color, points_required) VALUES
  ('Yeni Üye', 'Topluluğa hoş geldin!', '🎉', '#44657A', 0),
  ('İlk Blog Yazısı', 'İlk blog yazını yazdın', '✍️', '#5A7C99', 0),
  ('Yorum Yapan', '10 yorum yaptın', '💬', '#6B8BA8', 50),
  ('Etkinlik Katılımcısı', 'İlk etkinliğe katıldın', '🎪', '#7A9DB4', 0),
  ('Aktif Üye', '200 puan topladın', '⭐', '#8BAEC0', 200),
  ('Veteran', '500 puan topladın', '🏆', '#9CBFCC', 500),
  ('Efsane', '1000 puan topladın', '👑', '#ADD0D8', 1000)
ON CONFLICT (name) DO NOTHING;
