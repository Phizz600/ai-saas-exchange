import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarMenuGroup } from "./sidebar/SidebarMenuGroup";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { saleModuleItems, generalItems } from "./sidebar/menu-items";

export function DashboardSidebar() {
  return (
    <Sidebar variant="inset" className="bg-accent text-white border-r-0">
      <SidebarContent className="px-4">
        <SidebarLogo />
        <SidebarMenuGroup label="SALE MODULE" items={saleModuleItems} />
        <SidebarMenuGroup label="GENERAL" items={generalItems} />
      </SidebarContent>

      <div className="px-4 py-6 mx-4 mb-8 bg-accent2 rounded-lg">
        <h3 className="font-semibold mb-2">Upgrade to PRO to get access all Features!</h3>
        <button className="w-full py-2 px-4 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white rounded-md hover:opacity-90 transition-colors">
          Get Pro Now!
        </button>
      </div>

      <SidebarFooter className="border-t-0 p-4">
        <SidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}