// src/app/[username]/page.tsx
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

  return <PublicProfile user={user} links={links} />;
}

// تحسين SEO - عنوان الصفحة وصفتها
export async function generateMetadata({ params }: UserPageProps) {
  const { username } = params;
  const { user } = await getUserData(username);

  if (!user) {
    return {
      title: 'المستخدم غير موجود - Board Iraq',
      description: 'الصفحة المطلوبة غير موجودة'
    };
  }

  return {
    title: `${user.full_name || user.username} - Board Iraq`,
    description: user.bio || `صفحة ${user.full_name || user.username} الشخصية على Board Iraq`,
    openGraph: {
      title: user.full_name || user.username,
      description: user.bio || `تواصل مع ${user.full_name || user.username}`,
      images: user.profile_image_url ? [user.profile_image_url] : [],
    },
  };
}