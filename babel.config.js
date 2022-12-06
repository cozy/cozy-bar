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
            'typeof window': 'object'
          }
        ]
      ],
      ignore: ['**/*.spec.jsx', '**/*.spec.js']
    }
  }
}
