// @/app/driver/[slug]/page.tsx

import DriverPageClient from "@/components/Driver/DriverClientPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DriverPageClient slug={slug} />;
};
