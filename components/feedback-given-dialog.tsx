import { LandingPageDialogForFeedback } from "./landing-page";
export default function FeedbbackGivenDialog({ buttonText }: { buttonText: string }) {
  return (
    <LandingPageDialogForFeedback buttonText={buttonText} nonTransparent={true}>
      <div className="min-h-32 flex justify-center items-center text-red-500">
        <h1>Feedback already given</h1>
      </div>
    </LandingPageDialogForFeedback>
  );
}
