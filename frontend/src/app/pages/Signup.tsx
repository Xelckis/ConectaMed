import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Heart, Check, X } from 'lucide-react';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!isPasswordValid) {
      setError('A senha não atende aos requisitos mínimos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.';
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
            <h2 className="text-2xl font-semibold mb-6">Criar sua conta</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="text"
                label="Nome completo"
                placeholder="Maria Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />

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

              {password && (
                <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Requisitos da senha:
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { met: passwordRequirements.length, text: 'Mínimo 8 caracteres' },
                      { met: passwordRequirements.uppercase, text: 'Uma letra maiúscula' },
                      { met: passwordRequirements.lowercase, text: 'Uma letra minúscula' },
                      { met: passwordRequirements.number, text: 'Um número' },
                    ].map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {req.met ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={`text-sm ${req.met ? 'text-success' : 'text-muted-foreground'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Input
                type="password"
                label="Confirmar senha"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />

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
                Criar conta
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 items-center justify-center p-12">
        <div className="max-w-lg text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/90 shadow-lg mb-4">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-foreground">
            Comece a cuidar melhor
          </h2>
          <p className="text-lg text-muted-foreground">
            Organize consultas, compartilhe informações médicas e mantenha toda a família
            conectada no cuidado com quem você ama.
          </p>
        </div>
      </div>
    </div>
  );
}
