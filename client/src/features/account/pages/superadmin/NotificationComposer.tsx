import { useState } from "react";
import { motion } from "motion/react";
import { X, Send, Users, Package, Calendar, Bell, Gift, AlertCircle, ShoppingCart, CheckCircle } from "lucide-react";
import {products}  from "../../../../data/products";
import { CURRENCY_LABEL } from "../../../../utils/currency";

interface NotificationComposerProps {
  language: "ar" | "en";
  onClose: () => void;
  onSend: (notification: any) => void;
}

export function NotificationComposer({ language, onClose, onSend }: NotificationComposerProps) {
  const isRTL = language === "ar";
  const [step, setStep] = useState(1);
  
  // Form state
  const [type, setType] = useState<'order' | 'offer' | 'restock' | 'announcement' | 'alert' | 'message'>('announcement');
  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [message, setMessage] = useState("");
  const [messageAr, setMessageAr] = useState("");
  const [icon, setIcon] = useState("📢");
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  
  // Recipients
  const [recipientType, setRecipientType] = useState<'all' | 'specific' | 'segment'>('all');
  const [recipientCount, setRecipientCount] = useState(1250);
  
  // Navigation
  const [navigationType, setNavigationType] = useState<'none' | 'url' | 'product' | 'category' | 'cart' | 'orders'>('none');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  
  // Scheduling
  const [sendTime, setSendTime] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  
  // Channels
  const [channels, setChannels] = useState<('push' | 'inapp' | 'email' | 'sms')[]>(['push', 'inapp']);

  const typeIcons = {
    order: '📦',
    offer: '🎁',
    restock: '🔔',
    announcement: '📢',
    alert: '⚠️',
    message: '💬',
  };

  const emojiOptions = ['📢', '🎁', '🔔', '📦', '⚠️', '💬', '✨', '🎉', '💝', '🏆', '⭐', '🔥'];

  const handleSend = () => {
    const notification = {
      type,
      title,
      titleAr,
      message,
      messageAr,
      icon,
      priority,
      recipientType,
      recipientCount,
      navigationType,
      navigationTarget: selectedProduct?.id,
      channels,
      scheduledFor: sendTime === 'scheduled' && scheduledDate && scheduledTime 
        ? new Date(`${scheduledDate}T${scheduledTime}`)
        : undefined,
    };
    onSend(notification);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {isRTL ? "إنشاء إشعار جديد" : "Create New Notification"}
                </h2>
                <p className="text-orange-100 text-sm">
                  {isRTL ? `الخطوة ${step} من 3` : `Step ${step} of 3`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">
                {isRTL ? "محتوى الإشعار" : "Notification Content"}
              </h3>
              
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? "نوع الإشعار" : "Notification Type"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['announcement', 'offer', 'restock', 'order', 'alert', 'message'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        setType(t);
                        setIcon(typeIcons[t]);
                      }}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        type === t
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{typeIcons[t]}</div>
                      <p className="text-sm font-medium">
                        {isRTL 
                          ? t === 'announcement' ? 'إعلان' :
                            t === 'offer' ? 'عرض' :
                            t === 'restock' ? 'توفر' :
                            t === 'order' ? 'طلب' :
                            t === 'alert' ? 'تنبيه' :
                            'رسالة'
                          : t.charAt(0).toUpperCase() + t.slice(1)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? "الأيقونة" : "Icon"}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {emojiOptions.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setIcon(emoji)}
                      className={`w-12 h-12 text-2xl rounded-lg transition-all ${
                        icon === emoji
                          ? 'bg-orange-100 ring-2 ring-orange-500'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isRTL ? "العنوان (بالإنجليزية)" : "Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isRTL ? "العنوان (بالعربية)" : "Title (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="أدخل العنوان..."
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isRTL ? "الرسالة (بالإنجليزية)" : "Message (English)"}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter message..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isRTL ? "الرسالة (بالعربية)" : "Message (Arabic)"}
                  </label>
                  <textarea
                    value={messageAr}
                    onChange={(e) => setMessageAr(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="أدخل الرسالة..."
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? "الأولوية" : "Priority"}
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {(['low', 'normal', 'high', 'urgent'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        priority === p
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <p className="text-sm font-medium capitalize">{p}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">
                {isRTL ? "المستلمون والوجهة" : "Recipients & Navigation"}
              </h3>

              {/* Recipient Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? "إرسال إلى" : "Send To"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => { setRecipientType('all'); setRecipientCount(1250); }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      recipientType === 'all'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">
                      {isRTL ? 'جميع المستخدمين' : 'All Users'}
                    </p>
                    <p className="text-xs text-gray-500">1,250</p>
                  </button>
                  <button
                    onClick={() => { setRecipientType('segment'); setRecipientCount(234); }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      recipientType === 'segment'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">
                      {isRTL ? 'عملاء السلة' : 'Cart Users'}
                    </p>
                    <p className="text-xs text-gray-500">234</p>
                  </button>
                  <button
                    onClick={() => { setRecipientType('specific'); setRecipientCount(1); }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      recipientType === 'specific'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">
                      {isRTL ? 'مستخدم محدد' : 'Specific User'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Navigation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? "الانتقال إلى" : "Navigate To"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['none', 'product', 'cart', 'orders'] as const).map(nav => (
                    <button
                      key={nav}
                      onClick={() => setNavigationType(nav)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        navigationType === nav
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {isRTL 
                          ? nav === 'none' ? 'بدون' :
                            nav === 'product' ? 'منتج' :
                            nav === 'cart' ? 'السلة' :
                            'الطلبات'
                          : nav === 'none' ? 'None' :
                            nav.charAt(0).toUpperCase() + nav.slice(1)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Picker */}
              {navigationType === 'product' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isRTL ? "اختر المنتج" : "Select Product"}
                  </label>
                  {selectedProduct ? (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1">
                        <p className="font-medium">{isRTL ? selectedProduct.nameAr : selectedProduct.name}</p>
                        <p className="text-sm text-gray-600">{selectedProduct.price.toLocaleString()} {CURRENCY_LABEL}</p>
                      </div>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                      {products.slice(0, 5).map(product => (
                        <button
                          key={product.id}
                          onClick={() => setSelectedProduct(product)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                          <div className="flex-1 text-left">
                            <p className="font-medium text-sm">{isRTL ? product.nameAr : product.name}</p>
                            <p className="text-xs text-gray-600">{product.price.toLocaleString()} {CURRENCY_LABEL}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">
                {isRTL ? "الجدولة والقنوات" : "Scheduling & Channels"}
              </h3>

              {/* Send Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? "وقت الإرسال" : "Send Time"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSendTime('now')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      sendTime === 'now'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <Send className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">
                      {isRTL ? 'إرسال فوري' : 'Send Now'}
                    </p>
                  </button>
                  <button
                    onClick={() => setSendTime('scheduled')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      sendTime === 'scheduled'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">
                      {isRTL ? 'جدولة' : 'Schedule'}
                    </p>
                  </button>
                </div>
              </div>

              {sendTime === 'scheduled' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? 'التاريخ' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isRTL ? 'الوقت' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* Channels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'قنوات الإرسال' : 'Delivery Channels'}
                </label>
                <div className="space-y-2">
                  {(['push', 'inapp', 'email', 'sms'] as const).map(channel => (
                    <label key={channel} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={channels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setChannels([...channels, channel]);
                          } else {
                            setChannels(channels.filter(c => c !== channel));
                          }
                        }}
                        className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="font-medium capitalize">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                <h4 className="text-sm font-bold text-gray-700 mb-4">
                  {isRTL ? 'معاينة' : 'Preview'}
                </h4>
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{icon}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{isRTL ? titleAr || title : title}</p>
                      <p className="text-sm text-gray-600 mt-1">{isRTL ? messageAr || message : message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between bg-gray-50">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isRTL ? 'السابق' : 'Previous'}
            </button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              {isRTL ? 'التالي' : 'Next'}
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isRTL ? (sendTime === 'now' ? 'إرسال الآن' : 'جدولة الإرسال') : (sendTime === 'now' ? 'Send Now' : 'Schedule')}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
