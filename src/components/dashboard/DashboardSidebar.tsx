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
    <Sidebar variant="inset" className="bg-white/10 backdrop-blur-lg border-white/20 text-white border-r transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,70,238,0.3)]">
      <SidebarContent className="px-4">
        <SidebarLogo />
        <SidebarMenuGroup label="SALE MODULE" items={saleModuleItems} />
        <SidebarMenuGroup label="GENERAL" items={generalItems} />
      </SidebarContent>

      <div className="px-4 py-6 mx-4 mb-8 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 transition-all duration-300 hover:border-white/20">
        <h3 className="font-semibold mb-2 text-white">Upgrade to PRO to get access all Features!</h3>
        <button className="w-full py-2 px-4 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white rounded-md hover:opacity-90 transition-all duration-300 hover:shadow-lg">
          Get Pro Now!
        </button>
      </div>

      <SidebarFooter className="border-t-0 p-4">
        <SidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}