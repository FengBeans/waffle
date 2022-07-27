import { existsSync } from 'fs';
import path from 'path';
import type { AppData } from './appData';
import { DEFAULT_CONFIG_FILE } from './constants';

export const getUserConfig = ({ appData }: { appData: AppData; }) => {
    return new Promise((resolve, rejects) => {
        let config = {};
        const configFile = path.resolve(appData.paths.absSrcPath, DEFAULT_CONFIG_FILE);

        if (existsSync(configFile)) {
            config = require(configFile).default;
        }
        resolve(config);
    })
}
