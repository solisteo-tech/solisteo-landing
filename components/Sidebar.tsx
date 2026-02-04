'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import {
  Home,
  Menu,
  Settings,
  Package,
  AlertTriangle,
  TrendingUp,
  User,
  Database,
  CreditCard,
  FileText,
  BarChart3,
  LayoutDashboard,
  Activity,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Users,
  Server,
  Globe,
  LayoutTemplate
} from 'lucide-react';

// Grouped admin navigation with collapsible sections
const adminNavigationGroups = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    ]
  },
  {
    name: 'User Management',
    icon: Users,
    items: [
      { name: 'Users', href: '/admin/users', icon: User },
      { name: 'Companies', href: '/admin/companies', icon: Database },
      { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
      { name: 'Billing', href: '/admin/billing', icon: CreditCard },
    ]
  },
  {
    name: 'System',
    icon: Server,
    items: [
      { name: 'Usage', href: '/admin/usage', icon: Activity },
      { name: 'Logs', href: '/admin/logs', icon: FileText },
      { name: 'Alerts', href: '/admin/alerts', icon: AlertTriangle },
      { name: 'Listing Health', href: '/admin/listing-health-monitor', icon: Activity },
    ]
  },
  {
    name: 'Support',
    items: [
      { name: 'Support', href: '/admin/support', icon: MessageSquare },
    ]
  },
  {
    name: 'Configuration',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  },
];

const sellerNavigationGroups = [
  { name: 'Dashboard', href: '/seller/dashboard', icon: Home },
  { name: 'Business Intelligence', href: '/seller/sales-inventory', icon: LayoutDashboard },
  { name: 'Sales', href: '/seller/sales', icon: TrendingUp },
  { name: 'Inventory', href: '/seller/inventory', icon: Package },
  {
    name: 'Listing Health',
    icon: Activity,
    items: [
      { name: 'Your Inventory Listings', href: '/seller/listing-health/inventory', icon: Package },
      { name: 'Listing Health Search', href: '/seller/listing-health/search', icon: BarChart3 },
    ]
  },
  { name: 'Ads Hub', href: '/seller/advertisement-analytics', icon: BarChart3 },
  { name: 'Market Research', href: '/seller/market-research', icon: Globe },
  { name: 'Custom Dashboard', href: '/seller/custom-dashboard', icon: LayoutTemplate },
  { name: 'Team', href: '/seller/team', icon: Users, roleRequired: 'owner' },
  { name: 'Settings', href: '/seller/settings', icon: Settings },
];

const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const planAccess = usePlanAccess();
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Overview', 'User Management', 'System', 'Support', 'Configuration']);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // Filter seller navigation based on plan features
  const filteredSellerNavigation = sellerNavigationGroups.filter((item: any) => {
    if (isAdmin) return true;

    // Check role requirements
    if (item.roleRequired && item.roleRequired !== user?.role) {
      return false;
    }


    const featureRequirements: { [key: string]: string[] } = {
      'Dashboard': [],
      'Business Intelligence': ['sales_inventory'],
      'Sales': ['sales'],
      'Inventory': ['inventory'],
      'Listing Health': ['listing_health'],
      'Ads Hub': ['advertisement_analytics'],
      'Market Research': ['market_research'],
      'Custom Dashboard': ['custom_dashboard'],
      'Team': [],
      'Settings': [],
    };

    const requiredFeatures = featureRequirements[item.name] || [];
    return requiredFeatures.length === 0 || requiredFeatures.some(feature =>
      planAccess.planFeatures?.includes(feature)
    );
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <div className={cn("flex flex-col h-full", isMobile ? "w-full" : "w-64")}>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {isAdmin ? (
          // Admin navigation with groups
          adminNavigationGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.name);
            const hasActiveItem = group.items.some(item => pathname === item.href);

            return (
              <div key={group.name} className="mb-2">
                {group.items.length === 1 ? (
                  // Single item - render directly without group header
                  group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start transition-all hover:scale-[1.02]",
                            isActive && "bg-secondary"
                          )}
                        >
                          <item.icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </Button>
                      </Link>
                    );
                  })
                ) : (
                  // Multiple items - render with collapsible group
                  <>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1",
                        hasActiveItem && "text-foreground"
                      )}
                      onClick={() => toggleGroup(group.name)}
                    >
                      <span className="flex items-center">
                        {group.icon && <group.icon className="mr-2 h-3 w-3" />}
                        {group.name}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 ml-2">
                            {group.items.map((item) => {
                              const isActive = pathname === item.href;
                              return (
                                <Link key={item.name} href={item.href}>
                                  <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    size="sm"
                                    className={cn(
                                      "w-full justify-start transition-all hover:scale-[1.02]",
                                      isActive && "bg-secondary"
                                    )}
                                  >
                                    <item.icon className="mr-3 h-4 w-4" />
                                    {item.name}
                                  </Button>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            );
          })
        ) : (
          // Seller navigation with groups
          filteredSellerNavigation.map((item: any) => {
            // Check if item has sub-items (is a group)
            if (item.items) {
              const isExpanded = expandedGroups.includes(item.name);
              const hasActiveItem = item.items.some((subItem: any) => pathname === subItem.href || pathname.startsWith(subItem.href));

              return (
                <div key={item.name} className="mb-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between font-medium mb-1",
                      hasActiveItem
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => toggleGroup(item.name)}
                  >
                    <span className="flex items-center">
                      <item.icon className={cn("mr-3 h-4 w-4", hasActiveItem ? "text-blue-700" : "text-gray-500")} />
                      {item.name}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 ml-6">
                          {item.items.map((subItem: any) => {
                            const isActive = pathname === subItem.href;
                            return (
                              <Link key={subItem.name} href={subItem.href}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "w-full justify-start transition-all hover:scale-[1.02] font-normal",
                                    isActive
                                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  )}
                                >
                                  <subItem.icon className={cn("mr-3 h-4 w-4", isActive ? "text-blue-700" : "text-gray-500")} />
                                  {subItem.name}
                                </Button>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // Regular item without sub-items
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start transition-all hover:scale-[1.02] mb-1 font-medium",
                    isActive
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("mr-3 h-4 w-4", isActive ? "text-blue-700" : "text-gray-500")} />
                  {item.name}
                </Button>
              </Link>
            );
          })
        )}
      </nav>
    </div>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:top-16 md:left-0 md:h-[calc(100vh-4rem)]">
        <div className="flex-1 flex flex-col bg-card border-r overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="fixed top-16 left-4 z-40 md:hidden"
              size="icon"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;
