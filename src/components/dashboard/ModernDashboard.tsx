import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardContent } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Activity, Heart, TrendingUp, Users, Calendar, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernDashboardProps {
  user?: {
    name?: string;
    avatar?: string;
  };
}

export const ModernDashboard: React.FC<ModernDashboardProps> = ({ user }) => {
  const stats = [
    {
      title: "Peso Atual",
      value: "72.5 kg",
      change: "-2.3 kg",
      trend: "down",
      icon: Heart,
      color: "text-health-heart"
    },
    {
      title: "IMC",
      value: "22.4",
      change: "Normal",
      trend: "stable",
      icon: Activity,
      color: "text-health-steps"
    },
    {
      title: "Progresso",
      value: "68%",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "text-health-weight"
    },
    {
      title: "Streak",
      value: "15 dias",
      change: "Novo recorde!",
      trend: "up",
      icon: Target,
      color: "text-health-calories"
    }
  ];

  const quickActions = [
    { label: "Nova Pesagem", icon: Heart, variant: "gradient" as const },
    { label: "Missão do Dia", icon: Calendar, variant: "glow" as const },
    { label: "Acompanhar Evolução", icon: TrendingUp, variant: "glass" as const }
  ];

  return (
    <ModernLayout variant="default">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient animate-fade-up">
              Olá, {user?.name || 'Usuário'}! 👋
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-up delay-100">
              Vamos continuar sua jornada de transformação
            </p>
          </div>
          
          <div className="flex gap-3 animate-fade-up delay-200">
            {quickActions.map((action, index) => (
              <ModernButton
                key={action.label}
                variant={action.variant}
                size="lg"
                className="flex-1 lg:flex-none"
              >
                <action.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{action.label}</span>
              </ModernButton>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <ModernCard
              key={stat.title}
              variant="glass"
              className={cn(
                "animate-fade-up",
                `delay-${(index + 3) * 100}`
              )}
            >
              <ModernCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className={cn(
                      "text-sm font-medium flex items-center gap-1",
                      stat.trend === 'up' ? 'text-health-weight' : 
                      stat.trend === 'down' ? 'text-health-heart' : 
                      'text-health-steps'
                    )}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={cn(
                    "p-3 rounded-full bg-background/50",
                    stat.color
                  )}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Chart */}
          <ModernCard variant="default" className="lg:col-span-2 animate-fade-up delay-700">
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Evolução do Peso
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de evolução aqui</p>
              </div>
            </ModernCardContent>
          </ModernCard>

          {/* Recent Activity */}
          <ModernCard variant="glass" className="animate-fade-up delay-800">
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Atividades Recentes
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent className="space-y-4">
              {[
                { action: "Pesagem realizada", time: "Hoje, 07:30", icon: Heart },
                { action: "Missão completada", time: "Ontem, 20:15", icon: Target },
                { action: "Meta atingida", time: "2 dias atrás", icon: TrendingUp },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                  <div className="p-2 rounded-full bg-primary/10">
                    <activity.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModernCard variant="gradient" className="animate-fade-up delay-900">
            <ModernCardHeader>
              <ModernCardTitle className="text-white">
                Próximos Objetivos
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent className="space-y-3">
              {[
                { goal: "Perder 3kg até final do mês", progress: 60 },
                { goal: "Completar 30 dias de streak", progress: 80 },
                { goal: "Reduzir circunferência em 2cm", progress: 40 }
              ].map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-white">
                    <span className="text-sm">{goal.goal}</span>
                    <span className="text-sm font-medium">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </ModernCardContent>
          </ModernCard>

          <ModernCard variant="glow" className="animate-fade-up delay-1000">
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Ranking Semanal
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="space-y-3">
                {[
                  { name: "Você", points: 1250, position: 3 },
                  { name: "Ana Silva", points: 1380, position: 1 },
                  { name: "João Pedro", points: 1290, position: 2 },
                ].map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      user.position === 1 ? "bg-yellow-500 text-black" :
                      user.position === 2 ? "bg-gray-400 text-white" :
                      user.position === 3 ? "bg-amber-600 text-white" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {user.position}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.points} pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>
      </div>
    </ModernLayout>
  );
};