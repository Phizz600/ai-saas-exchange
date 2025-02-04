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
    <Sidebar variant="inset" className="bg-[#6C47FF] text-white border-r-0">
      <SidebarContent className="px-4">
        <SidebarLogo />
        <SidebarMenuGroup label="SALE MODULE" items={saleModuleItems} />
        <SidebarMenuGroup label="GENERAL" items={generalItems} />
      </SidebarContent>

      <div className="px-4 py-6 mx-4 mb-8 bg-[#5B3DF5] rounded-lg">
        <h3 className="font-semibold mb-2">Upgrade to PRO to get access all Features!</h3>
        <button className="w-full py-2 px-4 bg-white text-[#6C47FF] rounded-md hover:bg-gray-100 transition-colors">
          Get Pro Now!
        </button>
      </div>

      <SidebarFooter className="border-t-0 p-4">
        <SidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}