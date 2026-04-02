import { Upload, Edit3, X, Check, Image as ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { uploadImageFile, uploadImageDataUrl } from "../../services/uploads";

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (newImageUrl: string) => void;
  className?: string;
  language: "ar" | "en";
  userPermissions: { canEditContent: boolean };
}

export function EditableImage({
  src,
  alt,
  onSave,
  className = "",
  language,
  userPermissions,
}: EditableImageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(src);
  const [previewUrl, setPreviewUrl] = useState(src);
  const [imageFailed, setImageFailed] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasSourceImage = Boolean(String(src || "").trim());
  const hasPreviewImage = Boolean(String(previewUrl || "").trim());

  useEffect(() => {
    setImageFailed(!hasSourceImage);
    setImageReady(false);
  }, [src]);

  useEffect(() => {
    setPreviewFailed(!hasPreviewImage);
    setPreviewReady(false);
  }, [previewUrl]);

  if (!userPermissions.canEditContent) {
    return (
      <div className="relative w-full h-full min-h-[180px] overflow-hidden">
        {!imageReady || imageFailed ? (
          <div className="absolute inset-0 shimmer-surface" />
        ) : null}
        <img
          src={src}
          alt={alt}
          className={`block w-full h-full ${className} ${imageFailed ? "invisible" : ""}`}
          onLoad={() => setImageReady(true)}
          onError={() => {
            setImageFailed(true);
            setImageReady(true);
          }}
        />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setUploadError(null);
      setIsUploading(true);
      uploadImageFile(file)
        .then((url) => {
          if (url) {
            setTempUrl(url);
            setPreviewUrl(url);
          }
        })
        .catch((err: any) => {
          setUploadError(err?.message || "Failed to upload image");
        })
        .finally(() => {
          setIsUploading(false);
          URL.revokeObjectURL(localUrl);
        });
    }
  };

  const handleUrlChange = (url: string) => {
    setTempUrl(url);
    setPreviewUrl(url);
  };

  const handleSave = () => {
    if (isUploading) return;
    if (tempUrl.trim()) {
      onSave(tempUrl);
      setIsEditing(false);
    }
  };

  const isBase64 = (value: string) =>
    value.startsWith("data:image/");

  const handleInstallBase64 = async () => {
    if (!isBase64(tempUrl)) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImageDataUrl(tempUrl);
      if (url) {
        setTempUrl(url);
        setPreviewUrl(url);
        onSave(url);
        setIsEditing(false);
      }
    } catch (err: any) {
      setUploadError(err?.message || "Failed to install image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setTempUrl(src);
    setPreviewUrl(src);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="relative group/image w-full h-full min-h-[180px] overflow-hidden">
        {!imageReady || imageFailed ? (
          <div className="absolute inset-0 shimmer-surface" />
        ) : null}
        <img
          src={src}
          alt={alt}
          className={`block w-full h-full ${className} ${imageFailed ? "invisible" : ""}`}
          onLoad={() => setImageReady(true)}
          onError={() => {
            setImageFailed(true);
            setImageReady(true);
          }}
        />
        <button
          onClick={() => setIsEditing(true)}
          className={`absolute top-3 ${language === "ar" ? "right-3":"left-3" } p-3 bg-purple-500 text-white rounded-lg opacity-100 transition-all duration-200 hover:bg-purple-600 shadow-xl z-20 border-2 border-white`}
          title={language === "ar" ? "تغيير الصورة" : "Change Image"}
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[220px]">
      {/* Preview */}
      <div className="relative w-full h-full min-h-[220px] overflow-hidden">
        {!previewReady || previewFailed ? (
          <div className="absolute inset-0 border-4 border-purple-500 shimmer-surface" />
        ) : null}
        <img
          src={previewUrl}
          alt={alt}
          className={`block w-full h-full ${className} opacity-75 border-4 border-purple-500 ${previewFailed ? "invisible" : ""}`}
          onLoad={() => setPreviewReady(true)}
          onError={() => {
            setPreviewFailed(true);
            setPreviewReady(true);
          }}
        />
        <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-[1px] flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-2xl">
            <ImageIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">
              {language === "ar" ? "جاري التعديل..." : "Editing..."}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Controls */}
      <div className="relative mt-4 bg-white rounded-xl p-4 shadow-2xl border-2 border-purple-500 z-30">
        <div className="space-y-3">
          {/* URL Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {language === "ar" ? "رابط الصورة:" : "Image URL:"}
            </label>
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={
                language === "ar"
                  ? "أدخل رابط الصورة..."
                  : "Enter image URL..."
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          {/* File Upload */}
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-bold"
            >
              <Upload className="w-4 h-4" />
              {isUploading
                ? language === "ar"
                  ? "جاري رفع الصورة..."
                  : "Uploading image..."
                : language === "ar"
                ? "أو ارفع صورة"
                : "Or Upload Image"}
            </button>
            {uploadError && (
              <p className="mt-2 text-xs text-red-600">{uploadError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-bold"
            >
              <Check className="w-4 h-4" />
              {language === "ar" ? "حفظ" : "Save"}
            </button>
            {isBase64(tempUrl) && (
              <button
                onClick={handleInstallBase64}
                disabled={isUploading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-bold"
              >
                {language === "ar" ? "تثبيت" : "Install"}
              </button>
            )}
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-bold"
            >
              <X className="w-4 h-4" />
              {language === "ar" ? "إلغاء" : "Cancel"}
            </button>
            {uploadError && (
              <p className="mt-2 text-xs text-red-600">{uploadError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
