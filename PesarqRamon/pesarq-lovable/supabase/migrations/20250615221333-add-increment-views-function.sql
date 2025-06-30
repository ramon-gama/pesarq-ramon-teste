
-- Função para incrementar views de post de forma atômica
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts 
  SET views = views + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
