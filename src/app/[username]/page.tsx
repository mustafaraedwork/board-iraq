// src/app/[username]/page.tsx - محدث مع تتبع Facebook
import { notFound } from 'next/navigation';
import { UserService } from '@/lib/supabase/server';
import PublicProfile from '@/components/profile/PublicProfile';
import type { User, UserLink } from '@/lib/types';

interface UserPageProps {
  params: {
    username: string;
  };
}

// جلب بيانات المستخدم من قاعدة البيانات
async function getUserData(username: string): Promise<{
  user: User | null;
  links: UserLink[];
}> {
  try {
    const user = await UserService.getUserByUsername(username);
    
    if (!user) {
      return { user: null, links: [] };
    }

    const links = await UserService.getUserLinks(user.id);
    
    // تسجيل الزيارة (بدون انتظار)
    UserService.recordVisit(username, {
      userAgent: 'Server-side render',
      referrer: 'Direct'
    });

    return { user, links };
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    return { user: null, links: [] };
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = params;
  const { user, links } = await getUserData(username);

  // إذا لم يوجد المستخدم، اعرض صفحة 404
  if (!user) {
    notFound();
  }

  return (
    <PublicProfile 
      user={user} 
      links={links}
    />
  );
}

// تحسين SEO - عنوان الصفحة وصفتها محدث
export async function generateMetadata({ params }: UserPageProps) {
  const { username } = params;
  const { user } = await getUserData(username);

  if (!user) {
    return {
      title: 'المستخدم غير موجود - Board Iraq',
      description: 'الصفحة المطلوبة غير موجودة'
    };
  }

  // تحسين SEO للبطاقة الذكية
  const title = `${user.full_name || user.username} - بطاقة ذكية | Board Iraq`;
  const description = user.bio || 
    `تواصل مع ${user.full_name || user.username}${user.job_title ? ` - ${user.job_title}` : ''}${user.company ? ` في ${user.company}` : ''} عبر البطاقة الذكية على Board Iraq`;

  return {
    title,
    description,
    keywords: `بطاقة ذكية, ${user.full_name}, ${user.username}, ${user.company || ''}, ${user.job_title || ''}, العراق, NFC`,
    openGraph: {
      title,
      description,
      images: user.profile_image_url ? [user.profile_image_url] : ['/og-image.jpg'],
      url: `https://boardiraq.vercel.app/${username}`,
      type: 'profile',
      locale: 'ar_IQ',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: user.profile_image_url ? [user.profile_image_url] : ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://boardiraq.vercel.app/${username}`,
    },
  };
}