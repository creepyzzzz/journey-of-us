/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://eovuittsawkgrsqykolc.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdnVpdHRzYXdrZ3JzcXlrb2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0ODU0NTQsImV4cCI6MjA3NTA2MTQ1NH0.x4izfmjlytB2uO1yjYnAdzDlzhwXq2-OTYV5d50x6h4',
  },
};

module.exports = nextConfig;
