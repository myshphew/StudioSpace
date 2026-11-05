export default function Loading() {
  return (
    <div className="container-page flex min-h-dvh flex-col justify-center py-24">
      <p className="eyebrow">Hold on —</p>
      <p className="mt-4 max-w-md font-display text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950 sm:text-5xl">
        Finding your next space<span className="text-brand-orange">...</span>
      </p>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="skeleton aspect-[4/5] w-full" />
        <div className="skeleton aspect-[4/5] w-full" />
        <div className="skeleton aspect-[4/5] w-full" />
      </div>
    </div>
  );
}
