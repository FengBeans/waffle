const glob = require('glob');
let esbuild = require('esbuild');

const filePath = glob
.sync('src/**/*');

async function start() {
  await esbuild.build({
    entryPoints:filePath,
    bundle: true,
    outdir: 'lib',
    tsconfig: 'tsconfig.json',
    platform:"node",
    external:["esbuild"],
  })
}

start();