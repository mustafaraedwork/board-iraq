// src/components/dashboard/ImageEditor.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Check, RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface ImageEditorProps {
  imageFile: File;
  onSave: (croppedImageDataUrl: string) => void;
  onCancel: () => void;
}

export default function ImageEditor({ imageFile, onSave, onCancel }: ImageEditorProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // تحميل الصورة
  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);
    
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  // بداية السحب
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  // أثناء السحب
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  // انتهاء السحب
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // تكبير الصورة
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  // تصغير الصورة
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  // إعادة تعيين
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // حفظ الصورة المقطوعة
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // حجم الكانفاس النهائي (400x400)
    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // تنظيف الكانفاس
    ctx.clearRect(0, 0, outputSize, outputSize);

    // الحصول على أبعاد الصورة الأصلية
    const img = imageRef.current;
    
    // حجم منطقة العرض (320x320)
    const viewportSize = 320;
    
    // نسبة التحويل من منطقة العرض إلى الكانفاس النهائي
    const outputScale = outputSize / viewportSize;
    
    // حساب أبعاد الصورة في منطقة العرض
    const displayWidth = img.naturalWidth * scale;
    const displayHeight = img.naturalHeight * scale;
    
    // حساب أبعاد الصورة في الكانفاس النهائي
    const finalWidth = displayWidth * outputScale;
    const finalHeight = displayHeight * outputScale;
    
    // حساب الموقع النهائي
    const finalX = (outputSize - finalWidth) / 2 + (position.x * outputScale);
    const finalY = (outputSize - finalHeight) / 2 + (position.y * outputScale);

    // رسم الصورة على الكانفاس
    ctx.drawImage(img, finalX, finalY, finalWidth, finalHeight);

    // تحويل إلى Data URL وإرساله
    const croppedImageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onSave(croppedImageDataUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" dir="rtl">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>تعديل الصورة الشخصية</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* منطقة التعديل */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div 
              className="relative w-80 h-80 mx-auto bg-white rounded-lg overflow-hidden border-2 border-gray-300 cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ userSelect: 'none' }}
            >
              {imageUrl && (
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="تعديل الصورة"
                  className="absolute top-1/2 left-1/2 pointer-events-none max-w-none"
                  style={{
                    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease',
                    minWidth: '100%',
                    minHeight: '100%',
                    objectFit: 'cover'
                  }}
                  draggable={false}
                  onLoad={(e) => {
                    // ضبط الحجم الابتدائي ليملأ المنطقة بشكل جيد
                    const img = e.target as HTMLImageElement;
                    const containerSize = 320;
                    const scaleToFit = Math.max(
                      containerSize / img.naturalWidth,
                      containerSize / img.naturalHeight
                    );
                    setScale(scaleToFit);
                    setPosition({ x: 0, y: 0 }); // البدء من المنتصف
                    setImageLoaded(true); // تم تحميل الصورة
                  }}
                />
              )}
              
              {/* خطوط إرشادية */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white opacity-30"></div>
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white opacity-30"></div>
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white opacity-30"></div>
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white opacity-30"></div>
              </div>
            </div>
            
            <p className="text-center text-sm text-gray-600 mt-2">
              استخدم الماوس لسحب الصورة وضبط موقعها
            </p>
          </div>

          {/* أدوات التحكم */}
          <div className="space-y-4">
            {/* التكبير والتصغير */}
            <div className="flex items-center justify-center space-x-4 space-x-reverse">
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4 ml-2" />
                تصغير
              </Button>
              
              <div className="flex items-center space-x-2 space-x-reverse min-w-32">
                <span className="text-sm text-gray-600">التكبير:</span>
                <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
              </div>
              
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4 ml-2" />
                تكبير
              </Button>
            </div>

            {/* شريط التكبير */}
            <div className="px-4">
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* أزرار إضافية */}
            <div className="flex justify-center space-x-2 space-x-reverse">
              <Button variant="outline" size="sm" onClick={resetView}>
                <Move className="h-4 w-4 ml-2" />
                إعادة تعيين
              </Button>
            </div>
          </div>

          {/* معاينة النتيجة */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">معاينة النتيجة:</h4>
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300 bg-white relative">
                {imageUrl && imageLoaded && imageRef.current && (
                  <img
                    src={imageUrl}
                    alt="معاينة"
                    className="absolute top-1/2 left-1/2 pointer-events-none"
                    style={{
                      transform: `translate(-50%, -50%) translate(${position.x * 0.3}px, ${position.y * 0.3}px) scale(${scale * 0.3})`,
                      transformOrigin: 'center center',
                      maxWidth: 'none',
                      maxHeight: 'none'
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex space-x-2 space-x-reverse pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              <Check className="h-4 w-4 ml-2" />
              تم - حفظ الصورة
            </Button>
            <Button variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
          </div>

          {/* كانفاس مخفي للقطع */}
          <canvas
            ref={canvasRef}
            className="hidden"
            width={400}
            height={400}
          />
        </CardContent>
      </Card>
    </div>
  );
}