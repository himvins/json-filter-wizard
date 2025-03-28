
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

// Import markdown content
import docContent from '@/components/JsonFilterWizard/documentation.md?raw';
import readmeContent from '@/components/JsonFilterWizard/README.md?raw';

const Documentation = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">JSON Filter Wizard Documentation</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive documentation for the JSON Filter Wizard component
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">Back to Demo</Link>
          </Button>
        </div>
        
        <Card className="w-full shadow-md border-gray-200">
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Explore the detailed documentation for the JSON Filter Wizard component
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Documentation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <ScrollArea className="h-[500px] w-full pr-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <ReactMarkdown>{readmeContent}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="detailed">
                <ScrollArea className="h-[500px] w-full pr-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <ReactMarkdown>{docContent}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" asChild>
              <Link to="/">Back to Demo</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
