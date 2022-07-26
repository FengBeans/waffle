import { mkdir, writeFileSync } from 'fs';
import { UserConfig } from 'getUserConfig';
import path from 'path';
import type { AppData } from './appData';
import { DEFAULT_FRAMEWORK_NAME, DEFAULT_OUTDIR } from './constants';

export const generateHtml = ({ appData, userConfig }: { appData: AppData; userConfig: UserConfig }) => {
    return new Promise((resolve, rejects) => {

        const title = userConfig?.title ?? appData.pkg.name ?? 'waffle';
        const content = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
        </head>
        
        <body>
            <div id="waffle">
                <span>loading...</span>
            </div>
            <script src="/${DEFAULT_OUTDIR}/${DEFAULT_FRAMEWORK_NAME}.js"></script>
            <script src="/waffle/client.js"></script>
        </body>
        </html>`;
        try {
            const htmlPath = path.resolve(appData.paths.absOutputPath, 'index.html')
            mkdir(path.dirname(htmlPath), { recursive: true }, (err) => {
                if (err) {
                    rejects(err)
                }
                writeFileSync(htmlPath, content, 'utf-8');
                resolve({})
            });
        } catch (error) {
            rejects({})
        }
    })
}