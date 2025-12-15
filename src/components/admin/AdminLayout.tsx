import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Package,
  Lightbulb,
  Settings,
  Image,
  Tag,
  Layers,
  FileEdit,
  FolderOpen,
  Globe,
  Menu,
  X,
  LogOut,
  Home,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  link: string;
  badge?: string | number;
  children?: MenuItem[];
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      link: "/admin",
    },
    {
      title: "Conteúdo",
      icon: FileText,
      link: "#",
      children: [
        {
          title: "Home",
          icon: Home,
          link: "/admin/home",
        },
        {
          title: "Blog",
          icon: FileText,
          link: "/admin/blog",
        },
        {
          title: "Páginas Personalizadas",
          icon: Globe,
          link: "/admin/pages",
        },
      ],
    },
    {
      title: "Produtos",
      icon: Package,
      link: "#",
      children: [
        {
          title: "Famílias de Produtos",
          icon: Package,
          link: "/admin/product-families",
        },
        {
          title: "Variantes de Produtos",
          icon: Layers,
          link: "/admin/product-variants",
        },
        {
          title: "Editor de Páginas",
          icon: FileEdit,
          link: "/admin/page-editor",
        },
      ],
    },
    {
      title: "Soluções",
      icon: Lightbulb,
      link: "/admin/verticals",
    },
    {
      title: "Marcas",
      icon: Tag,
      link: "/admin/brands",
    },
    {
      title: "Mídia",
      icon: FolderOpen,
      link: "/admin/media-library",
    },
    {
      title: "Configurações",
      icon: Settings,
      link: "/admin/settings",
    },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const isActive = (link: string) => {
    if (link === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(link);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.link);

    if (hasChildren) {
      return (
        <div key={item.title} className="mb-1">
          <div
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              active
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="mr-3 h-5 w-5" />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          {item.children && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        to={item.link}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-1 ${
          active
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Icon className="mr-3 h-5 w-5" />
        <span className="flex-1">{item.title}</span>
        {item.badge && (
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo/Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <h1 className="text-xl font-heading font-bold text-navy-deep">
              AERION CMS
            </h1>
          ) : (
            <div className="w-8 h-8 bg-blue-medium rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8"
          >
            {sidebarOpen ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4 rotate-180" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">{menuItems.map((item) => renderMenuItem(item))}</div>
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-medium rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              {sidebarOpen && "Site"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {sidebarOpen && "Sair"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl overflow-y-auto">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
              <h1 className="text-xl font-heading font-bold text-navy-deep">
                AERION CMS
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-4">
              <div className="space-y-1">
                {menuItems.map((item) => renderMenuItem(item))}
              </div>
            </nav>
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-medium rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Site
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 md:ml-0">
            <h2 className="text-lg font-heading font-semibold text-navy-deep">
              {menuItems
                .flatMap((item) => [
                  item,
                  ...(item.children || []),
                ])
                .find((item) => isActive(item.link))?.title || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="hidden sm:flex"
            >
              <Home className="h-4 w-4 mr-2" />
              Ver Site
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

