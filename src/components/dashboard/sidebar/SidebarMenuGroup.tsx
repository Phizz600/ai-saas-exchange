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
      <SidebarGroupLabel className="text-gray-400 font-normal">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="hover:bg-purple-50 text-gray-600 hover:text-purple-600"
              >
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};