import {
  ArrowDownToLine,
  CheckCircle,
  Leaf,
} from 'lucide-react';
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
const perks = [
  {
    name: 'Personalized Training',
    Icon: ArrowDownToLine,
    description:
      'Trained by the best coaches in the world, with the best training plans. Coach not online? The best AI coaches are here to help.',
  },
  {
    name: 'All styles of training',
    Icon: CheckCircle,
    description:
      'Log your training, from strength to endurance, from mobility to flexibility.',
  },
  {
    name: 'Share your progress',
    Icon: Leaf,
    description:
      "Use the community to share your progress. Compare your lifts with others to perfect technique.",
  },
]

export default function Home() {
  return (
    <>
      <div>
        <MaxWidthWrapper className="mb-12 mt-20 sm:mt-40 flex flex-col items-center justify-center text-center">
          <Badge variant="secondary" className="mb-8 bg-brand-purple text-brand-light text-md rounded-full">
            Elevate Your Fitness
          </Badge>
          <h1 className='max-w-6xl text-5xl font-bold md:text-6xl lg:text-7xl'>
            Plan, log, coach and improve{" "}
            <span className='bg-brand-gradient-r bg-clip-text text-transparent'>
              your training
            </span>
          </h1>
          <p className="mt-5 max-w-prose text-brand-skyblue sm:text-lg">
            Your best in class training tool. With support from real and the best AI coaches. Hybrid, pure strength, always the best you need to improve.
          </p>
          <Button className="mt-12 bg-gradient-to-r from-[#cbff49] to-[#9be538] text-gray-900 hover:opacity-90 text-lg px-8 py-6">
            Start Your Journey
          </Button>


        </MaxWidthWrapper>
      </div>
      <section className=' bg-brand-dark'>
        <MaxWidthWrapper className='py-20'>
          <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
            {perks.map((perk) => (
              <div
                key={perk.name}
                className='flex flex-col items-center space-y-4 text-center bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700'>
                <div className='rounded-full p-4 bg-brand-gradient-br'>
                  {<perk.Icon className='h-8 w-8 text-gray-900' />}
                </div>
                <h3 className='text-xl font-semibold text-brand-light'>
                  {perk.name}
                </h3>
                <p className='text-brand-skyblue'>
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}

