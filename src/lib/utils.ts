// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===== دوال المصادقة الإضافية =====

export interface AuthUser {
  id: string;
  username: string;
  full_name?: string;
  isLoggedIn: boolean;
}

export class AuthService {
  
  // حفظ المستخدم المُسجل
  static saveUser(user: AuthUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('board_iraq_user', JSON.stringify(user));
    }
  }

  // الحصول على المستخدم المُسجل
  static getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('board_iraq_user');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      return user && user.isLoggedIn ? user : null;
    } catch (error) {
      console.error('خطأ في قراءة بيانات المستخدم:', error);
      return null;
    }
  }

  // تسجيل الخروج
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('board_iraq_user');
      window.location.href = '/login';
    }
  }

  // التحقق من تسجيل الدخول
  static isLoggedIn(): boolean {
    const user = this.getUser();
    return user !== null && user.isLoggedIn === true;
  }

  // الحصول على username الحالي
  static getCurrentUsername(): string | null {
    const user = this.getUser();
    return user ? user.username : null;
  }
}

// ===== دوال إدارة الأدمن =====

export class AdminService {
  
  // التحقق من صلاحيات الأدمن
  static async isUserAdmin(username: string): Promise<boolean> {
    try {
      const { supabase } = await import('@/lib/supabase/client');
      
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('username', username)
        .single();

      if (error || !data) {
        console.error('خطأ في فحص صلاحيات الأدمن:', error);
        return false;
      }

      return data.is_admin === true;
    } catch (error) {
      console.error('خطأ في التحقق من الأدمن:', error);
      return false;
    }
  }

  // فحص الصلاحيات للمستخدم الحالي
  static async checkCurrentUserAdmin(): Promise<boolean> {
    const currentUser = AuthService.getUser();
    
    if (!currentUser) {
      return false;
    }

    return await this.isUserAdmin(currentUser.username);
  }

  // توجيه للوحة الإدارة (مع فحص الصلاحيات)
  static async requireAdminAccess(): Promise<boolean> {
    const isAdmin = await this.checkCurrentUserAdmin();
    
    if (!isAdmin) {
      // توجيه لصفحة "غير مصرح"
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
      return false;
    }
    
    return true;
  }

  // جعل مستخدم أدمن (للاستخدام من console أو نماذج إدارية)
  static async makeUserAdmin(username: string): Promise<boolean> {
    try {
      const { supabase } = await import('@/lib/supabase/client');
      
      const { error } = await supabase
        .from('users')
        .update({ is_admin: true })
        .eq('username', username);

      if (error) {
        console.error('خطأ في جعل المستخدم أدمن:', error);
        return false;
      }

      console.log(`✅ تم جعل ${username} أدمن بنجاح`);
      return true;
    } catch (error) {
      console.error('خطأ في العملية:', error);
      return false;
    }
  }

  // إزالة صلاحيات الأدمن
  static async removeAdminAccess(username: string): Promise<boolean> {
    try {
      const { supabase } = await import('@/lib/supabase/client');
      
      const { error } = await supabase
        .from('users')
        .update({ is_admin: false })
        .eq('username', username);

      if (error) {
        console.error('خطأ في إزالة صلاحيات الأدمن:', error);
        return false;
      }

      console.log(`❌ تم إزالة صلاحيات الأدمن من ${username}`);
      return true;
    } catch (error) {
      console.error('خطأ في العملية:', error);
      return false;
    }
  }

  // الحصول على قائمة جميع الأدمن
  static async getAllAdmins(): Promise<string[]> {
    try {
      const { supabase } = await import('@/lib/supabase/client');
      
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('is_admin', true);

      if (error) {
        console.error('خطأ في جلب قائمة الأدمن:', error);
        return [];
      }

      return data.map(user => user.username);
    } catch (error) {
      console.error('خطأ في العملية:', error);
      return [];
    }
  }
}