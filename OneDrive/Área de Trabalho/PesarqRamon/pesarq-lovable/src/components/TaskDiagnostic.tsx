
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Database, RefreshCw } from "lucide-react";

interface DiagnosticResult {
  totalTasks: number;
  tasksByOrg: Array<{
    organization_id: string;
    organization_name: string;
    task_count: number;
  }>;
  ministerioSaude: Array<{
    id: string;
    name: string;
  }>;
  userProfile: {
    id: string;
    organization_id: string;
    organization_name: string;
    role: string;
  } | null;
  currentOrgId: string | null;
}

export function TaskDiagnostic() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Iniciando diagnóstico de tarefas...');

      // 1. Total de tarefas
      const { data: totalTasksData, error: totalError } = await supabase
        .from('tasks')
        .select('id', { count: 'exact' });
      
      if (totalError) throw totalError;

      // 2. Tarefas por organização
      const { data: tasksByOrgData, error: orgError } = await supabase
        .from('tasks')
        .select(`
          organization_id,
          organizations!inner(name)
        `);
      
      if (orgError) throw orgError;

      // Processar dados por organização
      const orgCounts = tasksByOrgData?.reduce((acc: any, task) => {
        const orgId = task.organization_id;
        const orgName = (task.organizations as any)?.name || 'Sem nome';
        
        if (!acc[orgId]) {
          acc[orgId] = {
            organization_id: orgId,
            organization_name: orgName,
            task_count: 0
          };
        }
        acc[orgId].task_count++;
        return acc;
      }, {});

      // 3. Verificar Ministério da Saúde
      const { data: ministerioData, error: ministerioError } = await supabase
        .from('organizations')
        .select('id, name')
        .ilike('name', '%ministério%saúde%');
      
      if (ministerioError) throw ministerioError;

      // 4. Perfil do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      let userProfile = null;
      
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select(`
            id,
            organization_id,
            role,
            organizations!inner(name)
          `)
          .eq('id', user.id)
          .single();
        
        if (!profileError && profileData) {
          userProfile = {
            id: profileData.id,
            organization_id: profileData.organization_id,
            organization_name: (profileData.organizations as any)?.name || 'Sem organização',
            role: profileData.role
          };
        }
      }

      // 5. Função de segurança
      const { data: currentOrgData, error: funcError } = await supabase
        .rpc('get_current_user_organization_id');
      
      const result: DiagnosticResult = {
        totalTasks: totalTasksData?.length || 0,
        tasksByOrg: Object.values(orgCounts || {}),
        ministerioSaude: ministerioData || [],
        userProfile,
        currentOrgId: currentOrgData || null
      };

      console.log('📊 Resultado do diagnóstico:', result);
      setDiagnostic(result);
      
    } catch (err: any) {
      console.error('❌ Erro no diagnóstico:', err);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createSampleTasks = async () => {
    if (!diagnostic?.userProfile?.organization_id) {
      setError('Organização do usuário não encontrada');
      return;
    }

    try {
      console.log('📝 Criando tarefas de exemplo...');
      
      const sampleTasks = [
        {
          title: 'Revisar documentos arquivísticos',
          description: 'Revisar e classificar documentos do acervo',
          assignee: 'Carlos Henrique',
          column_id: 'todo',
          organization_id: diagnostic.userProfile.organization_id,
          priority: 'medium'
        },
        {
          title: 'Digitalizar documentos históricos',
          description: 'Processo de digitalização de documentos antigos',
          assignee: 'Equipe de Digitalização',
          column_id: 'in_progress',
          organization_id: diagnostic.userProfile.organization_id,
          priority: 'high'
        },
        {
          title: 'Atualizar inventário',
          description: 'Atualizar o inventário de documentos arquivísticos',
          assignee: 'Arquivista Responsável',
          column_id: 'todo',
          organization_id: diagnostic.userProfile.organization_id,
          priority: 'low'
        }
      ];

      const { data, error } = await supabase
        .from('tasks')
        .insert(sampleTasks)
        .select();

      if (error) throw error;

      console.log('✅ Tarefas criadas:', data?.length);
      alert(`${data?.length} tarefas de exemplo criadas com sucesso!`);
      
      // Executar diagnóstico novamente para mostrar as novas tarefas
      await runDiagnostic();
      
    } catch (err: any) {
      console.error('❌ Erro ao criar tarefas:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Diagnóstico de Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runDiagnostic} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analisando...' : 'Executar Diagnóstico'}
            </Button>
            
            {diagnostic?.userProfile && (
              <Button 
                onClick={createSampleTasks} 
                variant="outline"
                disabled={loading}
              >
                Criar Tarefas de Exemplo
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {diagnostic && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total de Tarefas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {diagnostic.totalTasks}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sua Organização</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-medium">
                        {diagnostic.userProfile?.organization_name || 'Não encontrada'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Role: {diagnostic.userProfile?.role || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {diagnostic.userProfile?.organization_id || 'N/A'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tarefas por Organização</CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnostic.tasksByOrg.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      Nenhuma tarefa encontrada em nenhuma organização
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {diagnostic.tasksByOrg.map((org, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <div className="font-medium">{org.organization_name}</div>
                            <div className="text-xs text-gray-500">{org.organization_id}</div>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {org.task_count}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ministério da Saúde</CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnostic.ministerioSaude.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      Organização "Ministério da Saúde" não encontrada
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {diagnostic.ministerioSaude.map((org) => (
                        <div key={org.id} className="p-2 border rounded">
                          <div className="font-medium">{org.name}</div>
                          <div className="text-xs text-gray-500">{org.id}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {diagnostic.totalTasks === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Problema identificado:</strong> Não existem tarefas na base de dados. 
                    Elas podem ter sido excluídas por uma migração recente ou por algum problema técnico.
                    Você pode criar tarefas de exemplo usando o botão acima.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
