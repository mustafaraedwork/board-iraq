// src/lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';
import type { User, UserLink } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// دوال للمستخدمين
export class UserService {
  // الحصول على مستخدم بالـ username
  static async getUserByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('خطأ في جلب المستخدم:', error);
      return null;
    }

    return data;
  }

  // الحصول على روابط المستخدم
  static async getUserLinks(userId: string): Promise<UserLink[]> {
    const { data, error } = await supabase
      .from('user_links')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('خطأ في جلب الروابط:', error);
      return [];
    }

    return data || [];
  }

  // تسجيل زيارة جديدة
  static async recordVisit(username: string, visitorInfo: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  }) {
    try {
      // تحديث عداد الزيارات
      await supabase.rpc('increment_user_visits', {
        user_username: username
      });

      // إضافة سجل الزيارة
      const user = await this.getUserByUsername(username);
      if (user) {
        await supabase.from('page_visits').insert({
          user_id: user.id,
          visitor_ip: visitorInfo.ip,
          user_agent: visitorInfo.userAgent,
          referrer: visitorInfo.referrer
        });
      }
    } catch (error) {
      console.error('خطأ في تسجيل الزيارة:', error);
    }
  }

  // تسجيل نقرة على رابط
  static async recordLinkClick(linkId: string, visitorInfo: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  }) {
    try {
      // تحديث عداد النقرات
      await supabase.rpc('increment_link_clicks', {
        link_uuid: linkId
      });

      // إضافة سجل النقرة
      await supabase.from('link_clicks').insert({
        link_id: linkId,
        visitor_ip: visitorInfo.ip,
        user_agent: visitorInfo.userAgent,
        referrer: visitorInfo.referrer
      });
    } catch (error) {
      console.error('خطأ في تسجيل النقرة:', error);
    }
  }

  // التحقق من صحة بيانات الدخول
  static async validateLogin(username: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password) // هذا مؤقت، سنحسنه لاحقاً
      .single();

    if (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      return null;
    }

    return data;
  }

  // إنشاء حسابات بالجملة
  static async createBatchUsers(count: number, prefix: string = 'card'): Promise<{
    users: any[];
    success: boolean;
    error?: string;
  }> {
    try {
      const users = [];
      
      for (let i = 1; i <= count; i++) {
        const username = `${prefix}${i.toString().padStart(4, '0')}`;
        const password = this.generateRandomPassword();
        
        users.push({
          username,
          password_hash: password, // سنحسن التشفير لاحقاً
          is_batch_generated: true,
          created_at: new Date().toISOString()
        });
      }

      const { data, error } = await supabase
        .from('users')
        .insert(users)
        .select();

      if (error) {
        return { users: [], success: false, error: error.message };
      }

      return { users: data || [], success: true };
    } catch (error) {
      return { 
        users: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }

  // توليد كلمة مرور عشوائية
  private static generateRandomPassword(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // إضافة رابط جديد للمستخدم
  static async addUserLink(userId: string, linkData: {
    type: string;
    platform?: string;
    title: string;
    url: string;
  }): Promise<{success: boolean; error?: string; link?: any}> {
    try {
      // الحصول على أعلى ترتيب حالي
      const { data: existingLinks } = await supabase
        .from('user_links')
        .select('sort_order')
        .eq('user_id', userId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextSortOrder = existingLinks && existingLinks.length > 0 
        ? existingLinks[0].sort_order + 1 
        : 1;

      const { data, error } = await supabase
        .from('user_links')
        .insert({
          user_id: userId,
          type: linkData.type,
          platform: linkData.platform || null,
          title: linkData.title,
          url: linkData.url,
          sort_order: nextSortOrder
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, link: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ في إضافة الرابط'
      };
    }
  }

  // حذف رابط
  static async deleteUserLink(linkId: string): Promise<{success: boolean; error?: string}> {
    try {
      const { error } = await supabase
        .from('user_links')
        .delete()
        .eq('id', linkId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ في حذف الرابط'
      };
    }
  }

  // تحديث رابط
  static async updateUserLink(linkId: string, linkData: {
    title?: string;
    url?: string;
    is_active?: boolean;
    sort_order?: number;
  }): Promise<{success: boolean; error?: string; link?: any}> {
    try {
      const { data, error } = await supabase
        .from('user_links')
        .update(linkData)
        .eq('id', linkId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, link: data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ في تحديث الرابط'
      };
    }
  }

  // تحديث ترتيب الروابط
  static async updateLinksOrder(linkUpdates: {id: string; sort_order: number}[]): Promise<{success: boolean; error?: string}> {
    try {
      for (const update of linkUpdates) {
        const { error } = await supabase
          .from('user_links')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);

        if (error) {
          return { success: false, error: error.message };
        }
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ في تحديث الترتيب'
      };
    }
  }
  static async getAdminStats() {
    try {
      // إجمالي المستخدمين
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // إجمالي الزيارات
      const { data: visitStats } = await supabase
        .from('users')
        .select('total_visits')
        .not('total_visits', 'is', null);

      const totalVisits = visitStats?.reduce((sum, user) => sum + (user.total_visits || 0), 0) || 0;

      // إجمالي النقرات
      const { data: clickStats } = await supabase
        .from('users')
        .select('total_clicks')
        .not('total_clicks', 'is', null);

      const totalClicks = clickStats?.reduce((sum, user) => sum + (user.total_clicks || 0), 0) || 0;

      // المستخدمين الأكثر نشاطاً
      const { data: topUsers } = await supabase
        .from('users')
        .select('username, total_visits, total_clicks, last_visit_at, created_at, is_premium')
        .order('total_visits', { ascending: false })
        .limit(10);

      return {
        totalUsers: totalUsers || 0,
        totalVisits,
        totalClicks,
        topUsers: topUsers || []
      };
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      return {
        totalUsers: 0,
        totalVisits: 0,
        totalClicks: 0,
        topUsers: []
      };
    }
  }
}