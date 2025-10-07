import { Card, CardContent } from "@/components/ui/card"

export function BusinessDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Section Skeleton */}
      <Card className="bg-gradient-to-r from-[#faf9f6] to-[#f4f1e8] border-4 border-[#d2b48c] shadow-2xl relative overflow-hidden">
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#d4af37] opacity-50"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#d4af37] opacity-50"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#d4af37] opacity-50"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#d4af37] opacity-50"></div>

        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="h-12 bg-[#e6ddd4] rounded-md w-2/3 animate-pulse mb-2"></div>
              <div className="h-0.5 bg-[#d4af37] w-2/3 animate-pulse"></div>
            </div>
            <div className="h-8 w-32 bg-[#d4af37] rounded-full animate-pulse"></div>
          </div>

          <div className="bg-[#f9f6f0] p-4 rounded border-l-4 border-[#d4af37] space-y-2 mb-6">
            <div className="h-5 bg-[#e6ddd4] rounded w-full animate-pulse"></div>
            <div className="h-5 bg-[#e6ddd4] rounded w-11/12 animate-pulse"></div>
            <div className="h-5 bg-[#e6ddd4] rounded w-5/6 animate-pulse"></div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-40 bg-[#8b4513] rounded-md animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-[#faf9f6] to-[#f4f1e8] border-4 border-[#d2b48c] shadow-xl">
          <CardContent className="p-6">
            <div className="h-8 bg-[#e6ddd4] rounded-md w-1/2 animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-[#d4af37] rounded animate-pulse"></div>
                  <div className="h-5 bg-[#e6ddd4] rounded flex-1 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#faf9f6] to-[#f4f1e8] border-4 border-[#d2b48c] shadow-xl">
          <CardContent className="p-6">
            <div className="h-8 bg-[#e6ddd4] rounded-md w-1/2 animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-[#d4af37] rounded animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-[#e6ddd4] rounded w-full animate-pulse"></div>
                    <div className="h-5 bg-[#e6ddd4] rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
