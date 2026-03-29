import React from "react";

interface HomeSkeletonShellProps {
  compact?: boolean;
}

const SectionTitle = ({ wide = false }: { wide?: boolean }) => (
  <div className={`h-8 rounded-xl shimmer-surface ${wide ? "w-64" : "w-52"} mx-auto mb-8`} />
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: 5 }).map((_, idx) => (
      <div
        key={`product-shell-${idx}`}
        className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
      >
        <div className="aspect-square rounded-2xl shimmer-surface mb-4" />
        <div className="h-4 w-4/5 shimmer-surface rounded mb-2" />
        <div className="h-4 w-2/3 shimmer-surface rounded mb-4" />
        <div className="h-10 w-full shimmer-surface rounded-xl" />
      </div>
    ))}
  </div>
);

const HomeSkeletonShell: React.FC<HomeSkeletonShellProps> = ({ compact = false }) => {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[340px] md:h-[440px] overflow-hidden bg-gray-100">
        <div className="absolute inset-0 shimmer-surface" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-[#009FE3]/10" />
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 max-w-4xl mx-auto">
          <div className="h-10 md:h-14 w-2/3 max-w-xl rounded-2xl shimmer-surface mb-4 mx-auto" />
          <div className="h-5 md:h-6 w-1/2 max-w-sm rounded-xl shimmer-surface mb-6 mx-auto" />
          <div className="h-12 w-56 rounded-full shimmer-surface mx-auto" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex gap-3">
            <div className="flex-1 h-14 rounded-full shimmer-surface" />
            <div className="w-20 h-14 rounded-full shimmer-surface" />
          </div>
        </div>

        <section className="mb-14">
          <SectionTitle />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`category-shell-${idx}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl shimmer-surface mb-4" />
                <div className="h-4 w-3/4 shimmer-surface rounded mb-2" />
                <div className="h-4 w-1/2 shimmer-surface rounded" />
              </div>
            ))}
          </div>
        </section>

        {!compact && (
          <section className="mb-14">
            <SectionTitle wide />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`offer-shell-${idx}`}
                  className="h-[320px] rounded-3xl shimmer-surface"
                />
              ))}
            </div>
          </section>
        )}

        <section className="mb-14">
          <SectionTitle />
          <ProductGridSkeleton />
        </section>

        {!compact && (
          <section>
            <SectionTitle />
            <ProductGridSkeleton />
          </section>
        )}
      </div>
    </div>
  );
};

export default HomeSkeletonShell;
