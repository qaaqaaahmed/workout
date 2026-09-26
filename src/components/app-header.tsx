import { SidebarTrigger } from "./ui/sidebar";

export const AppHeader = () => {
  return (
    <header className="flex items-center gap-2 px-4 border-b bg-background h-14">
      <SidebarTrigger />
    </header>
  );
};
