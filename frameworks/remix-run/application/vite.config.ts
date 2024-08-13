import {vitePlugin as remix} from "@remix-run/dev";
import {defineConfig} from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';


export default defineConfig({
    server: {
        port: process.env.REMIX_APP_PORT || 3000
    },
    plugins: [remix({
        appDirectory: "src",
        serverModuleFormat: "esm"
    }),
        tsconfigPaths()
    ],
});
