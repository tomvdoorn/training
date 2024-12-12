import Link from 'next/link'
import Image from 'next/image'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "~/server/auth";
import MaxWidthWrapper from './MaxWidthWrapper'
import NavItems from './NavItems'
import { buttonVariants } from './ui/button'
import UserAccountNav from './UserAccountNav'
import MobileNav from './MobileNav'

const Navbar = async () => {
  const session = await getServerSession(authOptions)

  return (
    <div className='bg-brand-dark sticky z-50 top-0 inset-x-0 h-16'>
      <header className='relative bg-brand-dark py-6 items-center justify-between'>
        <MaxWidthWrapper>
          <div className=''>
            <div className='flex h-16 items-center'>
              <MobileNav />
              <div className='ml-4 flex lg:ml-0 items-center'>
                <Link href='/'>
                  <div className='flex items-center space-x-2'>
                    <Image
                      src='/logo.png'
                      alt='Logo'
                      className='h-10 w-10 rounded-full'
                      width={40}
                      height={40}
                    />
                    <span className='hidden md:block text-white text-xl font-extrabold ml-2 '>ToTrain</span>
                  </div>
                </Link>
              </div>

              <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
                <NavItems />
              </div>

              <div className='ml-auto flex items-center'>
                <div className='flex flex-1 items-center justify-end space-x-6 '>
                  {!session ? (
                    <>
                      <Link
                        href='/api/auth/signin'
                        className={buttonVariants({
                          variant: 'ghost',
                          className: 'bg-gray-800 text-brand-lime-from hover:text-brand-lime-from hover:bg-gray-700  '
                        })}>
                        Sign in
                      </Link>

                      <Link
                        href='/auth/sign-up'
                        className={buttonVariants({
                          variant: 'ghost',
                          className: 'bg-brand-gradient-r text-gray-900 hover:opacity-90'
                        })}>
                        Create account
                      </Link>
                    </>
                  ) : (
                    <UserAccountNav user={session.user} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  )
}

export default Navbar
