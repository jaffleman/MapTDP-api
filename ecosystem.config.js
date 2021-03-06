module.exports = {
  apps : [{
    script: 'serveur.js',
    watch: '.'
  },],

  deploy : {
    production : {
      user : 'freebox',
      host : '192.168.0.29',
      ref  : 'origin/main',
      repo : 'https://github.com/jaffleman/MapTDP-api.git',
      path : '/home/freebox/MapTDP-api',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
