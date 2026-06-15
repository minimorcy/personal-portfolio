module.exports = {
  apps: [{
    name: 'portfolio',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: __dirname,
    env: { NODE_ENV: 'production', PORT: 3000 },
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
  }]
};
