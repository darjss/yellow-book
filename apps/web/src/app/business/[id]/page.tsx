import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Suspense, } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Globe, Mail, Clock, Facebook, Instagram, Star } from "lucide-react";  
import { BusinessDetailSkeleton } from "@/components/business-detail-skeleton";
import { serverApi } from "@/utils/trpc";
// import type { Business } from "@lib/types";

const BusinessPage = async ({params}: {params: Promise<{id: string}>}) => {
    const {id} =await params;
    const business = await serverApi.getBusinessById.query({id});
    return (
        <div className="min-h-screen w-full bg-[#f4f1e8] relative">

              <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-8 h-8 border-2 border-[#d4af37] rounded-full animate-pulse opacity-30" />
                <div
                  className="absolute top-40 right-20 w-6 h-6 bg-[#d4af37] rounded-full animate-bounce opacity-20"
                  style={{ animationDelay: "1s" }}
                />
                <div
                  className="absolute bottom-40 left-20 w-4 h-4 border border-[#8b4513] rotate-45 animate-spin opacity-25"
                  style={{ animationDuration: "8s" }}
                />
              </div>
        
              <div className="relative z-10">
                <header className="border-b-4 border-[#8b4513] bg-gradient-to-r from-[#faf9f6] to-[#f4f1e8] shadow-lg">
                  <div className="container mx-auto px-4 py-8">
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="vintage-subheading border-2 border-[#d4af37] text-[#8b4513] hover:bg-[#d4af37] hover:text-[#8b4513] bg-[#faf9f6] mb-4"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Directory
                      </Button>
                    </Link>
        
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-8 h-0.5 bg-[#d4af37] animate-pulse"></div>
                        <div
                          className="w-3 h-3 border-2 border-[#d4af37] rounded-full animate-spin"
                          style={{ animationDuration: "4s" }}
                        ></div>
                        <div className="w-16 h-1 bg-[#b8860b]"></div>
                        <div
                          className="w-3 h-3 border-2 border-[#d4af37] rounded-full animate-spin"
                          style={{ animationDuration: "4s", animationDelay: "2s" }}
                        ></div>
                        <div className="w-8 h-0.5 bg-[#d4af37] animate-pulse"></div>
                      </div>
                      <h1 className="vintage-heading text-3xl md:text-5xl text-[#8b4513]">BUSINESS DETAILS</h1>
                    </div>
                  </div>
                </header>
        
                <main className="container mx-auto px-4 py-8">
                  <div className="max-w-5xl mx-auto">
                    <Suspense fallback={<BusinessDetailSkeleton />}>
                      <div className="space-y-8">
                        <Card className="bg-gradient-to-r from-[#faf9f6] to-[#f4f1e8] border-4 border-[#d2b48c] shadow-2xl relative overflow-hidden">
                          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#d4af37] opacity-50"></div>
                          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#d4af37] opacity-50"></div>
                          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#d4af37] opacity-50"></div>
                          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#d4af37] opacity-50"></div>
        
                          <CardContent className="p-8">
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex-1">
                                <h2 className="vintage-heading text-4xl text-[#8b4513] mb-2 relative">
                                  {business.name}
                                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#d4af37] to-transparent"></div>
                                </h2>
                                <div className="flex items-center gap-2 mt-4">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="h-5 w-5 fill-[#d4af37] text-[#d4af37]" />
                                  ))}
                                  <span className="vintage-body text-sm text-[#8b4513] ml-2">(4.8 / 5.0)</span>
                                </div>
                              </div>
                              <Badge className="vintage-body bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#8b4513] border-2 border-[#8b4513] shadow-md text-lg px-4 py-2">
                                {business.category.name}
                              </Badge>
                            </div>
        
                            <p className="vintage-body text-[#654321] text-lg mb-6 leading-relaxed bg-[#f9f6f0] p-4 rounded border-l-4 border-[#d4af37] shadow-inner">
                              {business.description}
                            </p>
        
                            <div className="flex flex-wrap gap-3">
                              <Button className="vintage-subheading bg-gradient-to-r from-[#8b4513] to-[#a0522d] text-[#faf9f6] hover:from-[#a0522d] hover:to-[#8b4513] border-2 border-[#d4af37] shadow-lg transform hover:scale-105 transition-all">
                                <Phone className="mr-2 h-4 w-4" />
                                Call Now
                              </Button>
                              <Button
                                variant="outline"
                                className="vintage-subheading border-2 border-[#d4af37] text-[#8b4513] hover:bg-[#d4af37] hover:text-[#8b4513] bg-[#faf9f6] shadow-lg transform hover:scale-105 transition-all"
                              >
                                <MapPin className="mr-2 h-4 w-4" />
                                Get Directions
                              </Button>
                              <Button
                                variant="outline"
                                className="vintage-subheading border-2 border-[#b8860b] text-[#8b4513] hover:bg-[#b8860b] hover:text-[#faf9f6] bg-[#faf9f6] shadow-lg transform hover:scale-105 transition-all"
                              >
                                <Globe className="mr-2 h-4 w-4" />
                                Visit Website
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
        
                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="bg-gradient-to-br from-[#faf9f6] to-[#f4f1e8] border-4 border-[#d2b48c] shadow-xl">
                            <CardContent className="p-6">
                              <h3 className="vintage-heading text-2xl text-[#8b4513] mb-6 relative">
                                Contact Information
                                <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-[#d4af37]"></div>
                              </h3>
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-[#f9f6f0] rounded border-l-4 border-[#d4af37]">
                                  <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                                  <span className="vintage-body text-[#654321]">{business.address}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#f9f6f0] rounded border-l-4 border-[#d4af37]">
                                  <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                                  <span className="vintage-body text-[#654321] font-semibold">{business.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#f9f6f0] rounded border-l-4 border-[#d4af37]">
                                  <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                                  <span className="vintage-body text-[#654321]">{business.email}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#f9f6f0] rounded border-l-4 border-[#d4af37]">
                                  <Globe className="h-5 w-5 text-accent flex-shrink-0" />
                                  <span className="vintage-body text-primary underline">{business.website}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
        
                          <Card className="bg-gradient-to-br from-[#faf9f6] to-[#f4f1e8] border-4 border-[#d2b48c] shadow-xl">
                            <CardContent className="p-6">
                              <h3 className="vintage-heading text-2xl text-[#8b4513] mb-6 relative">
                                Hours & Social Media
                                <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-[#d4af37]"></div>
                              </h3>
                              <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-[#f9f6f0] rounded border-l-4 border-[#d4af37]">
                                  <Clock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                  <span className="vintage-body text-[#654321]">{business.timetable}</span>
                                </div>
        
                                <div className="p-4 bg-[#f9f6f0] rounded border-l-4 border-[#d4af37]">
                                  <p className="vintage-subheading text-[#8b4513] mb-3">Follow Us</p>
                                  <div className="flex items-center gap-4">
                                    {business.facebookUrl && (
                                      <a
                                        href={business.facebookUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 bg-[#faf9f6] rounded border-2 border-[#d4af37] hover:bg-[#d4af37] transition-all transform hover:scale-110"
                                      >
                                        <Facebook className="h-6 w-6 text-[#8b4513]" />
                                      </a>
                                    )}
                                    {business.instagramUrl && (
                                      <a
                                        href={business.instagramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 bg-[#faf9f6] rounded border-2 border-[#d4af37] hover:bg-[#d4af37] transition-all transform hover:scale-110"
                                      >
                                        <Instagram className="h-6 w-6 text-[#8b4513]" />
                                      </a>
                                    )}
                                    <a
                                      href={business.googleMapUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-2 bg-[#faf9f6] rounded border-2 border-[#d4af37] hover:bg-[#d4af37] transition-all transform hover:scale-110"
                                    >
                                      <MapPin className="h-6 w-6 text-[#8b4513]" />
                                    </a>
                                  </div>
                                </div>
        
                                <div className="p-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded shadow-lg">
                                  <p className="vintage-subheading text-[#8b4513] text-center">
                                    📖 Listed in the Yellow Pages since 1955
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </Suspense>
                  </div>
                </main>
                     
              </div>
            </div>
    );
}
export default BusinessPage;