import { Button } from "@/components/ui/button"

export function CategoryFiltersSkeleton() {
  const widths = ["w-14", "w-20", "w-16", "w-24", "w-20", "w-28", "w-16"]
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled
        className="vintage-body bg-card text-card-foreground"
      >
        All
      </Button>
      {widths.map((width, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          disabled
          className="vintage-body pointer-events-none bg-card text-card-foreground"
        >
          <span className={`block h-4 ${width} bg-muted rounded animate-pulse`}></span>
        </Button>
      ))}
    </div>
  )
}


