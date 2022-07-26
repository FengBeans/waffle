import express from 'express';
import fs from 'fs';
import { build } from 'esbuild';
import path from "path";
import portfinder from 'portfinder';
import { createServer } from 'http';
import { DEFAULT_OUTDIR, DEFAULT_PLATFORM, DEFAULT_PORT, DEFAULT_HOST, DEFAULT_FRAMEWORK_NAME } from './constants';
import { createWebSocketServer } from './server';
import { style } from './styles';
import { AppData, getAppData } from './appData';
import { getRoutes } from './routes';
import { generateHtml } from './html';
import { generateEntry } from './entry';
import { getUserConfig } from './getUserConfig';

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
    app.use(`/waffle`, express.static(path.resolve(__dirname, 'client')))
    const waffleServe = createServer(app);
    const ws = createWebSocketServer(waffleServe);

    function sendMessage(type: string, data?: any) {
        ws.send(JSON.stringify({ type, data }));
    }

    const buildMain = async ({ appData }: { appData: AppData }) => {
        // 获取用户数据
        const userConfig = await getUserConfig({
            appData, waffleServe
        });
        // 获取 routes 配置
        const routes = await getRoutes({ appData });
        // 生成项目主入口
        await generateEntry({ appData, routes, userConfig });
        // 生成 Html
        await generateHtml({ appData, userConfig });
    }

    waffleServe.on('REBUILD', async ({ appData }) => {
        await buildMain({ appData });
        sendMessage('reload');
    })

    waffleServe.listen(port, async () => {
        console.log(`App listening at http://${DEFAULT_HOST}:${port}`);
        
        try {    
            const appData = await getAppData({
              cwd
            });
            await buildMain({appData});
            await build({
                format: 'iife',
                logLevel: 'error',
                // outdir: appData.paths.absOutputPath,
                outfile:`${appData.paths.absOutputPath}/${DEFAULT_FRAMEWORK_NAME}.js`,
                entryPoints: [appData.paths.absEntryPath],
                platform: DEFAULT_PLATFORM,
                bundle: true,
                watch: {   
                    onRebuild: (err, res) => {
                        if (err) {
                            console.error(JSON.stringify(err));
                            return;
                        }
                        console.log('reload')
                        sendMessage('reload');
                    }
                },
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
                external: ['esbuild'],
                plugins: [style()],

            });

        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    });
}