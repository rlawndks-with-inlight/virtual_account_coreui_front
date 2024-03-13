module.exports = {
  swcMinify: false,
  trailingSlash: true,
  env: {
    // HOST
    HOST_API_KEY: process.env.HOST_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.HOST_API_KEY}/api/:path*`,
      },
    ]
  },
  env: {
    HOST_API_KEY: process.env.HOST_API_KEY,
    API_SERVER: process.env.API_SERVER,
    SOCKET_SERVER: process.env.SOCKET_SERVER,
  }
};
