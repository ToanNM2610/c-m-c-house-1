import { useState, useEffect } from "react";
import { MenuItem } from "@/data/menu";

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      if (data.menu) {
        setMenu(data.menu);
      }
    } catch (error) {
      console.error("Lỗi tải thực đơn:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStock = async (id: string) => {
    const item = menu.find(i => i.id === id);
    if (!item) return;

    const updatedItem = { ...item, inStock: !item.inStock };
    
    // Cập nhật state trực tiếp để UX mượt
    setMenu(menu.map(i => i.id === id ? updatedItem : i));

    try {
      await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: item.name,
          price: item.price,
          category: item.category,
          inStock: updatedItem.inStock
        })
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      // Revert if error
      await fetchMenu();
    }
  };

  const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return { menu, groupedMenu, toggleStock, isLoading, refreshMenu: fetchMenu };
}
