import { Edit3, Check, X } from "lucide-react";
import { useState } from "react";

interface EditableContentProps {
  value: string;
  onSave: (newValue: string) => void;
  type?: "text" | "number" | "textarea";
  language: "ar" | "en";
  userPermissions: { canEditContent: boolean };
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  className?: string;
  editClassName?: string;
  validation?: (value: string) => boolean;
}

export function EditableContent({
  value,
  onSave,
  type = "text",
  language,
  userPermissions,
  placeholder,
  maxLength,
  minLength,
  className = "",
  editClassName = "",
  validation,
}: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [error, setError] = useState("");

  if (!userPermissions.canEditContent) {
    return <span className={className}>{value}</span>;
  }

  const handleSave = () => {
    // Validation
    if (minLength && tempValue.length < minLength) {
      setError(
        language === "ar"
          ? `الحد الأدنى ${minLength} حرف`
          : `Minimum ${minLength} characters`
      );
      return;
    }

    if (validation && !validation(tempValue)) {
      setError(language === "ar" ? "قيمة غير صالحة" : "Invalid value");
      return;
    }

    onSave(tempValue);
    setIsEditing(false);
    setError("");
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
    setError("");
  };

  if (!isEditing) {
    return (
      <div className="relative inline-block group">
        <span className={className}>{value}</span>
        <button
          onClick={() => setIsEditing(true)}
          className="absolute -top-1 -right-1 p-1 bg-[#009FE3] text-white rounded-md opacity-100 transition-all duration-200 hover:bg-[#007BC7] shadow-lg z-10"
          title={language === "ar" ? "تعديل" : "Edit"}
        >
          <Edit3 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-block w-full">
      {type === "textarea" ? (
        <textarea
          value={tempValue}
          onChange={(e) => {
            if (!maxLength || e.target.value.length <= maxLength) {
              setTempValue(e.target.value);
              setError("");
            }
          }}
          placeholder={placeholder}
          className={`${editClassName} w-full px-3 py-2 border-2 border-[#009FE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3] resize-none`}
          rows={4}
          autoFocus
        />
      ) : (
        <input
          type={type}
          value={tempValue}
          onChange={(e) => {
            if (!maxLength || e.target.value.length <= maxLength) {
              setTempValue(e.target.value);
              setError("");
            }
          }}
          placeholder={placeholder}
          className={`${editClassName} px-3 py-2 border-2 border-[#009FE3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]`}
          autoFocus
        />
      )}

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleSave}
          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 text-sm font-bold"
        >
          <Check className="w-4 h-4" />
          {language === "ar" ? "حفظ" : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-1 text-sm font-bold"
        >
          <X className="w-4 h-4" />
          {language === "ar" ? "إلغاء" : "Cancel"}
        </button>

        {maxLength && (
          <span className="text-xs text-gray-500 ml-auto">
            {tempValue.length} / {maxLength}
          </span>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 font-bold">{error}</p>
      )}
    </div>
  );
}
