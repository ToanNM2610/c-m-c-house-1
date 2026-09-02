export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Cẩm Cù Admin</h1>
          <p className="text-slate-500 mt-2 text-sm">Đăng nhập để quản lý nội dung</p>
        </div>
        
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tài khoản</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="button" 
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 rounded-md transition"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
