import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function Banner() {
  return (
    <div className="bg-gradient-to-b from-gray-300 to-gray-400 p-6 rounded-lg w-full">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Have 5 mins?</h2>
          <p className="flex text-gray-700 mb-4 flex-col items-start leading[1.5rem]">
            <span className="text-xl font-medium">Here's a quick demo 👉 </span>
            <span className="hidden md:inline">
              The demo includes an end-to-end demonstration of creating and
              collecting testimonials.
            </span>
          </p>
          <div className="hidden md:block space-x-4">
            <Button variant="default" className="bg-gray-800 hover:bg-gray-700">
              <PlayCircle className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
            <Button variant="link" className="text-gray-700">
              Learn more
            </Button>
          </div>
        </div>
        <div className="flex-1 -mt-8 md:mt-0">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
              <PlayCircle className="h-16 w-16 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
