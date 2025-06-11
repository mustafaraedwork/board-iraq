// src/components/dashboard/AddLinkForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { SOCIAL_PLATFORMS } from '@/lib/types';

interface AddLinkFormProps {
  onClose: () => void;
  onSave: (linkData: {
    type: string;
    platform?: string;
    title: string;
    url: string;
  }) => void;
}

const LINK_TYPES = [
  { id: 'phone', name: 'رقم الهاتف', icon: '📱', placeholder: '+964xxxxxxxxx' },
  { id: 'email', name: 'البريد الإلكتروني', icon: '✉️', placeholder: 'example@email.com' },
  { id: 'website', name: 'الموقع الإلكتروني', icon: '🌐', placeholder: 'https://example.com' },
  { id: 'location', name: 'الموقع الجغرافي', icon: '📍', placeholder: 'بغداد، العراق' },
  { id: 'social', name: 'وسائل التواصل الاجتماعي', icon: '📱', placeholder: '' },
  { id: 'file', name: 'ملف PDF', icon: '📄', placeholder: 'رابط الملف' },
  { id: 'custom', name: 'رابط مخصص', icon: '🔗', placeholder: 'https://example.com' }
];

const SOCIAL_PLATFORMS_LIST = [
  { id: 'facebook', name: 'فيسبوك', icon: '📘', placeholder: 'https://facebook.com/username' },
  { id: 'instagram', name: 'إنستجرام', icon: '📷', placeholder: 'https://instagram.com/username' },
  { id: 'whatsapp', name: 'واتساب', icon: '💬', placeholder: '+964xxxxxxxxx' },
  { id: 'telegram', name: 'تيليجرام', icon: '✈️', placeholder: 'https://t.me/username' },
  { id: 'twitter', name: 'تويتر/X', icon: '🐦', placeholder: 'https://twitter.com/username' },
  { id: 'linkedin', name: 'لينكد إن', icon: '💼', placeholder: 'https://linkedin.com/in/username' },
  { id: 'snapchat', name: 'سناب شات', icon: '👻', placeholder: 'https://snapchat.com/add/username' },
  { id: 'tiktok', name: 'تيك توك', icon: '🎵', placeholder: 'https://tiktok.com/@username' },
  { id: 'youtube', name: 'يوتيوب', icon: '▶️', placeholder: 'https://youtube.com/@username' }
];

export default function AddLinkForm({ onClose, onSave }: AddLinkFormProps) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setSelectedPlatform('');
    setTitle('');
    setUrl('');
    
    // تعيين عنوان افتراضي
    const typeData = LINK_TYPES.find(t => t.id === type);
    if (typeData && type !== 'social') {
      setTitle(typeData.name);
    }
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    const platformData = SOCIAL_PLATFORMS_LIST.find(p => p.id === platform);
    if (platformData) {
      setTitle(platformData.name);
    }
  };

  const handleSave = () => {
    if (!selectedType || !title.trim() || !url.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onSave({
      type: selectedType,
      platform: selectedType === 'social' ? selectedPlatform : undefined,
      title: title.trim(),
      url: url.trim()
    });

    onClose();
  };

  const getCurrentPlaceholder = () => {
    if (selectedType === 'social' && selectedPlatform) {
      return SOCIAL_PLATFORMS_LIST.find(p => p.id === selectedPlatform)?.placeholder || '';
    }
    return LINK_TYPES.find(t => t.id === selectedType)?.placeholder || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>إضافة رابط جديد</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* اختيار نوع الرابط */}
          {!selectedType && (
            <div>
              <h3 className="font-medium mb-3">اختر نوع الرابط:</h3>
              <div className="grid grid-cols-1 gap-2">
                {LINK_TYPES.map((type) => (
                  <Button
                    key={type.id}
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <span className="text-lg ml-3">{type.icon}</span>
                    <span>{type.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* اختيار منصة التواصل الاجتماعي */}
          {selectedType === 'social' && !selectedPlatform && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">اختر المنصة:</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedType('')}>
                  ← العودة
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {SOCIAL_PLATFORMS_LIST.map((platform) => (
                  <Button
                    key={platform.id}
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => handlePlatformSelect(platform.id)}
                  >
                    <span className="text-lg ml-3">{platform.icon}</span>
                    <span>{platform.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* نموذج الإدخال */}
          {selectedType && (selectedType !== 'social' || selectedPlatform) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">تفاصيل الرابط:</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    if (selectedType === 'social') {
                      setSelectedPlatform('');
                    } else {
                      setSelectedType('');
                    }
                  }}
                >
                  ← العودة
                </Button>
              </div>

              {/* حقل العنوان */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان الذي سيظهر للزوار *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: اتصل بي، حسابي الشخصي، موقعي، إلخ"
                />
                <p className="text-xs text-gray-500 mt-1">
                  يمكنك كتابة أي عنوان تريده (مثل: رقمي الشخصي، حساب العمل، إلخ)
                </p>
              </div>

              {/* حقل الرابط */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedType === 'phone' ? 'رقم الهاتف' : 
                   selectedType === 'email' ? 'البريد الإلكتروني' : 'الرابط'} *
                </label>
                <input
                  type={selectedType === 'email' ? 'email' : 'text'}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={getCurrentPlaceholder()}
                  dir="ltr"
                />
              </div>

              {/* معاينة */}
              {title && url && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">معاينة:</p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center ml-3">
                      <span className="text-white text-xs">
                        {LINK_TYPES.find(t => t.id === selectedType)?.icon ||
                         SOCIAL_PLATFORMS_LIST.find(p => p.id === selectedPlatform)?.icon}
                      </span>
                    </div>
                    <span className="font-medium">{title}</span>
                  </div>
                </div>
              )}

              {/* أزرار الحفظ */}
              <div className="flex space-x-2 space-x-reverse pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة الرابط
                </Button>
                <Button variant="outline" onClick={onClose}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}