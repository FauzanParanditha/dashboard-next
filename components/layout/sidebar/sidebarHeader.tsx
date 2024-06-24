export function SidebarHeader() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-center bg-white py-6">
      <img src="/favicon.ico" alt="logo" className="h-10 w-auto" />
      {/* <h1 className="p-1 font-bold text-xl text-rose-600">DASHBOARD</h1> */}
      <span className="text-sm text-slate-500 mt-1 ms-1">Dashboard</span>
    </div>
  );
}
