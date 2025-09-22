import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarMenuGroupProps {
  label: string;
  items: MenuItem[];
}

export const SidebarMenuGroup = ({ label, items }: SidebarMenuGroupProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/70 font-normal text-sm">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="hover:bg-white/10 text-white/90 hover:text-white transition-all duration-300 rounded-lg hover:backdrop-blur-sm"
              >
                <Link to={item.path} className="flex items-center gap-3 px-3 py-2">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};