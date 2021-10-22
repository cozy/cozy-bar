const pkg = require('./package.json')

module.exports = {
  presets: ['cozy-app'],
  env: {
    transpilation: {
      presets: [
        [
          'cozy-app',
          { presetEnv: { modules: false }, transformRuntime: { helpers: true } }
        ]
      ],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              'cozy-ui/react': 'cozy-ui/transpiled/react'
            }
          }
        ],
        [
          'transform-define',
          {
            __VERSION__: JSON.stringify(pkg.version),
            __PIWIK_SITEID__: 8,
            __PIWIK_SITEID_MOBILE__: 12,
            __PIWIK_DIMENSION_ID_APP__: 1,
            __PIWIK_TRACKER_URL__: JSON.stringify('https://matomo.cozycloud.cc'),
            'typeof window': 'object'
          }
        ]
      ],
      ignore: ['**/*.spec.jsx', '**/*.spec.js']
    }
  }
}
