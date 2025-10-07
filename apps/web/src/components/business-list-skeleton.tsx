import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function BusinessListSkeleton() {
  return (
    <div className="grid gap-6">
      {[0,1,2,3].map((i) => (
        <Card key={i} className="bg-card border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-6 bg-muted rounded w-1/2 animate-pulse"></div>
                  <div className="h-6 w-24 rounded-full bg-secondary animate-pulse"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-11/12 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-10/12 animate-pulse"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {[0,1,2,3].map((k) => (
                      <div key={k} className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-accent rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="h-4 w-4 bg-accent rounded animate-pulse mt-0.5"></div>
                      <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      {[0,1,2].map((s) => (
                        <div key={s} className="h-4 w-4 bg-accent rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-48 flex lg:flex-col gap-2">
                <Button disabled className="vintage-subheading bg-primary text-primary-foreground">
                  <span className="block h-5 w-full bg-primary/60 rounded animate-pulse"></span>
                </Button>
                <Button disabled variant="outline" className="vintage-subheading border-accent text-accent bg-transparent">
                  <span className="block h-5 w-full bg-accent/40 rounded animate-pulse"></span>
                </Button>
                <Button disabled variant="outline" className="vintage-subheading border-secondary text-secondary bg-transparent">
                  <span className="block h-5 w-full bg-secondary/40 rounded animate-pulse"></span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


