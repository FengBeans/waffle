const glob = require('glob');

const filePath = glob
.sync('src/**/*.@(ts|tsx|js|jsx|css)');

async function start() {
  let esbuild = require('esbuild');
  await esbuild.build({
    entryPoints:filePath,
    bundle:true,
    outdir:'www',
  }).catch((e)=>{
    console.log(e);
  })
}

start();