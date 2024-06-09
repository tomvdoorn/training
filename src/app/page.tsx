import MaxWidthWrapper from "~/components/MaxWidthWrapper";

export default function Home() {
  return (
    <div>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border-gray-200 bg-white px-7 py-2 shadow-md backdrop:blur transition-all hover:border-gray-50 hover:bg-white/50 ">
        <p className="text-sm font-semibold text-gray-700">Get strong bitch</p>
        </div>
        <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
          Plan, log, coach, improve <span className='text-blue-700'> your training </span>  </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg ">
          Your best in class training tool. With support from real and the best AI coaches. Hybrid, pure strength, always the best you need to improve.
        </p>

      </MaxWidthWrapper>
    </div>
  );
}

