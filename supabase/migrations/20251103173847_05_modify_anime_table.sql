/*
  # Modify Anime Table to Allow System Entries

  Makes user_id nullable so we can seed anime with system/admin entries
*/

ALTER TABLE public.anime ALTER COLUMN user_id DROP NOT NULL;
