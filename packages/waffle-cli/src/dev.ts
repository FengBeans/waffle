import express from 'express';
import fs from 'fs';
import { build } from 'esbuild';
import path from "path";
import portfinder from 'portfinder';
import { createServer } from 'http';
import { DEFAULT_OUTDIR, DEFAULT_PLATFORM, DEFAULT_PORT, DEFAULT_HOST } from './constants';
import { createWebSocketServer } from './server';
import { style } from './styles';
import { getAppData } from './appData';
import { getRoutes } from './routes';
import { generateHtml } from './html';
import { generateEntry } from './entry';

export const dev = async () => {
    const cwd = process.cwd();
    const app = express();
    const port = await portfinder.getPortPromise({
        port: DEFAULT_PORT,
    });
 
    const output = path.resolve(cwd, DEFAULT_OUTDIR);

    app.get('/', (_req, res, next) => {
        res.set('Content-Type', 'text/html');
        const htmlPath = path.join(output, 'index.html');
        if (fs.existsSync(htmlPath)) {
            fs.createReadStream(htmlPath).on('error', next).pipe(res);
        } else {
            next();
        };
    });

    app.use(`/${DEFAULT_OUTDIR}`, express.static(output));
    app.use(`/waffle`, express.static(path.resolve(__dirname, 'client')));

    const waffleServe = createServer(app);
    const ws = createWebSocketServer(waffleServe);

    function sendMessage(type: string, data?: any) {
        ws.send(JSON.stringify({ type, data }));
    }

    waffleServe.listen(port, async () => {
        console.log(`App listening at http://${DEFAULT_HOST}:${port}`);
        
        try {
            const appData = await getAppData({
              cwd
            });
            const routes = await getRoutes({ appData });
            // 生成项目主入口
            await generateEntry({ appData, routes });
            // 生成 Html
            await generateHtml({ appData });
      
            await build({
                format: 'iife',
                logLevel: 'error',
                entryPoints: [appData.paths.absEntryPath],
                platform: DEFAULT_PLATFORM,
                bundle: true,
                watch: {   
                    onRebuild: (err, res) => {
                    
                        if (err) {
                            console.error(JSON.stringify(err));
                            return;
                        }
                    
                        sendMessage('reload')
                    }
                },
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
                external: ['esbuild'],
                plugins: [style()],

            });
            // [Issues](https://github.com/evanw/esbuild/issues/805)
            // 查了很多资料，esbuild serve 不能响应 onRebuild， esbuild build 和 express 组合不能不写入文件
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    });
}