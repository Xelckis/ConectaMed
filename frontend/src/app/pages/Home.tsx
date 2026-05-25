import { Link } from 'react-router';
import { Heart, Calendar, Users, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export function Home() {
  const features = [
    {
      icon: Calendar,
      title: 'Agenda Colaborativa',
      description: 'Organize consultas médicas com toda a família em um só lugar',
      color: 'text-primary bg-primary/10',
    },
    {
      icon: Users,
      title: 'Rede de Apoio',
      description: 'Convide familiares e cuidadores para ajudar no acompanhamento',
      color: 'text-accent bg-accent/10',
    },
    {
      icon: Shield,
      title: 'Controle de Permissões',
      description: 'Defina quem pode visualizar, editar ou excluir informações',
      color: 'text-warning bg-warning/10',
    },
    {
      icon: Clock,
      title: 'Histórico Completo',
      description: 'Mantenha registro de todas as consultas e exames realizados',
      color: 'text-info bg-info/10',
    },
  ];

  const benefits = [
    'Notificações e lembretes automáticos',
    'Acesso compartilhado seguro',
    'Interface simples e intuitiva',
    'Histórico médico organizado',
    'Calendário visual e prático',
    'Colaboração em tempo real',
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">ConectaMed</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary">Criar conta</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 -z-10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Heart className="w-4 h-4" />
              Cuidado compartilhado, saúde conectada
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Gerencie a saúde de quem você ama,{' '}
              <span className="text-primary">em família</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Uma plataforma colaborativa para familiares, cuidadores e pacientes organizarem
              consultas médicas, exames e o acompanhamento de saúde com segurança e carinho.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="primary" size="lg" className="gap-2 w-full sm:w-auto">
                  Começar gratuitamente
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Já tenho conta
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Sem cartão de crédito • Gratuito para sempre
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa para cuidar melhor
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades pensadas para facilitar o acompanhamento médico colaborativo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Organize consultas com toda a família
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                O ConectaMed facilita o cuidado compartilhado, permitindo que familiares
                e cuidadores colaborem no acompanhamento médico de forma organizada e segura.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10" />
              <Card className="border-2 border-border shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">Consulta Cardiologia</h4>
                        <p className="text-sm text-muted-foreground">Amanhã às 14:00</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                            M
                          </div>
                          <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                            P
                          </div>
                          <span className="text-xs text-muted-foreground">+2 membros</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">Rede de Apoio</h4>
                        <p className="text-sm text-muted-foreground">4 membros ativos</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-success" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">12 consultas realizadas</h4>
                        <p className="text-sm text-muted-foreground">Este ano</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Comece a cuidar melhor hoje
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de famílias que já organizam o cuidado médico de forma colaborativa e segura.
          </p>
          <Link to="/signup">
            <Button variant="primary" size="lg" className="gap-2">
              Criar conta gratuita
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">ConectaMed</p>
                <p className="text-xs text-muted-foreground">Cuidado compartilhado</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Sobre</a>
              <a href="#" className="hover:text-foreground transition-colors">Recursos</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="hover:text-foreground transition-colors">Contato</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 ConectaMed. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
