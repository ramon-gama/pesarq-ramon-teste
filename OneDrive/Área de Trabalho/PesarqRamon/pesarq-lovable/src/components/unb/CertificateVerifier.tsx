
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, CheckCircle, XCircle } from "lucide-react";
import { verifyAuthCode } from "@/utils/declarationGenerator";

export function CertificateVerifier() {
  const [isOpen, setIsOpen] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    
    // Simular verificação (pode ser expandido para verificação em servidor)
    setTimeout(() => {
      const result = verifyAuthCode(authCode.toUpperCase());
      setVerificationResult(result);
      setIsVerifying(false);
    }, 1000);
  };

  const resetVerification = () => {
    setAuthCode("");
    setVerificationResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shield className="h-4 w-4" />
          Verificar Declaração
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#15AB92]" />
            Verificar Autenticidade
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authCode">Código de Autenticação</Label>
            <Input
              id="authCode"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="Ex: UNB123456ABCDEF"
              className="uppercase"
            />
            <p className="text-sm text-gray-500">
              Digite o código que aparece na declaração
            </p>
          </div>

          {verificationResult === null && (
            <Button 
              onClick={handleVerify}
              disabled={!authCode || isVerifying}
              className="w-full bg-[#15AB92] hover:bg-[#0d8f7a]"
            >
              <Search className="h-4 w-4 mr-2" />
              {isVerifying ? "Verificando..." : "Verificar"}
            </Button>
          )}

          {verificationResult !== null && (
            <div className="space-y-4">
              {verificationResult ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="space-y-2">
                      <p className="font-medium">Documento Autêntico</p>
                      <div className="space-y-1 text-sm">
                        <p><strong>Pesquisador:</strong> {verificationResult.researcherName}</p>
                        <p><strong>CPF:</strong> {verificationResult.cpf}</p>
                        <p><strong>Projeto:</strong> {verificationResult.projectTitle}</p>
                        <p><strong>Meta:</strong> {verificationResult.selectedGoal}</p>
                        <p><strong>Carga Horária:</strong> {verificationResult.hours}h</p>
                        <p><strong>Coordenador 1:</strong> {verificationResult.coordinator1}</p>
                        <p><strong>Coordenador 2:</strong> {verificationResult.coordinator2}</p>
                        <p><strong>Emitido em:</strong> {new Date(verificationResult.issueDate).toLocaleDateString('pt-BR')} às {verificationResult.issueTime}</p>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Verificado
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Código não encontrado</p>
                      <p className="text-sm">
                        O código informado não foi encontrado em nossa base de dados. 
                        Verifique se o código foi digitado corretamente.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={resetVerification}
                variant="outline"
                className="w-full"
              >
                Nova Verificação
              </Button>
            </div>
          )}

          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Como verificar:</strong> Localize o código de autenticação no final da declaração 
              e digite-o no campo acima para confirmar a autenticidade do documento.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
