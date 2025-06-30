
-- Criar tabela para posts da comunidade
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  type TEXT NOT NULL CHECK (type IN ('question', 'practice', 'discussion', 'alert')),
  tags TEXT[] DEFAULT '{}',
  votes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  solved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para comentários/respostas
CREATE TABLE public.community_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para votos
CREATE TABLE public.community_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, reply_id),
  CHECK ((post_id IS NOT NULL AND reply_id IS NULL) OR (post_id IS NULL AND reply_id IS NOT NULL))
);

-- Criar tabela para perfis de usuários da comunidade
CREATE TABLE public.community_user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  name TEXT NOT NULL,
  organ TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  reputation INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para posts
CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Políticas para comentários
CREATE POLICY "Anyone can view replies" ON public.community_replies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create replies" ON public.community_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own replies" ON public.community_replies FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own replies" ON public.community_replies FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Políticas para votos
CREATE POLICY "Anyone can view votes" ON public.community_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create votes" ON public.community_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes" ON public.community_votes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own votes" ON public.community_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Políticas para perfis
CREATE POLICY "Anyone can view profiles" ON public.community_user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create their own profile" ON public.community_user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.community_user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Função para atualizar contadores
CREATE OR REPLACE FUNCTION update_post_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Atualizar contador de respostas
    UPDATE public.community_posts 
    SET replies = replies + 1, last_activity = NOW()
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Atualizar contador de respostas
    UPDATE public.community_posts 
    SET replies = replies - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contadores
CREATE TRIGGER update_post_counters_trigger
  AFTER INSERT OR DELETE ON public.community_replies
  FOR EACH ROW EXECUTE FUNCTION update_post_counters();

-- Função para atualizar votos
CREATE OR REPLACE FUNCTION update_vote_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE public.community_posts 
      SET votes = votes + CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END
      WHERE id = NEW.post_id;
    ELSIF NEW.reply_id IS NOT NULL THEN
      UPDATE public.community_replies 
      SET votes = votes + CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END
      WHERE id = NEW.reply_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE public.community_posts 
      SET votes = votes - CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END
      WHERE id = OLD.post_id;
    ELSIF OLD.reply_id IS NOT NULL THEN
      UPDATE public.community_replies 
      SET votes = votes - CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END
      WHERE id = OLD.reply_id;
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE public.community_posts 
      SET votes = votes - CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END + CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END
      WHERE id = NEW.post_id;
    ELSIF NEW.reply_id IS NOT NULL THEN
      UPDATE public.community_replies 
      SET votes = votes - CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END + CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END
      WHERE id = NEW.reply_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar votos
CREATE TRIGGER update_vote_counters_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.community_votes
  FOR EACH ROW EXECUTE FUNCTION update_vote_counters();

-- Habilitar realtime
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.community_replies REPLICA IDENTITY FULL;
ALTER TABLE public.community_votes REPLICA IDENTITY FULL;
ALTER TABLE public.community_user_profiles REPLICA IDENTITY FULL;

-- Adicionar tabelas ao realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_user_profiles;
