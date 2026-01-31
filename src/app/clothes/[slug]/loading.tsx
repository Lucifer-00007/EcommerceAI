import { Container } from "@/components/layout/container";

export default function Loading() {
  return (
    <Container className="max-w-[1280px] px-4 py-6 md:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="aspect-[4/5] w-full rounded-xl bg-muted" />
          <div className="mt-4 grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square w-full rounded-lg bg-muted" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <div className="h-10 w-3/4 rounded bg-muted" />
          <div className="h-6 w-1/3 rounded bg-muted" />
          <div className="h-12 w-full rounded bg-muted" />
          <div className="h-32 w-full rounded bg-muted" />
        </div>
      </div>
    </Container>
  );
}

