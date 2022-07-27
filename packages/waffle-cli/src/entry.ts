import { mkdir, writeFileSync } from 'fs';
import path from 'path';
import { winPath } from './utils/winPath';
import type { AppData } from './appData';
import type { IRoute } from './routes';

let count = 1;
const getRouteStr = (routes: IRoute[]) => {
    let routesStr = '';
    let importStr = '';
    routes.forEach(route => {
        count += 1;
        importStr += `import A${count} from '${winPath(route.element)}';\n`;
        routesStr += `\n<Route path='${route.path}' element={<A${count} />}>`;
        if (route.routes) {
            const { routesStr: rs, importStr: is } = getRouteStr(route.routes);
            routesStr += rs;
            importStr += is;
        }
        routesStr += '</Route>\n';
    })
    return { routesStr, importStr };
}

export const generateEntry = ({ appData, routes }: { appData: AppData; routes: IRoute[] }) => {
    return new Promise((resolve, rejects) => {
        count = 0;
        const { routesStr, importStr } = getRouteStr(routes);
        const content = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, } from 'react-router-dom';
import KeepAliveLayout from '@fengbeans/keepalive';
${importStr}
const App = () => {
    return (
        <KeepAliveLayout keepalive={[/./]}>
            <HashRouter>
                <Routes>
                    ${routesStr}
                </Routes>
            </HashRouter>
        </KeepAliveLayout>
    );
}
const root = createRoot(document.getElementById("waffle") as Element);
root.render(React.createElement(App));
    `;
        try {
            mkdir(path.dirname(appData.paths.absEntryPath), { recursive: true }, (err) => {
                if (err) {
                    rejects(err)
                }
                writeFileSync(appData.paths.absEntryPath, content, 'utf-8');
                resolve({})
            });
        } catch (error) {
            rejects({})
        }
    })
}