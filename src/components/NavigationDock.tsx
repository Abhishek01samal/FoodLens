import { Home, BarChart3, Leaf, AlertCircle, ShoppingCart, Lightbulb, Factory, Package, Activity, TrendingDown, Menu as MenuIcon, X } from "lucide-react";
import { MenuItem, MenuContainer } from "./ui/fluid-menu";

interface NavigationDockProps {
  onNavigate: (section: string) => void;
}

export const NavigationDock = ({ onNavigate }: NavigationDockProps) => {
  const navItems = [
    { title: "Overview", icon: Home, section: "overview" },
    { title: "Product Details", icon: Package, section: "details" },
    { title: "Company", icon: Factory, section: "company" },
    { title: "Health Score", icon: BarChart3, section: "health" },
    { title: "Ingredients", icon: Leaf, section: "ingredients" },
    { title: "Daily Intake", icon: Activity, section: "daily-intake" },
    { title: "What's Lacking", icon: TrendingDown, section: "lacking" },
    { title: "Environment", icon: AlertCircle, section: "environment" },
    { title: "Alternatives", icon: ShoppingCart, section: "alternatives" },
    { title: "Tips", icon: Lightbulb, section: "tips" },
  ];

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <MenuContainer>
        <MenuItem 
          icon={
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:rotate-180">
                <MenuIcon size={24} strokeWidth={1.5} className="text-primary/80" />
              </div>
              <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0">
                <X size={24} strokeWidth={1.5} className="text-primary/80" />
              </div>
            </div>
          } 
        />
        {navItems.map((item) => (
          <MenuItem 
            key={item.section}
            icon={<item.icon size={24} strokeWidth={1.5} className="text-primary/80" />}
            onClick={() => onNavigate(item.section)}
          />
        ))}
      </MenuContainer>
    </div>
  );
};
