'use client';

import { Loader2, Mail, Building2, CircleUserRound, Globe } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import axios from 'axios';
import Image from 'next/image';

export function SignUpCard() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formSchema = z  
  .object({  
    email: z.string().email('Invalid email address'),  
    name: z.string().min(1, 'Invalid full name'),  
    companyInfo: z.string().min(1, 'Invalid company information'),  
    website: z.string().url('Invalid website url').optional(),
  }); 

  type UserFormValue = z.infer<typeof formSchema>; 

  const defaultValues = {  
    email: '',  
    name: '', 
    companyInfo: '', 
    website: '',
  };  

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {  
    setLoading(true);  

    try {  
      const res = await axios.post(`/api/auth/signup`, data);  
 
      if (res.status === 200) {  
        toast.success('account_created_successfully', {  
          position: 'top-right',  
        });  
        router.push('/auth/signin');  
      } else {  
        toast.error('failed_create_account', {  
          position: 'top-right',  
        });  
      }  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {  
      toast.error('Failed to create account', {  
        position: 'top-right',  
      });  
    } finally {  
      setLoading(false);  
    }  
  };  

  return (
    <div className='flex size-full flex-col items-center justify-center'>
      <div className='mb-8'>
        <Link href='/' className='flex items-center gap-2'>
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
        Welcome to <span className='font-bold text-primary'>MYAGENT</span>  
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
              name='name'  
              render={({ field }) => (  
                <FormItem>  
                  <FormControl>  
                    <div className='relative mx-auto w-full'>  
                      <CircleUserRound className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                      <Input  
                        type='text'  
                        placeholder={'Name'}  
                        className='pl-12 pr-4'  
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
              name='companyInfo'  
              render={({ field }) => (  
                <FormItem>  
                  <FormControl>  
                    <div className='relative mx-auto w-full'>  
                      <Building2 className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
                      <Input  
                        type='text'  
                        placeholder={'Company'}  
                        className='pl-12 pr-4'  
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
              name='website'  
              render={({ field }) => (  
                <FormItem>  
                  <FormControl>  
                    <div className='relative mx-auto w-full'>  
                      <Globe className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' /> 
                      <Input  
                        type='url'  
                        placeholder='Website'  
                        className='pl-12 pr-4'  
                        {...field}  
                      />  
                    </div>  
                  </FormControl>  
                  <FormMessage />  
                </FormItem>  
              )}  
            />  
            <div className='my-4'>
              <div className='flex items-center space-x-2 text-base'>
                <Checkbox id='terms' />
                <Label htmlFor='terms' className='leading-6'>  
                  I have read this and agree to the&nbsp; 
                  <Link href='/rules' className='text-primary underline'>  
                    Platform Rules&nbsp; 
                  </Link>   
                    and&nbsp; 
                  <Link href='/privacy' className='text-primary underline'>  
                    Privacy Rules&nbsp; 
                  </Link>use setting
                </Label>
              </div>
            </div>
            <Button
              type='submit'
              className='btn btn--wide !mt-8 w-full !rounded-md'
              disabled={loading}
            >
              {loading ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : null}
              {'Sign Up'}
            </Button>
          </form>
        </Form>
      </div>
      <div className='mt-8 flex w-full max-w-sm items-center justify-center'>
        <div className='text-center'>{'Already have an account?'}</div>
        <Button variant='ghost'>
          <Link href='/auth/signin'>{'Sign In'}</Link>
        </Button>
      </div>
    </div>
  );
}
