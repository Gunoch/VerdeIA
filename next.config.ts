import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['9000-firebase-studio-1748393617928.cluster-m7tpz3bmgjgoqrktlvd4ykrc2m.cloudworkstations.dev'],
  allowedDevOrigins: [
    '6000-firebase-studio-1748393617928.cluster-m7tpz3bmgjgoqrktlvd4ykrc2m.cloudworkstations.dev',
    '9000-firebase-studio-1748393617928.cluster-m7tpz3bmgjgoqrktlvd4ykrc2m.cloudworkstations.dev'],
};

export default nextConfig;
