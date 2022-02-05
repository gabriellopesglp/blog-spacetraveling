module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/thumbnail.png',
        destination: '/api/thumbnail'
      },
      {
        source: '/api/banner.png',
        destination: '/api/banner'
      }
    ]
  },
}
