import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';
import { Toaster } from 'sonner';
export function AppShell({ children }: { children: React.ReactNode }) { return <div className="min-h-screen flex"><Sidebar /><main className="flex-1 min-w-0 p-4 sm:p-6 pb-24 lg:pb-6"><Toaster richColors position="top-right" />{children}</main><BottomNav /></div>; }
