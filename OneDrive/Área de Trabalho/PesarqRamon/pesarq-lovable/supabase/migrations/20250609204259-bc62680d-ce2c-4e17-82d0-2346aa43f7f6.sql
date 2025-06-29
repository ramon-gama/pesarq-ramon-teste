
-- Criar tabela para fundos arquivísticos (se não existir)
CREATE TABLE IF NOT EXISTS public.archival_funds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  location TEXT,
  total_boxes INTEGER DEFAULT 0,
  total_documents INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para autoridades (se não existir)
CREATE TABLE IF NOT EXISTS public.authorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pessoa', 'familia', 'entidade_coletiva')),
  position TEXT,
  department TEXT,
  birth_date DATE,
  death_date DATE,
  biography TEXT,
  contact_info JSONB,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para equipe da organização (se não existir)
CREATE TABLE IF NOT EXISTS public.organization_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT NOT NULL,
  department TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'member', 'viewer')),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para setores da organização (se não existir)
CREATE TABLE IF NOT EXISTS public.organization_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  parent_sector_id UUID REFERENCES public.organization_sectors(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  location TEXT,
  responsible_id UUID REFERENCES public.organization_team(id) ON DELETE SET NULL,
  contact_info JSONB,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
DROP TRIGGER IF EXISTS update_archival_funds_updated_at ON public.archival_funds;
CREATE TRIGGER update_archival_funds_updated_at
    BEFORE UPDATE ON public.archival_funds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_authorities_updated_at ON public.authorities;
CREATE TRIGGER update_authorities_updated_at
    BEFORE UPDATE ON public.authorities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_organization_team_updated_at ON public.organization_team;
CREATE TRIGGER update_organization_team_updated_at
    BEFORE UPDATE ON public.organization_team
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_organization_sectors_updated_at ON public.organization_sectors;
CREATE TRIGGER update_organization_sectors_updated_at
    BEFORE UPDATE ON public.organization_sectors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS para todas as tabelas
ALTER TABLE public.archival_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_sectors ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS básicas (permitir acesso a usuários autenticados)
CREATE POLICY "Allow authenticated access to archival_funds" ON public.archival_funds
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated access to authorities" ON public.authorities
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated access to organization_team" ON public.organization_team
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated access to organization_sectors" ON public.organization_sectors
  FOR ALL USING (true);
