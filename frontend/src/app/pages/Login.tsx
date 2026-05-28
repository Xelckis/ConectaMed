import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Heart } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Email ou senha incorretos';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">ConectaMed</h1>
            <p className="text-muted-foreground">
              Cuidado compartilhado, saúde conectada
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
            <h2 className="text-2xl font-semibold mb-6">Entrar na sua conta</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="Email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              <Input
                type="password"
                label="Senha"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">Lembrar de mim</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Entrar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Criar conta
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 items-center justify-center p-12">
        <div className="max-w-lg text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/90 shadow-lg mb-4">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-foreground">
            Gerencie consultas em família
          </h2>
          <p className="text-lg text-muted-foreground">
            Uma plataforma colaborativa para familiares, cuidadores e pacientes organizarem
            a rotina médica com segurança e carinho.
          </p>
        </div>
      </div>
    </div>
  );
}
