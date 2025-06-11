 
// src/lib/types.ts
// تعريف الأنواع الأساسية لمشروع Board Iraq

export interface User {
  id: string;
  username: string;
  password_hash?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  job_title?: string;
  company?: string;
  bio?: string;
  
  // صور ومعلومات العرض
  profile_image_url?: string;
  logo_url?: string;
  background_color: string;
  text_color: string;
  button_color: string;
  
  // إحصائيات
  total_visits: number;
  total_clicks: number;
  
  // إعدادات الحساب
  is_active: boolean;
  is_premium: boolean;
  is_batch_generated: boolean;
  
  // تواريخ
  created_at: string;
  updated_at: string;
  last_visit_at?: string;
}

export interface UserLink {
  id: string;
  user_id: string;
  
  // نوع الرابط
  type: 'phone' | 'email' | 'website' | 'social' | 'file' | 'custom';
  platform?: 'facebook' | 'instagram' | 'whatsapp' | 'telegram' | 'twitter' | 'linkedin' | 'snapchat' | 'tiktok' | 'youtube' | 'pdf' | 'custom';
  
  // محتوى الرابط
  title: string;
  url: string;
  icon?: string;
  
  // إعدادات العرض
  is_active: boolean;
  sort_order: number;
  click_count: number;
  
  // تواريخ
  created_at: string;
  updated_at: string;
}

export interface PageVisit {
  id: string;
  user_id: string;
  
  // معلومات الزيارة
  visitor_ip?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  
  // تاريخ الزيارة
  visited_at: string;
}

export interface LinkClick {
  id: string;
  user_id: string;
  link_id: string;
  
  // معلومات النقرة
  visitor_ip?: string;
  user_agent?: string;
  referrer?: string;
  
  // تاريخ النقرة
  clicked_at: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string;
  
  // محتوى الطلب
  subject: string;
  message: string;
  email?: string;
  phone?: string;
  
  // حالة الطلب
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // ملاحظات الإدارة
  admin_notes?: string;
  resolved_at?: string;
  
  // تواريخ
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// أنواع لنماذج الإدخال
export interface LoginForm {
  username: string;
  password: string;
}

export interface ProfileUpdateForm {
  full_name?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  company?: string;
  bio?: string;
  background_color?: string;
  text_color?: string;
  button_color?: string;
}

export interface LinkForm {
  type: UserLink['type'];
  platform?: UserLink['platform'];
  title: string;
  url: string;
  icon?: string;
}

// أنواع لإحصائيات لوحة الإدارة
export interface UserStats {
  username: string;
  total_visits: number;
  total_clicks: number;
  last_visit_at?: string;
  created_at: string;
  is_premium: boolean;
}

export interface DashboardStats {
  total_users: number;
  total_visits: number;
  total_clicks: number;
  active_users_today: number;
  top_users: UserStats[];
}

// أنواع للمنصات الاجتماعية
export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  placeholder: string;
  baseUrl?: string;
}

// ثوابت المنصات الاجتماعية
export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  facebook: {
    id: 'facebook',
    name: 'فيسبوك',
    icon: 'FaFacebook',
    color: '#1877F2',
    placeholder: 'https://facebook.com/username'
  },
  instagram: {
    id: 'instagram',
    name: 'إنستجرام',
    icon: 'FaInstagram',
    color: '#E4405F',
    placeholder: 'https://instagram.com/username'
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'واتساب',
    icon: 'FaWhatsapp',
    color: '#25D366',
    placeholder: '+964xxxxxxxxx'
  },
  telegram: {
    id: 'telegram',
    name: 'تيليجرام',
    icon: 'FaTelegram',
    color: '#0088CC',
    placeholder: 'https://t.me/username'
  },
  twitter: {
    id: 'twitter',
    name: 'تويتر/X',
    icon: 'FaTwitter',
    color: '#1DA1F2',
    placeholder: 'https://twitter.com/username'
  },
  linkedin: {
    id: 'linkedin',
    name: 'لينكد إن',
    icon: 'FaLinkedin',
    color: '#0A66C2',
    placeholder: 'https://linkedin.com/in/username'
  },
  snapchat: {
    id: 'snapchat',
    name: 'سناب شات',
    icon: 'FaSnapchat',
    color: '#FFFC00',
    placeholder: 'https://snapchat.com/add/username'
  },
  tiktok: {
    id: 'tiktok',
    name: 'تيك توك',
    icon: 'FaTiktok',
    color: '#000000',
    placeholder: 'https://tiktok.com/@username'
  },
  youtube: {
    id: 'youtube',
    name: 'يوتيوب',
    icon: 'FaYoutube',
    color: '#FF0000',
    placeholder: 'https://youtube.com/@username'
  }
};

// أنواع لأنواع الروابط المختلفة
export const LINK_TYPES = {
  phone: { name: 'رقم الهاتف', icon: 'Phone', color: '#10B981' },
  email: { name: 'البريد الإلكتروني', icon: 'Mail', color: '#6366F1' },
  website: { name: 'الموقع الإلكتروني', icon: 'Globe', color: '#8B5CF6' },
  social: { name: 'وسائل التواصل', icon: 'Share2', color: '#EC4899' },
  file: { name: 'ملف', icon: 'FileText', color: '#F59E0B' },
  custom: { name: 'رابط مخصص', icon: 'Link', color: '#6B7280' }
} as const;