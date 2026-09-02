"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";

export default function AdminMenuPage() {
  const { menu, toggleStock, isLoading, refreshMenu } = useMenu();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentView, setCurrentView] = useState<"table" | "add">("table");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("CÀ PHÊ");
  const [inStock, setInStock] = useState(true);

  // Quick Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(menu.map(i => i.category)));

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, category, inStock }),
      });
      if (res.ok) {
        await refreshMenu();
        setCurrentView("table");
        setName("");
        setPrice("");
      } else {
        alert("Có lỗi khi thêm món.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const savePrice = async (item: any) => {
    if (editPrice === item.price || !editPrice) {
      setEditingId(null);
      return;
    }

    try {
      const res = await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, price: editPrice }),
      });
      if (res.ok) {
        await refreshMenu();
        setEditingId(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn muốn xóa món này?")) return;
    try {
      const res = await fetch("/api/menu", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await refreshMenu();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (currentView === "add") {
    return (
      <div className="max-w-[800px] animate-in fade-in duration-300">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-[23px] font-normal text-[#1d2327]">Thêm món mới</h1>
          <button 
            onClick={() => setCurrentView("table")}
            className="text-[13px] border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded hover:bg-[#f0f0f1] transition-colors"
          >
            Quay lại
          </button>
        </div>
        
        <form onSubmit={handleAddSubmit} className="bg-white border border-[#c3c4c7] p-4 sm:p-6 rounded-sm">
          <div className="space-y-4 max-w-[400px]">
            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Tên món</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Giá bán (VD: 30.000đ)</label>
              <input type="text" required value={price} onChange={e => setPrice(e.target.value)} className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Danh mục</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none bg-white">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Trạng thái</label>
              <select value={inStock ? "true" : "false"} onChange={e => setInStock(e.target.value === "true")} className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none bg-white">
                <option value="true">Còn hàng</option>
                <option value="false">Hết hàng</option>
              </select>
            </div>
            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="bg-[#2271b1] text-white px-4 py-1.5 text-[13px] rounded-sm hover:bg-[#135e96] disabled:opacity-50">
                {isSubmitting ? "Đang thêm..." : "Thêm món mới"}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-full animate-in fade-in duration-300 -mt-2">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Thực đơn</h1>
        <button 
          onClick={() => setCurrentView("add")}
          className="text-[13px] border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded hover:bg-[#f0f0f1] transition-colors"
        >
          Thêm Món Mới
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2 text-[13px]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#3c434a]">Tất cả ({menu.length})</span>
        </div>
        <div className="flex items-center gap-1 w-full md:w-auto">
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm món..." className="border border-[#8c8f94] rounded-sm px-2 py-1 bg-white focus:border-[#2271b1] outline-none w-full md:w-[180px] h-[30px]" />
          <button className="border border-[#8c8f94] text-[#3c434a] px-3 py-1 rounded-sm bg-[#f6f7f7] hover:bg-[#f0f0f1] h-[30px] whitespace-nowrap">Tìm kiếm</button>
        </div>
      </div>

      <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full text-left text-[13px] border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#c3c4c7] bg-[#fcfcfc] text-[#1d2327]">
              <th className="px-3 py-2 font-semibold">Tên món</th>
              <th className="px-3 py-2 font-semibold">Danh mục</th>
              <th className="px-3 py-2 font-semibold">Giá bán</th>
              <th className="px-3 py-2 font-semibold text-center w-32">Tình trạng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3c4c7]">
            {isLoading ? (
              <tr><td colSpan={4} className="py-10 text-center"><Loader2 className="animate-spin inline text-[#2271b1]" size={24} /></td></tr>
            ) : filteredMenu.length === 0 ? (
              <tr><td colSpan={4} className="py-6 text-center text-[#3c434a]">Không tìm thấy món nào.</td></tr>
            ) : (
              filteredMenu.map((item, index) => (
                <tr key={item.id} className={`group ${index % 2 !== 0 ? 'bg-[#f9f9f9]' : 'bg-white'} hover:bg-[#fcfcfc] transition-colors`}>
                  <td className="px-3 py-3 align-top">
                    <div className="font-semibold text-[#2271b1] text-[14px] hover:text-[#0a4b78] cursor-pointer mb-1">{item.name}</div>
                    <div className="text-[12px] opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-[#a7aaad]">
                      <span className="text-[#2271b1] cursor-pointer hover:underline" onClick={() => { setEditingId(item.id); setEditPrice(item.price); }}>Sửa giá</span>
                      <span>|</span>
                      <span className="text-[#b32d2e] cursor-pointer hover:underline" onClick={() => handleDelete(item.id)}>Xóa</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top text-[#3c434a]">{item.category}</td>
                  <td className="px-3 py-3 align-top text-[#3c434a]">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1">
                        <input type="text" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="border border-[#8c8f94] rounded-sm px-1 py-0.5 text-[12px] w-[80px]" />
                        <button onClick={() => savePrice(item)} className="bg-[#2271b1] text-white px-2 py-0.5 text-[12px] rounded-sm hover:bg-[#135e96]">Lưu</button>
                        <button onClick={() => setEditingId(null)} className="border border-[#8c8f94] text-[#3c434a] px-2 py-0.5 text-[12px] rounded-sm hover:bg-white">Hủy</button>
                      </div>
                    ) : (
                      <span className="font-medium text-[#1d2327]">{item.price}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top text-center">
                    <button 
                      onClick={() => toggleStock(item.id)}
                      className={`relative inline-flex h-[20px] w-[36px] items-center rounded-full transition-colors focus:outline-none ${
                        item.inStock ? "bg-[#46b450]" : "bg-slate-300"
                      }`}
                    >
                      <span className={`inline-block h-[16px] w-[16px] transform rounded-full bg-white transition-transform ${
                        item.inStock ? "translate-x-[18px]" : "translate-x-[2px]"
                      }`} />
                    </button>
                    <div className={`text-[11px] font-bold mt-1 ${item.inStock ? "text-[#46b450]" : "text-[#d63638]"}`}>
                      {item.inStock ? "Còn hàng" : "Hết hàng"}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
