module.exports = {
  swcMinify: false,
  trailingSlash: true,
  env: {
    // HOST
    BACK_URL: process.env.BACK_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACK_URL}/api/:path*`,
      },
    ]
  },
  env: {
    BACK_URL: process.env.BACK_URL,
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL,
  }
};
