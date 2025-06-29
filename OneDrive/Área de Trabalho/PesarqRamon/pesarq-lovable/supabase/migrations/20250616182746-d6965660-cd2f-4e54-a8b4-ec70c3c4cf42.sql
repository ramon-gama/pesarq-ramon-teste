
-- Atualizar a função para criar perfil automaticamente e dar privilégios de admin para carloshunb@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, role, organization_id, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    CASE 
      WHEN NEW.email = 'carloshunb@gmail.com' THEN 'unb_admin'
      ELSE COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'partner_user')
    END,
    CASE 
      WHEN NEW.email = 'carloshunb@gmail.com' THEN NULL
      WHEN NEW.raw_user_meta_data ->> 'organization_id' IS NOT NULL 
      THEN (NEW.raw_user_meta_data ->> 'organization_id')::uuid
      ELSE NULL
    END,
    true
  );
  RETURN NEW;
END;
$$;
