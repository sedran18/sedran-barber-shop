import MenuAdmin from "@/components/Admin/menu"; // Importando o index que coordena Desktop/Mobile
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  const userRole = session?.user?.role;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--background-2)]">
      {
        userRole &&  <MenuAdmin userRole={userRole}/>
      }

      <main className="flex-1 w-full overflow-y-auto">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}