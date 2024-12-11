import '@/styles/globals.css';  
import { cn } from '@/lib/utils';  
import { fontRoboto, fontSatoshi } from '@/lib/fonts';  
import CustomToaster from '@/components/common/custom-toast';  
import { TailwindIndicator } from '@/components/tailwind-indicator';  
import { ThemeProvider } from '@/components/theme-provider';  
import { MetadataUpdater } from '@/lib/dynamicMetadata';  
import { Metadata, Viewport } from 'next';  
import NextTopLoader from 'nextjs-toploader';

export const viewport: Viewport = {  
  themeColor: [  
    { media: '(prefers-color-scheme: light)', color: 'white' },  
    { media: '(prefers-color-scheme: dark)', color: 'black' },  
  ],  
};  

interface RootLayoutProps {  
  children: React.ReactNode;  
}  

export async function generateMetadata() {  
  const metadata: Metadata = {  
    title: 'Default App Title',  
    description: 'Default App Description',  
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || ''),  
    manifest: '/manifest-dark.webmanifest',  
    icons: {  
      icon: '/favicon-dark.ico',  
    },  
  };  
  return metadata;  
}  

export default function RootLayout({ children }: RootLayoutProps) {  
  return (  
    <html lang="en">  
      <head>  
        <meta  
          name="viewport"  
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"  
        />  
      </head>  
      <body  
        className={cn(  
          'min-h-screen bg-background font-satoshi antialiased',  
          fontSatoshi.variable,  
          fontRoboto.variable  
        )}  
      >  
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
          <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem={true}
        >
          <div>
            {children}  
            <CustomToaster />  
            <MetadataUpdater />  
          </div>
        </ThemeProvider>  
        <TailwindIndicator />  
      </body>  
    </html>  
  );  
}
