
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ModernDashboard } from "@/components/dashboard/ModernDashboard";
import { ModernLayout } from "@/components/layout/ModernLayout";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import { ArrowLeft, Menu, X, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { DadosFisicosForm } from "@/components/DadosFisicosForm";
import AvaliacaoSemanal from "@/components/AvaliacaoSemanal";
import { RealUserRanking } from "@/components/RealUserRanking";
import MinhasMetas from "@/components/MinhasMetas";
import Desafios from "@/components/Desafios";
import DiarioSaude from "@/components/DiarioSaude";
import MissaoDia from "@/components/MissaoDia";
import { BeneficiosVisuais } from "@/components/BeneficiosVisuais";
import { ProgressCharts } from "@/components/ProgressCharts";
import { TesteSabotadores } from "@/components/TesteSabotadores";
import { useGoals } from "@/hooks/useGoals";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { ClientSessions } from "@/components/sessions/ClientSessions";
import { RequiredDataModal } from "@/components/RequiredDataModal";
import { PaidCourses } from "@/components/courses/PaidCourses";
import BibliotecaCursos from "@/components/BibliotecaCursos";
import { AdvancedHealthDashboard } from "@/components/dashboard/AdvancedHealthDashboard";
import { HealthLayout } from "@/components/layout/HealthLayout";
import SilhuetaDemo from "@/components/demo/SilhuetaDemo";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home,
  Trophy,
  Calendar,
  Target,
  Award,
  FileText,
  Settings,
  BarChart3,
  Scale,
  GraduationCap,
  User,
  Activity
} from "lucide-react";

// Dados mock para ranking
const topRankingUsers = [
  {id: 1, name: "Ana Silva", points: 3200, position: 1, lastPosition: 2, streak: 25, completedChallenges: 28, cidade: "São Paulo", trend: 'up' as const, positionChange: 1},
  {id: 2, name: "Carlos Santos", points: 2800, position: 2, lastPosition: 1, streak: 20, completedChallenges: 22, cidade: "Rio de Janeiro", trend: 'down' as const, positionChange: 1},
  {id: 3, name: "Maria Costa", points: 2400, position: 3, lastPosition: 3, streak: 15, completedChallenges: 18, cidade: "Belo Horizonte", trend: 'stable' as const, positionChange: 0},
];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [rankingTimeFilter, setRankingTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'inicio', label: 'Missão do Dia', icon: Activity },
    { id: 'biblioteca-cursos', label: 'Biblioteca de Cursos', icon: GraduationCap },
    { id: 'cursos-pagos', label: 'Cursos Pagos', icon: GraduationCap },
    { id: 'sessoes', label: 'Sessões', icon: FileText },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'avaliacao-semanal', label: 'Avaliação Semanal', icon: Calendar },
    { id: 'metas', label: 'Minhas Metas', icon: Target },
    { id: 'desafios', label: 'Desafios', icon: Award },
    { id: 'diario', label: 'Diário de Saúde', icon: FileText },
    { id: 'teste-sabotadores', label: 'Teste de Sabotadores', icon: Settings },
    { id: 'meu-progresso', label: 'Meu Progresso', icon: BarChart3 },
    { id: 'analise-avancada', label: 'Análise Avançada', icon: BarChart3 },
    { id: 'silhueta-3d', label: 'Silhueta 3D', icon: User },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ModernDashboard user={{name: user?.email?.split('@')[0] || 'Usuário'}} />;
      case 'inicio':
        return <MissaoDia isVisitor={false} />;
      case 'biblioteca-cursos':
        return <BibliotecaCursos />;
      case 'cursos-pagos':
        return <PaidCourses />;
      case 'sessoes':
        return <ClientSessions />;
      case 'ranking':
        return (
          <RealUserRanking 
            timeFilter={rankingTimeFilter}
            onTimeFilterChange={setRankingTimeFilter}
          />
        );
      case 'avaliacao-semanal':
        return <AvaliacaoSemanal />;
      case 'metas':
        return <MinhasMetas userType="cliente" />;
      case 'desafios':
        return <Desafios />;
      case 'diario':
        return <DiarioSaude />;
      case 'teste-sabotadores':
        return <TesteSabotadores />;
      case 'meu-progresso':
        return (
          <div className="space-y-8">
            <BeneficiosVisuais />
            <ProgressCharts />
          </div>
        );
      case 'analise-avancada':
        return <AdvancedHealthDashboard />;
      case 'silhueta-3d':
        return <SilhuetaDemo />;
      default:
        return <ModernDashboard user={{name: user?.email?.split('@')[0] || 'Usuário'}} />;
    }
  };

  const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gradient hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Link>
          ) : (
            <Link 
              to="/" 
              className="flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          
          {/* Botão de colapsar - só no desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <ModernButton
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={isCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </ModernButton>
          </div>
          
          {/* Botão de fechar mobile */}
          <ModernButton
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </ModernButton>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-border">
          <UserProfileMenu />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 scrollbar-modern">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              className="relative group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ModernButton
                variant={activeSection === item.id ? "gradient" : "ghost"}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full justify-start gap-3 transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'glow-primary shadow-lg scale-105' 
                    : 'hover:bg-muted/50 hover:scale-105'
                } ${isCollapsed ? 'px-2' : 'px-4'}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </ModernButton>
              
              {/* Tooltip para modo colapsado */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-card border border-border text-card-foreground text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-lg pointer-events-none">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card border-l border-b border-border rotate-45"></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <ModernButton
          onClick={signOut}
          variant="ghost"
          className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'} text-muted-foreground hover:text-foreground hover:bg-muted/50`}
          title={isCollapsed ? "Sair" : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </ModernButton>
      </div>
    </div>
  );

  return (
    <ModernLayout variant="default">
      <div className="min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden glass-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <ModernButton
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </ModernButton>
            <h1 className="text-xl font-semibold text-gradient">
              {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <motion.div 
            animate={{ 
              width: sidebarCollapsed ? '80px' : '280px' 
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden lg:flex lg:flex-col glass-card border-r border-border"
          >
            <SidebarContent isCollapsed={sidebarCollapsed} />
          </motion.div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: "spring", damping: 30, stiffness: 150 }}
                  className="lg:hidden fixed left-0 top-0 bottom-0 w-80 glass-card border-r border-border z-50"
                >
                  <SidebarContent isCollapsed={false} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-h-screen">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>

        {/* Required Data Modal */}
        <RequiredDataModal />
      </div>
    </ModernLayout>
  );
};

export default Dashboard;