DROP POLICY IF EXISTS posts_update_hearts ON public.forum_posts;

CREATE OR REPLACE FUNCTION public.increment_post_hearts(_post_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.forum_posts SET hearts = hearts + 1 WHERE id = _post_id;
$$;

REVOKE ALL ON FUNCTION public.increment_post_hearts(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_post_hearts(uuid) TO authenticated;

CREATE POLICY posts_update_own ON public.forum_posts
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);