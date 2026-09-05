# WebAssembly (Wasm) Security Layer

Thư mục này được thiết kế để chứa các module nhị phân WebAssembly (`.wasm`).

## Mục đích
Đây là lớp bảo vệ mã nguồn cấp độ cao nhất (Lớp 4 & 5). Bằng cách biên dịch các logic 3D quan trọng, thuật toán cốt lõi, hoặc dữ liệu nhạy cảm từ mã C/C++/Rust sang định dạng nhị phân `.wasm`, chúng ta có thể:
1. **Chống dịch ngược (Anti-Reverse Engineering):** Trình duyệt chỉ nhận được mã máy (binary), khiến việc đọc hiểu và sao chép mã nguồn 3D trở nên gần như không thể nếu không có source map gốc.
2. **Tối ưu hiệu năng:** Wasm chạy với tốc độ gần bằng mã máy tự nhiên (native speed), giúp các vòng lặp tính toán ma trận, hạt 3D (InstancedMesh) phức tạp hoạt động mượt mà hơn.

## Tích hợp với Next.js
Dự án đã được cấu hình trong `next.config.ts` để hỗ trợ nạp trực tiếp Wasm:
```typescript
webpack: (config, { isServer }) => {
  config.experiments = {
    ...config.experiments,
    asyncWebAssembly: true,
    layers: true,
  };
  return config;
}
```

Bạn có thể thả các file `.wasm` vào thư mục này và import chúng trực tiếp vào các component 3D React thông qua Webpack.
