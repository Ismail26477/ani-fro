/*
  # Seed Anime Catalog - Corrected
  
  Populates the anime table with proper status values (Ongoing/Completed)
*/

INSERT INTO public.anime (title, description, thumbnail, rating, year, status, episodes, user_id)
VALUES
  ('Attack on Titan', 'A thrilling anime about humanity''s fight against giant humanoid creatures known as Titans.', '/anime1.jpg', 8.8, 2013, 'Completed', 139, NULL),
  ('Death Note', 'A psychological thriller where a high school student finds a notebook that can kill anyone whose name is written in it.', '/anime2.jpg', 8.6, 2006, 'Completed', 37, NULL),
  ('One Piece', 'The epic adventure of a young pirate seeking the legendary One Piece treasure across the seas.', '/anime3.jpg', 8.5, 1999, 'Ongoing', 1000, NULL),
  ('Naruto', 'Follow Naruto''s journey as he aims to become the strongest ninja in the village.', '/anime4.jpg', 8.0, 2002, 'Completed', 720, NULL),
  ('Demon Slayer', 'A young boy becomes a demon slayer after his family is slaughtered by demons.', '/anime5.jpg', 8.6, 2019, 'Ongoing', 55, NULL),
  ('My Hero Academia', 'A world where 80% of humanity has superpowers called Quirks. A powerless boy dreams of becoming a hero.', '/anime6.jpg', 8.1, 2016, 'Ongoing', 139, NULL),
  ('Steins;Gate', 'A group of friends discovers they can send messages to the past, triggering a race against time.', '/anime7.jpg', 8.9, 2011, 'Completed', 24, NULL),
  ('Tokyo Ghoul', 'In a world where ghouls eat humans, a young man becomes half-ghoul and must navigate both worlds.', '/anime8.jpg', 7.8, 2014, 'Completed', 48, NULL),
  ('Code Geass', 'A exiled prince receives the power to command anyone to obey him, launching a rebellion.', '/anime9.jpg', 8.6, 2006, 'Completed', 50, NULL),
  ('Fullmetal Alchemist', 'Two brothers seek the Philosopher''s Stone to restore what they lost through forbidden alchemy.', '/anime10.jpg', 9.1, 2005, 'Completed', 64, NULL),
  ('Jujutsu Kaisen', 'A high school student swallows a cursed finger and becomes host to a powerful demon.', '/anime11.jpg', 8.6, 2020, 'Ongoing', 68, NULL),
  ('Hunter x Hunter', 'A young boy embarks on an adventure to become a licensed Hunter and find his father.', '/anime12.jpg', 8.6, 2011, 'Completed', 148, NULL),
  ('Bleach', 'A teenage boy discovers he can see spirits and becomes a Soul Reaper protecting the living world.', '/anime13.jpg', 7.9, 2004, 'Completed', 366, NULL),
  ('Sword Art Online', 'Players are trapped in a virtual reality MMORPG where death in-game means death in real life.', '/anime14.jpg', 7.2, 2012, 'Completed', 97, NULL),
  ('Cowboy Bebop', 'A ragtag group of space bounty hunters hunt down criminals across the solar system.', '/anime15.jpg', 8.7, 1998, 'Completed', 26, NULL),
  ('Mob Psycho 100', 'A powerful psychic middle school boy tries to live a normal life while hiding his abilities.', '/anime16.jpg', 8.5, 2016, 'Completed', 50, NULL),
  ('The Promised Neverland', 'Children escape from an orphanage that is actually a farm for a demon race.', '/anime17.jpg', 8.5, 2019, 'Completed', 23, NULL),
  ('Ergo Proxy', 'In a post-apocalyptic world, a human and androids journey through a contaminated Earth.', '/anime18.jpg', 7.8, 2006, 'Completed', 23, NULL)
ON CONFLICT DO NOTHING;
