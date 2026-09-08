"use client";

import { useState } from "react";
import { Loader2, Plus, X, Search, Edit2, Trash2, DollarSign } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";

export default function AdminMenuPage() {
  const { menu, toggleStock, isLoading, refreshMenu } = useMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  
  const [currentView, setCurrentView] = useState<"table" | "add">("table");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form thêm món mới
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("CÀ PHÊ");
  const [inStock, setInStock] = useState(true);

  // Chỉnh sửa nhanh (Tên và Giá)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredMenu = menu.filter((item) => {
    const matchName = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
    return matchName && matchCat;
  });

  const categories = ["ALL", ...Array.from(new Set(menu.map(i => i.category)))];

  const getUsdEstimate = (priceInput: string | number) => {
    const cleanNum =
      typeof priceInput === "number"
        ? priceInput
        : parseInt(priceInput.replace(/[^0-9]/g, ""), 10);
    if (isNaN(cleanNum)) return "";
    const usd = Math.round((cleanNum / 25000) * 20) / 20;
    return `$${usd.toFixed(2)}`;
  };

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

  const saveItem = async (item: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          name: editName || item.name,
          price: editPrice || item.price,
        }),
      });
      if (res.ok) {
        await refreshMenu();
        setEditingId(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món này khỏi thực đơn?")) return;
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
          <h1 className="text-[23px] font-semibold text-[#1d2327]">Thêm món mới vào Thực đơn</h1>
          <button 
            onClick={() => setCurrentView("table")}
            className="text-[13px] border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded hover:bg-[#f0f0f1] transition-colors cursor-pointer"
          >
            ← Quay lại danh sách
          </button>
        </div>
        
        <form onSubmit={handleAddSubmit} className="bg-white border border-[#c3c4c7] p-4 sm:p-6 rounded-sm shadow-sm">
          <div className="space-y-4 max-w-[500px]">
            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Tên món</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="VD: Cà phê muối..."
                className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none" 
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Giá bán (VNĐ)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  required 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  placeholder="VD: 28.000đ"
                  className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none" 
                />
                {price && (
                  <span className="text-xs text-[#2271b1] font-mono whitespace-nowrap bg-[#f0f0f1] px-2.5 py-1.5 rounded">
                    Quy đổi: {getUsdEstimate(price)}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Danh mục</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none bg-white cursor-pointer"
              >
                <option value="CÀ PHÊ">CÀ PHÊ</option>
                <option value="TRÀ & THẢO MỘC">TRÀ & THẢO MỘC</option>
                <option value="ĐÁ XAY & SINH TỐ">ĐÁ XAY & SINH TỐ</option>
                <option value="NƯỚC ÉP NGUYÊN CHẤT">NƯỚC ÉP NGUYÊN CHẤT</option>
                <option value="ĐỒ UỐNG ĐẶC BIỆT">ĐỒ UỐNG ĐẶC BIỆT</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Tình trạng phục vụ</label>
              <select 
                value={inStock ? "true" : "false"} 
                onChange={e => setInStock(e.target.value === "true")} 
                className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none bg-white cursor-pointer"
              >
                <option value="true">Còn hàng (Đang phục vụ)</option>
                <option value="false">Hết hàng (Tạm ngưng)</option>
              </select>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-[#2271b1] text-white px-5 py-2 text-[13px] rounded-sm hover:bg-[#135e96] disabled:opacity-50 font-medium cursor-pointer"
              >
                {isSubmitting ? "Đang thêm món..." : "Thêm vào thực đơn"}
              </button>
              <button 
                type="button" 
                onClick={() => setCurrentView("table")}
                className="border border-[#8c8f94] text-[#50575e] px-4 py-2 text-[13px] rounded-sm hover:bg-white cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-full animate-in fade-in duration-300 -mt-2 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-[23px] font-semibold text-[#1d2327]">Quản lý Thực đơn (Menu Manager)</h1>
          <button 
            onClick={() => setCurrentView("add")}
            className="text-[13px] border border-[#2271b1] text-[#2271b1] hover:bg-[#2271b1] hover:text-white px-3 py-1 rounded transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <Plus size={13} />
            <span>Thêm Món Mới</span>
          </button>
        </div>

        <span className="text-xs text-[#50575e]">
          Tổng số: <strong>{menu.length}</strong> món ({menu.filter(i => i.inStock).length} đang bán)
        </span>
      </div>

      {/* Bộ lọc Danh mục & Tìm kiếm */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-[13px]">
        <div className="flex flex-wrap items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-sm cursor-pointer transition-colors text-xs ${
                selectedCategory === cat
                  ? "bg-[#2271b1] text-white font-medium"
                  : "bg-white text-[#50575e] hover:bg-[#f0f0f1] border border-[#dcdcde]"
              }`}
            >
              {cat === "ALL" ? `Tất cả (${menu.length})` : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 w-full md:w-auto">
          <div className="relative w-full md:w-[220px]">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="Tìm theo tên món..." 
              className="border border-[#8c8f94] rounded-sm pl-7 pr-2 py-1 bg-white focus:border-[#2271b1] outline-none w-full h-[30px] text-xs" 
            />
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#8c8f94]" />
          </div>
        </div>
      </div>

      {/* Bảng danh sách món */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full text-left text-[13px] border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#c3c4c7] bg-[#fcfcfc] text-[#1d2327]">
              <th className="px-3 py-2.5 font-semibold">Tên món</th>
              <th className="px-3 py-2.5 font-semibold">Danh mục</th>
              <th className="px-3 py-2.5 font-semibold">Giá bán (VNĐ)</th>
              <th className="px-3 py-2.5 font-semibold">Quy đổi USD</th>
              <th className="px-3 py-2.5 font-semibold text-center w-36">Tình trạng phục vụ</th>
              <th className="px-3 py-2.5 font-semibold text-right w-28">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3c4c7]">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center">
                  <Loader2 className="animate-spin inline text-[#2271b1] mr-2" size={24} />
                  Đang tải thực đơn...
                </td>
              </tr>
            ) : filteredMenu.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#50575e]">
                  Không tìm thấy món nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredMenu.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={`group ${index % 2 !== 0 ? 'bg-[#f9f9f9]' : 'bg-white'} hover:bg-[#fcfcfc] transition-colors`}
                >
                  {/* Tên món */}
                  <td className="px-3 py-3 align-middle">
                    {editingId === item.id ? (
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={e => setEditName(e.target.value)} 
                        className="border border-[#2271b1] rounded-sm px-2 py-1 text-xs w-full max-w-[200px]" 
                      />
                    ) : (
                      <div className="font-semibold text-[#1d2327] text-[14px]">{item.name}</div>
                    )}
                  </td>

                  {/* Danh mục */}
                  <td className="px-3 py-3 align-middle text-[#50575e]">
                    <span className="px-2 py-0.5 rounded bg-[#f0f0f1] text-xs">
                      {item.category}
                    </span>
                  </td>

                  {/* Giá bán VNĐ */}
                  <td className="px-3 py-3 align-middle text-[#1d2327]">
                    {editingId === item.id ? (
                      <input 
                        type="text" 
                        value={editPrice} 
                        onChange={e => setEditPrice(e.target.value)} 
                        className="border border-[#2271b1] rounded-sm px-2 py-1 text-xs w-[90px]" 
                      />
                    ) : (
                      <span className="font-mono font-semibold">{item.price}</span>
                    )}
                  </td>

                  {/* Quy đổi USD */}
                  <td className="px-3 py-3 align-middle text-[#2271b1] font-mono text-xs">
                    {getUsdEstimate(editingId === item.id ? editPrice : item.price)}
                  </td>

                  {/* Tình trạng Bật/Tắt hết hàng */}
                  <td className="px-3 py-3 align-middle text-center">
                    <button 
                      onClick={() => toggleStock(item.id)}
                      className={`relative inline-flex h-[22px] w-[40px] items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                        item.inStock ? "bg-[#46b450]" : "bg-slate-300"
                      }`}
                      title="Bấm để chuyển đổi trạng thái"
                    >
                      <span className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform ${
                        item.inStock ? "translate-x-[20px]" : "translate-x-[2px]"
                      }`} />
                    </button>
                    <div className={`text-[11px] font-bold mt-0.5 ${item.inStock ? "text-[#46b450]" : "text-[#d63638]"}`}>
                      {item.inStock ? "Còn hàng" : "Hết hàng"}
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className="px-3 py-3 align-middle text-right">
                    {editingId === item.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => saveItem(item)} 
                          disabled={isSaving}
                          className="bg-[#2271b1] text-white px-2 py-1 text-xs rounded-sm hover:bg-[#135e96] cursor-pointer"
                        >
                          Lưu
                        </button>
                        <button 
                          onClick={() => setEditingId(null)} 
                          className="border border-[#8c8f94] text-[#50575e] px-2 py-1 text-xs rounded-sm hover:bg-white cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <button 
                          onClick={() => { 
                            setEditingId(item.id); 
                            setEditName(item.name); 
                            setEditPrice(item.priceFormatted || String(item.price)); 
                          }}
                          className="text-[#2271b1] hover:underline cursor-pointer inline-flex items-center gap-0.5"
                        >
                          <Edit2 size={12} />
                          <span>Sửa</span>
                        </button>
                        <span className="text-[#a7aaad]">|</span>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-[#b32d2e] hover:underline cursor-pointer inline-flex items-center gap-0.5"
                        >
                          <Trash2 size={12} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    )}
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
