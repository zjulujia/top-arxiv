import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 3000,
        open: true,
        host: '0.0.0.0', // 绑定到所有网络接口
    },
});
