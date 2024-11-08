const { alias } = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias({
    '@components': 'src/components',
    '@pages': 'src/pages',
    '@config': 'src/config',
    '@routes': 'src/routes',
    '@layout': 'src/layout',
    '@redux': 'src/redux'
  })(config)
  return config
}
