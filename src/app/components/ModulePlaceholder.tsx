import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

export function ModulePlaceholder({ title, description, icon, features }: ModulePlaceholderProps) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {icon}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-gray-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900">Module Under Development</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 text-lg">
              This module is currently being developed and will include:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-left">
                  <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}