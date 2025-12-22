import { LoginPage } from "@/components/ui/animated-characters-login-page";

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const Login = ({ onLogin, onSignUp }: LoginProps) => {
  return <LoginPage onLogin={onLogin} onSignUp={onSignUp} />;
};

export default Login;
