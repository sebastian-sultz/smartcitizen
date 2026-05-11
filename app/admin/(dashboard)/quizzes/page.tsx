import { QuizFeature } from "@/features/quizzes/QuizFeature";

export const metadata = {
  title: "Quizzes | GSCF Admin",
  description: "Manage educational quizzes and results.",
};

export default function QuizzesPage() {
  return <QuizFeature />;
}
