import { Landing } from "@/app/home-views/bn/Landing";
import { MotionProvider } from "@/common/components/bn";

export default function Home() {
  return (
    <MotionProvider>
      <Landing />
    </MotionProvider>
  );
}
