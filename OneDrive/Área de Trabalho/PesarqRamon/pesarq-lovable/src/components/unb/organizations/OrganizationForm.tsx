import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, MapPin, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface OrganizationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: any) => void;
  initialData?: any;
  isEdit?: boolean;
}

export function OrganizationForm({ open, onOpenChange, onSave, initialData, isEdit }: OrganizationFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Dados Básicos
    name: "",
    cnpj: "",
    type: "",
    logo_url: "",
    
    // Endereço
    address: "",
    city: "",
    state: "",
    cep: "",
    
    // Contatos
    primaryContact: "",
    primaryEmail: "",
    primaryPhone: "",
    secondaryContact: "",
    secondaryEmail: "",
    secondaryPhone: ""
  });

  // Carregar dados iniciais quando estiver editando
  useEffect(() => {
    if (initialData && isEdit && open) {
      console.log('Loading initial data for edit:', initialData);
      setFormData({
        name: initialData.name || "",
        cnpj: initialData.cnpj || "",
        type: initialData.type || "",
        logo_url: initialData.logo_url || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        cep: initialData.cep || "",
        primaryContact: "",
        primaryEmail: initialData.contact_email || "",
        primaryPhone: initialData.contact_phone || "",
        secondaryContact: "",
        secondaryEmail: "",
        secondaryPhone: ""
      });
      setLogoPreview(initialData.logo_url || "");
    } else if (!isEdit && open) {
      // Reset form para nova organização
      setFormData({
        name: "", cnpj: "", type: "", logo_url: "",
        address: "", city: "", state: "", cep: "",
        primaryContact: "", primaryEmail: "", primaryPhone: "",
        secondaryContact: "", secondaryEmail: "", secondaryPhone: ""
      });
      setLogoPreview("");
    }
  }, [initialData, isEdit, open]);

  const organizationTypes = [
    { value: "federal", label: "Órgão Federal" },
    { value: "state", label: "Órgão Estadual" },
    { value: "municipal", label: "Órgão Municipal" },
    { value: "autarquia", label: "Autarquia" },
    { value: "fundacao", label: "Fundação Pública" },
    { value: "empresa", label: "Empresa Pública" },
    { value: "sociedade", label: "Sociedade de Economia Mista" },
    { value: "ong", label: "ONG/OSCIP" },
    { value: "privada", label: "Empresa Privada" }
  ];

  const states = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  // Verificar se os campos mínimos estão preenchidos
  const isFormValid = formData.name.trim() !== "" && formData.type !== "";

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Verificar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 2MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Converter para base64 para preview e armazenamento
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setFormData(prev => ({...prev, logo_url: result}));
        
        toast({
          title: "Sucesso",
          description: "Logo carregada com sucesso!",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da logo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeLogo = () => {
    setLogoPreview("");
    setFormData(prev => ({...prev, logo_url: ""}));
    
    // Reset input file
    const fileInput = document.getElementById('logo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      console.log('Form is not valid:', { name: formData.name, type: formData.type });
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios (Nome e Tipo).",
        variant: "destructive",
      });
      return;
    }

    if (onSave) {
      // Mapear os dados do formulário para a estrutura da tabela organizations
      const organizationData = {
        name: formData.name,
        acronym: formData.name.split(' ').map(word => word[0]).join('').toUpperCase() || null,
        cnpj: formData.cnpj || null,
        type: formData.type,
        status: 'ativa',
        logo_url: formData.logo_url || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        cep: formData.cep || null,
        contact_email: formData.primaryEmail || null,
        contact_phone: formData.primaryPhone || null
      };
      
      console.log('Submitting organization data:', organizationData);
      onSave(organizationData);
    }
    
    onOpenChange(false);
    
    // Reset form apenas se não for edição
    if (!isEdit) {
      setFormData({
        name: "", cnpj: "", type: "", logo_url: "",
        address: "", city: "", state: "", cep: "",
        primaryContact: "", primaryEmail: "", primaryPhone: "",
        secondaryContact: "", secondaryEmail: "", secondaryPhone: ""
      });
      setLogoPreview("");
      setActiveTab("basic");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form quando fechar
    if (!isEdit) {
      setFormData({
        name: "", cnpj: "", type: "", logo_url: "",
        address: "", city: "", state: "", cep: "",
        primaryContact: "", primaryEmail: "", primaryPhone: "",
        secondaryContact: "", secondaryEmail: "", secondaryPhone: ""
      });
      setLogoPreview("");
      setActiveTab("basic");
    }
  };

  // Função para gerar iniciais da organização
  const getOrgInitials = (name: string) => {
    return name
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Função para gerar cor baseada no nome
  const getOrgColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-indigo-500',
      'bg-red-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {isEdit ? "Editar Organização" : "Nova Organização Parceira"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEdit ? "Edite as informações da organização" : "Cadastre uma nova organização para gestão de propostas e projetos"}
          </DialogDescription>
        </DialogHeader>

        {/* Preview da Organização */}
        {formData.name && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                {logoPreview ? (
                  <AvatarImage src={logoPreview} alt={formData.name} className="object-contain" />
                ) : (
                  <AvatarFallback className={`${getOrgColor(formData.name)} text-white text-sm font-semibold`}>
                    {getOrgInitials(formData.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{formData.name}</h3>
                {formData.type && (
                  <p className="text-sm text-slate-600">
                    {organizationTypes.find(t => t.value === formData.type)?.label}
                  </p>
                )}
                {(formData.city || formData.state) && (
                  <p className="text-xs text-slate-500">
                    {[formData.city, formData.state].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="text-xs sm:text-sm">
              <Building2 className="h-4 w-4 mr-1" />
              Básicos
            </TabsTrigger>
            <TabsTrigger value="address" className="text-xs sm:text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              Endereço
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs sm:text-sm">
              <Users className="h-4 w-4 mr-1" />
              Contatos
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="mt-6">
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Nome da Organização *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Ministério da Cultura"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="logo">Logo da Organização</Label>
                  <div className="space-y-4">
                    {logoPreview ? (
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16 border-2 border-gray-200">
                            <AvatarImage src={logoPreview} alt="Logo" className="object-contain" />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {getOrgInitials(formData.name)}
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={removeLogo}
                            disabled={isUploading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Logo carregada com sucesso</p>
                          <p className="text-xs text-gray-500">Clique no X para remover</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label 
                          htmlFor="logo" 
                          className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {isUploading ? "Carregando..." : "Clique para fazer upload da logo"}
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG ou SVG até 2MB
                          </p>
                        </label>
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo de Organização *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Rua, avenida, número"
                  />
                </div>

                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Nome da cidade"
                  />
                </div>

                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => setFormData({...formData, cep: e.target.value})}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contato Principal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryContact">Nome</Label>
                    <Input
                      id="primaryContact"
                      value={formData.primaryContact}
                      onChange={(e) => setFormData({...formData, primaryContact: e.target.value})}
                      placeholder="Nome do responsável"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryEmail">E-mail</Label>
                    <Input
                      id="primaryEmail"
                      type="email"
                      value={formData.primaryEmail}
                      onChange={(e) => setFormData({...formData, primaryEmail: e.target.value})}
                      placeholder="email@organização.gov.br"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryPhone">Telefone</Label>
                    <Input
                      id="primaryPhone"
                      value={formData.primaryPhone}
                      onChange={(e) => setFormData({...formData, primaryPhone: e.target.value})}
                      placeholder="(61) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Contato Secundário</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="secondaryContact">Nome</Label>
                    <Input
                      id="secondaryContact"
                      value={formData.secondaryContact}
                      onChange={(e) => setFormData({...formData, secondaryContact: e.target.value})}
                      placeholder="Nome do contato alternativo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryEmail">E-mail</Label>
                    <Input
                      id="secondaryEmail"
                      type="email"
                      value={formData.secondaryEmail}
                      onChange={(e) => setFormData({...formData, secondaryEmail: e.target.value})}
                      placeholder="email2@organização.gov.br"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryPhone">Telefone</Label>
                    <Input
                      id="secondaryPhone"
                      value={formData.secondaryPhone}
                      onChange={(e) => setFormData({...formData, secondaryPhone: e.target.value})}
                      placeholder="(61) 88888-8888"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 mt-6 border-t">
              <div className="flex gap-2">
                {activeTab !== "basic" && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      const tabs = ["basic", "address", "contacts"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                    }}
                  >
                    Anterior
                  </Button>
                )}
                {activeTab !== "contacts" && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const tabs = ["basic", "address", "contacts"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
                    }}
                  >
                    Próximo
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#15AB92] hover:bg-[#0d8f7a]"
                  disabled={!isFormValid || isUploading}
                >
                  {isEdit ? "Salvar Alterações" : "Cadastrar Organização"}
                </Button>
              </div>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
