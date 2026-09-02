export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Tổng quan</h2>
        <p className="text-slate-500">Quản lý nội dung Cẩm Cù House</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Thực đơn</h3>
          <p className="text-3xl font-bold text-indigo-600">24 <span className="text-sm font-normal text-slate-500">món</span></p>
          <div className="mt-4">
            <button className="text-sm text-indigo-600 font-medium hover:underline">Quản lý món (Bật/Tắt) →</button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Nhật ký</h3>
          <p className="text-3xl font-bold text-emerald-600">12 <span className="text-sm font-normal text-slate-500">bài viết</span></p>
          <div className="mt-4">
            <button className="text-sm text-emerald-600 font-medium hover:underline">Đăng bài mới →</button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Thư viện ảnh</h3>
          <p className="text-3xl font-bold text-amber-600">156 <span className="text-sm font-normal text-slate-500">ảnh</span></p>
          <div className="mt-4">
            <button className="text-sm text-amber-600 font-medium hover:underline">Tải ảnh lên →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
