// src/components/dashboard/EditProfileForm.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save, Upload, User as UserIcon, Edit } from 'lucide-react';
import type { User } from '@/lib/types';
import ImageEditor from './ImageEditor';

interface EditProfileFormProps {
  user: User;
  onClose: () => void;
  onSave: (profileData: {
    full_name?: string;
    job_title?: string;
    company?: string;
    bio?: string;
    profile_image_url?: string;
    background_color?: string;
    text_color?: string;
    button_color?: string;
  }) => void;
}

export default function EditProfileForm({ user, onClose, onSave }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    job_title: user.job_title || '',
    company: user.company || '',
    bio: user.bio || '',
    profile_image_url: user.profile_image_url || '',
    background_color: user.background_color || '#F0EEE6',
    text_color: user.text_color || '#141413',
    button_color: user.button_color || '#D97757'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  // دالة لتحديد لون النص تلقائياً بناءً على لون الخلفية
  const getAutoTextColor = (backgroundColor: string): string => {
    // إذا كان اللون أبيض أو فاتح جداً أو الكريمي الافتراضي
    if (backgroundColor === '#ffffff' || backgroundColor === '#fff' || 
        backgroundColor === 'white' || backgroundColor === '#f8f9fa' ||
        backgroundColor === '#F0EEE6' || backgroundColor === '#f0eee6' ||
        backgroundColor.includes('255, 255, 255')) {
      return '#141413'; // أسود داكن
    }
    
    // للألوان المتدرجة، استخدم النص الأبيض دائماً
    if (backgroundColor.includes('gradient') || backgroundColor.includes('linear-gradient')) {
      return '#ffffff';
    }
    
    // إذا كان اللون hex
    if (backgroundColor.startsWith('#')) {
      const hex = backgroundColor.replace('#', '');
      if (hex.length >= 6) {
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // حساب اللمعة (brightness)
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        
        // إذا كان اللون فاتح (لمعة > 128) استخدم نص أسود داكن، وإلا أبيض
        return brightness > 128 ? '#141413' : '#ffffff';
      }
    }
    
    // للألوان الداكنة الأخرى
    return '#ffffff';
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // إذا تم تغيير لون الخلفية، حدث لون النص تلقائياً
      if (field === 'background_color') {
        newData.text_color = getAutoTextColor(value);
      }
      
      return newData;
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صحيح');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
        return;
      }
      
      setSelectedImageFile(file);
      setShowImageEditor(true);
    }
  };

  const handleImageSave = (croppedImageDataUrl: string) => {
    handleChange('profile_image_url', croppedImageDataUrl);
    setShowImageEditor(false);
    setSelectedImageFile(null);
  };

  const handleImageCancel = () => {
    setShowImageEditor(false);
    setSelectedImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // خيارات ألوان الخلفية
  const backgroundColorOptions = [
    // اللون الافتراضي أولاً
    { name: 'كريمي افتراضي', color: '#F0EEE6', type: 'solid' },
    
    // الألوان الداكنة (مثل التصميم الجديد)
    { name: 'أسود', color: '#1a1a1a', type: 'solid' },
    { name: 'رمادي غامق', color: '#2d2d2d', type: 'solid' },
    { name: 'أزرق داكن', color: '#1e293b', type: 'solid' },
    { name: 'بنفسجي داكن', color: '#581c87', type: 'solid' },
    { name: 'أخضر داكن', color: '#14532d', type: 'solid' },
    { name: 'بني داكن', color: '#451a03', type: 'solid' },
    
    // الألوان المتدرجة الحديثة
    { name: 'غروب أخضر', color: 'linear-gradient(135deg, #a8e6cf 0%, #88c999 50%, #4caf50 100%)', type: 'gradient' },
    { name: 'محيط أزرق', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', type: 'gradient' },
    { name: 'ليل بنفسجي', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', type: 'gradient' },
    { name: 'شمس ذهبية', color: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', type: 'gradient' },
    { name: 'وردي نار', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', type: 'gradient' },
    { name: 'فيروزي طبيعة', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', type: 'gradient' },
    { name: 'قوس قزح', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', type: 'gradient' },
    { name: 'نار أحمر', color: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', type: 'gradient' },
  ];

  // خيارات ألوان الأزرار
  const buttonColorOptions = [
    '#D97757', // برتقالي افتراضي
    '#2d2d2d', // رمادي داكن
    '#1f2937', // رمادي أغمق
    '#374151', // رمادي فاتح
    '#4b5563', // رمادي متوسط
    '#6b7280', // رمادي
    '#3b82f6', // أزرق
    '#8b5cf6', // بنفسجي
    '#10b981', // أخضر
    '#f59e0b', // برتقالي
    '#ef4444', // أحمر
    '#ec4899', // وردي
    '#06b6d4', // فيروزي
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Edit className="h-5 w-5 ml-2" />
            تحرير الملف الشخصي
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* معلومات أساسية */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">المعلومات الأساسية</h3>
            
            {/* رفع الصورة */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الصورة الشخصية
              </label>
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300">
                  {formData.profile_image_url ? (
                    <Image
                      src={formData.profile_image_url}
                      alt="صورة شخصية"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2"
                  >
                    <Upload className="h-4 w-4 ml-2" />
                    اختيار صورة
                  </Button>
                  <p className="text-xs text-gray-500">
                    JPG, PNG أو GIF (حد أقصى 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* الحقول النصية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="الاسم الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المسمى الوظيفي
                </label>
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={(e) => handleChange('job_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مطور، مصمم، مدير..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الشركة/المؤسسة
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="اسم الشركة أو المؤسسة"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نبذة شخصية (اختياري)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل وصف مختصر عن نفسك..."
              />
            </div>

            {/* ملاحظة للإيميل والهاتف */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>ملاحظة:</strong> لإضافة رقم الهاتف أو البريد الإلكتروني، استخدم قسم &quot;إضافة رابط&quot; أسفل هذه الصفحة.
              </p>
            </div>
          </div>

          {/* ألوان التصميم */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">🎨 ألوان التصميم</h3>
            
            {/* ألوان الخلفية */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                لون/خلفية الصفحة:
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {backgroundColorOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleChange('background_color', option.color)}
                    className={`w-full h-20 rounded-xl border-3 transition-all hover:scale-105 relative overflow-hidden ${
                      formData.background_color === option.color 
                        ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ 
                      background: option.type === 'gradient' ? option.color : undefined,
                      backgroundColor: option.type !== 'gradient' ? option.color : undefined
                    }}
                    title={option.name}
                  >
                    <div className="absolute bottom-1 left-1 right-1">
                      <span className="text-xs text-white bg-black bg-opacity-60 px-2 py-1 rounded-md block text-center">
                        {option.name}
                      </span>
                    </div>
                    {formData.background_color === option.color && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ألوان الأزرار */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                لون الأزرار/الروابط:
              </label>
              <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                {buttonColorOptions.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleChange('button_color', color)}
                    className={`w-full h-14 rounded-lg border-2 transition-all hover:scale-105 relative ${
                      formData.button_color === color 
                        ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {formData.button_color === color && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ملاحظة عن لون النص التلقائي */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3 space-x-reverse">
                <div className="text-blue-500 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-blue-800 mb-1">لون النص التلقائي</h5>
                  <p className="text-sm text-blue-700">
                    يتم تحديد لون النص تلقائياً بناءً على لون الخلفية:
                  </p>
                  <ul className="text-xs text-blue-600 mt-1 list-disc list-inside">
                    <li>خلفية فاتحة → نص أسود</li>
                    <li>خلفية داكنة → نص أبيض</li>
                  </ul>
                  <div className="mt-2 text-xs">
                    <span className="font-medium">اللون الحالي: </span>
                    <span 
                      className="px-2 py-1 rounded text-white font-mono"
                      style={{ backgroundColor: formData.text_color }}
                    >
                      {formData.text_color}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* خيار مخصص للخلفية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                خلفية مخصصة (متقدم):
              </label>
              <input
                type="text"
                value={formData.background_color}
                onChange={(e) => handleChange('background_color', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: #1a1a1a أو linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                يمكنك استخدام أي لون HEX أو CSS gradient
              </p>
            </div>
          </div>

          {/* معاينة التصميم */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-4">📱 معاينة التصميم:</h4>
            <div className="max-w-sm mx-auto">
              {/* محاكي الهاتف */}
              <div 
                className="rounded-2xl overflow-hidden shadow-xl border-4 border-gray-800"
                style={{ aspectRatio: '9/16' }}
              >
                {/* شاشة الهاتف */}
                <div 
                  className="h-full relative"
                  style={{ 
                    background: formData.background_color?.includes('gradient') 
                      ? formData.background_color 
                      : undefined,
                    backgroundColor: !formData.background_color?.includes('gradient') 
                      ? formData.background_color 
                      : undefined
                  }}
                >
                  {/* Header مع القائمة */}
                  <div className="relative pt-6">
                    <div className="absolute top-6 left-6">
                      <div className="w-6 h-6 rounded bg-white bg-opacity-20"></div>
                    </div>

                    {/* الصورة الشخصية */}
                    <div className="flex flex-col items-center pt-8 pb-6">
                      <div className="relative">
                        {formData.profile_image_url ? (
                          <Image
                            src={formData.profile_image_url}
                            alt="معاينة"
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover border-3 border-white border-opacity-20"
                          />
                        ) : (
                          <div 
                            className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white border-3 border-white border-opacity-20"
                            style={{
                              background: 'linear-gradient(135deg, #a8e6cf 0%, #88c999 50%, #4caf50 100%)'
                            }}
                          >
                            {(formData.full_name || user.username).charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* اسم المستخدم */}
                      <h1 
                        className="text-lg font-semibold mt-4 mb-1"
                        style={{ color: formData.text_color }}
                      >
                        {user.username}
                      </h1>

                      {/* المسمى الوظيفي */}
                      {formData.job_title && (
                        <p 
                          className="text-sm opacity-90"
                          style={{ color: formData.text_color }}
                        >
                          {formData.job_title}
                        </p>
                      )}

                      {/* اسم الشركة */}
                      {formData.company && (
                        <p 
                          className="text-sm font-medium opacity-80"
                          style={{ color: formData.text_color }}
                        >
                          {formData.company}
                        </p>
                      )}

                      {/* الوصف */}
                      {formData.bio && (
                        <p 
                          className="text-sm text-center max-w-48 px-4 leading-relaxed opacity-80 mt-2"
                          style={{ color: formData.text_color }}
                        >
                          {formData.bio.slice(0, 60)}...
                        </p>
                      )}
                    </div>

                    {/* الأيقونات السريعة */}
                    <div className="flex justify-center space-x-6 pb-6">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="w-6 h-6 rounded opacity-80"
                          style={{ backgroundColor: formData.text_color }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* قائمة الروابط */}
                  <div className="px-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3 rounded-xl"
                        style={{ backgroundColor: formData.button_color }}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded opacity-90"
                            style={{ backgroundColor: formData.text_color }}
                          ></div>
                          <span 
                            className="font-medium text-sm"
                            style={{ color: formData.text_color }}
                          >
                            رابط تجريبي {i}
                          </span>
                        </div>
                        <div 
                          className="w-4 h-4 rounded opacity-60"
                          style={{ backgroundColor: formData.text_color }}
                        ></div>
                      </div>
                    ))}
                  </div>

                  {/* Footer - دائماً بنفس التصميم */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div 
                      className="flex items-center justify-center px-4 py-3 rounded-xl"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <span 
                        className="text-sm font-medium opacity-90"
                        style={{ color: formData.text_color }}
                      >
                        ⚡ انضم إلى {user.username} ⚡
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex space-x-3 space-x-reverse pt-6 border-t">
            <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
            <Button variant="outline" onClick={onClose} className="px-8">
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* محرر الصور */}
      {showImageEditor && selectedImageFile && (
        <ImageEditor
          imageFile={selectedImageFile}
          onSave={handleImageSave}
          onCancel={handleImageCancel}
        />
      )}
    </div>
  );
}