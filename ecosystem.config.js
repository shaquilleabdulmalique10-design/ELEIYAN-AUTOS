module.exports = {
  apps: [
    {
      name: 'eleniyan-api',
      cwd: '/Users/macbookpro/Desktop/eleniyan/apps/api',
      script: '/Users/macbookpro/Desktop/eleniyan/node_modules/.bin/ts-node-dev',
      args: '--respawn --transpile-only src/index.ts',
      env: {
        NODE_ENV: 'development',
        PATH: '/Users/macbookpro/.npm-global/bin:/usr/local/bin:/usr/bin:/bin',
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      error_file: '/Users/macbookpro/.pm2/logs/eleniyan-api-error.log',
      out_file: '/Users/macbookpro/.pm2/logs/eleniyan-api-out.log',
    },
    {
      name: 'eleniyan-web',
      cwd: '/Users/macbookpro/Desktop/eleniyan/apps/web',
      script: '/Users/macbookpro/Desktop/eleniyan/node_modules/.bin/next',
      args: 'dev',
      env: {
        NODE_ENV: 'development',
        PATH: '/Users/macbookpro/.npm-global/bin:/usr/local/bin:/usr/bin:/bin',
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      error_file: '/Users/macbookpro/.pm2/logs/eleniyan-web-error.log',
      out_file: '/Users/macbookpro/.pm2/logs/eleniyan-web-out.log',
    },
  ],
}
