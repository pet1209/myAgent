'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export function SignInCard() {
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({  
    email: z.string().email('Invalid email address'),  
    company: z.string().min(1, 'Invalid company information'),
  });  

  type UserFormValue = z.infer<typeof formSchema>;

  const defaultValues = {  
    email: '',  
    company: '', 
  };  
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {  
    setLoading(true);  

    console.log('Form data:', data); 

    setLoading(false);  
    toast.success('Form submitted with company information', { position: 'top-right' });
  };  

  return (
    <div className='flex size-full flex-col items-center justify-center'>
      <div className='mb-8'>
        <Link href='/public/home' className='flex items-center gap-2'>
          <Image
            src='/logo-black.svg'
            alt='logo'
            width={60}
            height={60}
            className='size-[60px] dark:hidden'
          />
          <Image
            src='/logo-white.svg'
            alt='logo'
            width={60}
            height={60}
            className='hidden size-[60px] dark:block'
          />
        </Link>
      </div>
      <div className='text-center text-2xl sm:text-3xl'>  
        Welcome to <span className='text-primary font-bold'>MYAGENT</span>  
      </div>
      <div className='mt-8 flex w-full max-w-sm flex-col gap-3'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-2'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative mx-auto w-full'>
                      <Mail className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                      <Input
                        type='email'
                        placeholder={'Email'}
                        className='pl-12 pr-4'
                        disabled={loading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='company'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative mx-auto w-full'>
                      <Building2 className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                      <Input type='text' placeholder='Company' className='pl-12 pr-4' disabled={loading} {...field} />  
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex w-full justify-end'>
              <Button variant='ghost' asChild>
                <Link href='/auth/forgot-password'>
                  {'Forgot Password?'}
                </Link>
              </Button>
            </div>
            <Button
              type='submit'
              variant='default'
              className='btn btn--wide w-full !rounded-md'
              disabled={loading}
            >
              {loading && <Loader2 className='mr-2 size-4 animate-spin' />}
              {'Sign In'}
            </Button>
          </form>
        </Form>
      </div>
      <div className='mt-8 w-full max-w-sm space-y-4'>
        <div className='text-center'>  
            Don&apos;t have an account? Setup Now  
        </div> 
        <Button
          variant='outline'
          className='w-full'
          asChild
        >
          <Link href='/auth/signup'>{'Sign Up'}</Link>
        </Button>
      </div>
    </div>
  );
}
