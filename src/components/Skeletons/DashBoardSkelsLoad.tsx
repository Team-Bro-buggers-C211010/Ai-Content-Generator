import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const DashBoardSkelsLoad = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2 mt-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-md mr-3" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-32 w-full mt-4" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>

            <div>
              <Skeleton className="h-7 w-1/4 mb-4" />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="border-gray-200">
                    <CardContent className="p-6">
                      <Skeleton className="h-5 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-4/5 mb-2" />
                      <Skeleton className="h-3 w-1/3 mt-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
