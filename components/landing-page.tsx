import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Branding from "./branding";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FeedbackForm from "./feedback-form";
import { SpaceFormType } from "@/app/(dashboard)/dashboard/space/schema";

type FeedbackFormProps = SpaceFormType["settingsSchema"];
type LandingSectionProps = SpaceFormType["landingPageSchema"] & {
  feedbackFormProps: FeedbackFormProps;
};

export default function LandingPage({
  name,
  message,
  logo,
  questions,
  questionSection,
  primaryColor,
  buttonText,
  feedbackFormProps,
}: LandingSectionProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 bg-white">
      <section className="w-full max-w-4xl mx-auto px-4 py-4">
        {/* Header Section */}
        <section className="flex flex-col justify-center items-center mb-8 gap-8">
          <Avatar className="h-24 w-24 rounded-full">
            <AvatarImage src={logo as string} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center text-center gap-3">
            <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>
              {name}
            </h1>
            <p className="text-sm text-gray-600 max-w-sm">{message}</p>
          </div>
        </section>

        {/* Feedback Questions */}
        {questionSection ? (
          <section className="flex max-w-sm mx-auto flex-col items-center mb-8 mt-4 gap-3">
            <h3 className="text-2xl font-medium relative">
              Questions
              <span
                className="absolute bottom-0 left-0 w-[35%] h-1"
                style={{ background: primaryColor }}
              ></span>
            </h3>
            <div className="space-y-3">
              {questions.map((question) => {
                return (
                  <p className="flex items-center space-x-3 text-lg">
                    <span>{question}</span>
                  </p>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Feedback Button */}
        <div className="flex flex-col items-center justify-center mt-8 gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="lg" className=" w-full max-w-sm">
                {buttonText}
              </Button>
            </DialogTrigger>
            <Branding />
            <DialogContent className="bg-transparent border-none">
              <FeedbackForm
                {...feedbackFormProps}
                spaceDetails={{ logo, name, message }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}
