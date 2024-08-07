import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "~/server/auth";
import MaxWidthWrapper from './MaxWidthWrapper'
import { Icons } from './Icons'
import NavItems from './NavItems'
import { buttonVariants } from './ui/button'
import UserAccountNav from './UserAccountNav'
import MobileNav from './MobileNav'

const Navbar = async () => {
  const session = await getServerSession(authOptions)

  return (
    <div className='bg-white sticky z-50 top-0 inset-x-0 h-16'>
      <header className='relative bg-white'>
        <MaxWidthWrapper>
          <div className='border-b border-gray-200'>
            <div className='flex h-16 items-center'>
              <MobileNav />

              <div className='ml-4 flex lg:ml-0'>
                <Link href='/'>
                  <Icons.logo className='h-10 w-10' />
                </Link>
              </div>

              <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
                <NavItems />
              </div>

              <div className='ml-auto flex items-center'>
                <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                  {!session ? (
                    <>
                      <Link
                        href='/api/auth/signin'
                        className={buttonVariants({
                          variant: 'ghost',
                        })}>
                        Sign in
                      </Link>
                      <span
                        className='h-6 w-px bg-gray-200'
                        aria-hidden='true'
                      />
                      <Link
                        href='/auth/sign-up'
                        className={buttonVariants({
                          variant: 'ghost',
                        })}>
                        Create account
                      </Link>
                    </>
                  ) : (
                    <UserAccountNav user={session.user} />
                  )}
                  <span
                    className='h-6 w-px bg-gray-200'
                    aria-hidden='true'
                  />
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
