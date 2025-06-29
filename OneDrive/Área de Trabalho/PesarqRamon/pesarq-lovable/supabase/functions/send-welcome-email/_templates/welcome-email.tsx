import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Img,
  Hr,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
  resetPasswordUrl: string;
  platformUrl: string;
}

export const WelcomeEmail = ({
  userName,
  userEmail,
  resetPasswordUrl,
  platformUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo à Plataforma PESARQ! Configure sua conta</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${platformUrl}/lovable-uploads/d22baaee-7b5f-4f5e-80ba-79dcbb53e589.png`}
            width="200"
            height="50"
            alt="PESARQ"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Bem-vindo à PESARQ!</Heading>
        
        <Text style={text}>
          Olá <strong>{userName}</strong>,
        </Text>
        
        <Text style={text}>
          É com grande satisfação que te damos as boas-vindas à Plataforma PESARQ! 
          Sua solicitação de acesso foi <strong>aprovada</strong> e você agora faz parte da nossa comunidade 
          de pesquisa em gestão documental e arquivística.
        </Text>

        <Section style={welcomeBox}>
          <Text style={boxTitle}>🎉 Sua conta foi aprovada!</Text>
          <Text style={boxText}>
            <strong>Email:</strong> {userEmail}<br/>
            <strong>Nome:</strong> {userName}
          </Text>
        </Section>

        <Text style={text}>
          Para começar a utilizar a plataforma, você precisa <strong>definir sua senha de acesso</strong>. 
          Clique no botão abaixo para configurar sua conta:
        </Text>

        <Section style={buttonContainer}>
          <Link href={resetPasswordUrl} style={button}>
            Configurar Minha Senha
          </Link>
        </Section>

        <Text style={text}>
          Ou copie e cole este link no seu navegador:
        </Text>
        <Text style={linkText}>{resetPasswordUrl}</Text>

        <Hr style={hr} />

        <Section style={importantSection}>
          <Text style={sectionTitle}>⚠️ Importante:</Text>
          <Text style={listItem}>• Este link é válido por 24 horas</Text>
          <Text style={listItem}>• Após configurar sua senha, você poderá fazer login normalmente</Text>
          <Text style={listItem}>• Mantenha suas credenciais em local seguro</Text>
        </Section>

        <Hr style={hr} />

        <Section style={infoSection}>
          <Text style={sectionTitle}>📋 O que você pode fazer na plataforma:</Text>
          <Text style={listItem}>• Participar de diagnósticos de maturidade arquivística</Text>
          <Text style={listItem}>• Acessar ferramentas de gestão documental</Text>
          <Text style={listItem}>• Colaborar em projetos de pesquisa</Text>
          <Text style={listItem}>• Conectar-se com outros profissionais</Text>
          <Text style={listItem}>• Acompanhar métricas e relatórios</Text>
        </Section>

        <Hr style={hr} />

        <Section style={supportSection}>
          <Text style={sectionTitle}>💬 Precisa de ajuda?</Text>
          <Text style={text}>
            Nossa equipe está aqui para te ajudar! Entre em contato conosco:
          </Text>
          <Text style={supportText}>
            📧 Email: <Link href="mailto:suporte@pesarq.unb.br" style={link}>suporte@pesarq.unb.br</Link><br/>
            🌐 Site: <Link href={platformUrl} style={link}>{platformUrl}</Link>
          </Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Este email foi enviado automaticamente pela Plataforma PESARQ.<br/>
          <Link href={platformUrl} style={footerLink}>
            Universidade de Brasília - Faculdade de Ciência da Informação
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const logoContainer = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const logo = {
  margin: '0 auto',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
}

const welcomeBox = {
  backgroundColor: '#f0f9ff',
  border: '1px solid #0ea5e9',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '20px',
}

const boxTitle = {
  color: '#0369a1',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
}

const boxText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#0ea5e9',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const linkText = {
  color: '#0ea5e9',
  fontSize: '14px',
  margin: '8px 40px',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 40px',
}

const infoSection = {
  margin: '24px 40px',
}

const supportSection = {
  margin: '24px 40px',
}

const sectionTitle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
}

const listItem = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
}

const supportText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const link = {
  color: '#0ea5e9',
  textDecoration: 'underline',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '24px 40px 0',
  textAlign: 'center' as const,
}

const footerLink = {
  color: '#0ea5e9',
  textDecoration: 'underline',
}

const importantSection = {
  margin: '24px 40px',
  backgroundColor: '#fef3c7',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #f59e0b',
}
