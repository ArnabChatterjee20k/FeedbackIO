import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Branding from "./branding";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FeedbackForm from "./feedback-form";
interface LandingSectionProps {
  name: string;
  tagline: string;
  description: string;
  avatarUrl: string;
  questions: { emoji: string; question: string }[];
}

export default function LandingPage({
  name = "Space Name",
  tagline = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed tempora quia animi magnam earum ipsam voluptatem eveniet quibusdam molestiae ut numquam aliquam, beatae iure quam eum laudantium corrupti, qui minima!",
  description = "Build things in the best way possible",
  avatarUrl = "https://g-0ea4boehcqr.vusercontent.net/placeholder.svg?height=80&width=80",
  questions = [
    { emoji: "💡", question: "What features would you like to see?" },
    { emoji: "🚀", question: "How can we improve our service?" },
    { emoji: "🔧", question: "What tools do you need for your workflow?" },
  ],
}: LandingSectionProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 bg-white">
      <section className="w-full max-w-4xl mx-auto px-4 py-4">
        {/* Header Section */}
        <section className="flex flex-col justify-center items-center mb-8 gap-8">
          <Avatar className="h-24 w-24 rounded-full">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center text-center gap-3">
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-sm text-gray-600 max-w-sm">{tagline}</p>
          </div>
        </section>

        {/* Feedback Questions */}
        <section className="flex max-w-sm mx-auto flex-col items-center mb-8 mt-4 gap-3">
          <h3 className="text-2xl font-medium relative">
            Questions
            <span className="absolute bottom-0 left-0 w-[35%] h-1 bg-red-500"></span>
          </h3>
          <div className="space-y-3">
            {questions.map(({ emoji, question }) => {
              return (
                <p className="flex items-center space-x-3 text-lg">
                  <span>{emoji}</span>
                  <span>{question}</span>
                </p>
              );
            })}
          </div>
        </section>

        {/* Feedback Button */}
        <div className="flex flex-col items-center justify-center mt-8 gap-2">
          <Dialog>
            <DialogTrigger>
              <>
                <Button
                  variant="default"
                  size="lg"
                  className=" w-full max-w-sm"
                >
                  Share your valuable feedback
                </Button>
                <Branding />
              </>
            </DialogTrigger>
            <DialogContent className="bg-transparent border-none">
              <FeedbackForm />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}
