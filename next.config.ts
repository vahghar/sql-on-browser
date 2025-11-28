import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    
    // 1. The Heavy Hammer: IgnorePlugin
    // We added 'react-native' to this list to stop the "import typeof" crash
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(react-native|react-native-fetch-blob|react-native-fs)$/,
      })
    );

    // 2. The Fallbacks for Browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }

    return config;
  },
};

export default nextConfig;