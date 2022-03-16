import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: ".",
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      // fix less import by: @import ~
      // https://github.com/vitejs/vite/issues/2185#issuecomment-784637827
      { find: /^~/, replacement: "" },
    ],
  },
});

// import vitePluginImp from 'vite-plugin-imp';
// import { getThemeVariables } from 'antd/dist/theme';

// export default defineConfig({
//   plugins: [
//     react(),
//     vitePluginImp({
//       libList: [
//         {
//           libName: 'antd',
//           style: (name) => `antd/es/${name}/style`,
//         },
//       ],
//     }),
//   ],
//   resolve: {
//     alias: [
//       // { find: '@', replacement: path.resolve(__dirname, 'src') },
//       // fix less import by: @import ~
//       // https://github.com/vitejs/vite/issues/2185#issuecomment-784637827
//       { find: /^~/, replacement: '' },
//     ],
//   },
//   css: {
//     preprocessorOptions: {
//       less: {
//         modifyVars: { 'primary-color': '#8bbb11' },
//         modifyVars: { ...getThemeVariables({
//           dark: true,
//           compact: true,
//         })},
//         javascriptEnabled: true,
//       },
//     },
//   },
// });
