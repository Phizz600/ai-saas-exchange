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
      <SidebarGroupLabel className="text-gray-300 font-normal text-sm">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="hover:bg-accent2 text-gray-100 hover:text-white transition-colors rounded-lg"
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