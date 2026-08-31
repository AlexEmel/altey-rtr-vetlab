import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
        port: 8080,
        strictPort: true,
        host: true,
        proxy: {
            '/api': {
                target: 'http://rigel:81/Chis5/hs/rtr',
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/api/, ''); },
                configure: function (proxy) {
                    proxy.on('error', function (err) {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', function (_proxyReq, req) {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', function (proxyRes, req) {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                },
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
});
