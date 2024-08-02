import {
  ArrowDownToLine,
  CheckCircle,
  Leaf,
} from 'lucide-react';
import MaxWidthWrapper from "~/components/MaxWidthWrapper";

const perks = [
  {
    name: 'Best Coaches',
    Icon: ArrowDownToLine,
    description:
      'Trained by the best coaches in the world, with the best training plans.',
  },
  {
    name: 'Guaranteed Quality',
    Icon: CheckCircle,
    description:
      'Powerfull AI trained with the newest and highest quality data',
  },
  {
    name: 'Share your progress',
    Icon: Leaf,
    description:
      "Use the community to share your progress and get feedback from the best coaches.",
  },
]

export default function Home() {
  return (
  <>
    <div>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border-gray-200 bg-white px-7 py-2 shadow-md backdrop:blur transition-all hover:border-gray-50 hover:bg-white/50 ">
        <p className="text-sm font-semibold text-gray-700">Get strong</p>
        </div>
        <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
          Plan, log, coach, improve <span className='text-blue-700'> your training </span>  </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg ">
          Your best in class training tool. With support from real and the best AI coaches. Hybrid, pure strength, always the best you need to improve.
        </p>
      </MaxWidthWrapper>

    </div>
          <section className='border-t border-gray-200 bg-gray-50'>
          <MaxWidthWrapper className='py-20'>
            <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
              {perks.map((perk) => (
                <div
                  key={perk.name}
                  className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'>
                  <div className='md:flex-shrink-0 flex justify-center'>
                    <div className='h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900'>
                      {<perk.Icon className='w-1/3 h-1/3' />}
                    </div>
                  </div>
  
                  <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
                    <h3 className='text-base font-medium text-gray-900'>
                      {perk.name}
                    </h3>
                    <p className='mt-3 text-sm text-muted-foreground'>
                      {perk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MaxWidthWrapper>
        </section>
  </>
  );
}

