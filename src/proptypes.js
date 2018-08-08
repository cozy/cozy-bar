import PropTypes from 'prop-types'

export const appShape = PropTypes.shape({
  icon: PropTypes.shape({
    cached: PropTypes.object,
    src: PropTypes.string
  }),
  slug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  namePrefix: PropTypes.string,
  comingSoon: PropTypes.bool,
  href: PropTypes.string
})
