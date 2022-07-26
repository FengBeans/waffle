const glob = require('glob');

const filePath = glob
.sync('src/**/*');


async function start() {
  let esbuild = require('esbuild')
  await esbuild.build({
    entryPoints:filePath,
    bundle: true,
    outdir: 'lib',
    tsconfig: 'tsconfig.json',
    platform:"node",
    external:'esbuild',
  })
}

start();