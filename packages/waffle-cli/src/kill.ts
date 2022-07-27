import { fork } from 'child_process';

const run = ({scriptPath}:any)=>{
  const child = fork(scriptPath);

  child.on('message', (data: any) => {
    if (data === 'RESTART') {
      child.kill();
      run({ scriptPath });
    }
    process.send?.(data);
  });

  return child;
}