import { Edit3, Check, X } from "lucide-react";
import { useState } from "react";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  editClassName?: string;
  language: "ar" | "en";
  userPermissions: { canEditContent: boolean };
  multiline?: boolean;
  placeholder?: string;
  maxLength?: number;
  label?: string;
}

export function EditableText({
  value,
  onSave,
  className = "",
  editClassName = "",
  language,
  userPermissions,
  multiline = false,
  placeholder = "",
  maxLength = 500,
  label,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  if (!userPermissions.canEditContent) {
    return <div className={className}>{value}</div>;
  }

  const handleSave = () => {
    if (tempValue.trim()) {
      onSave(tempValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="relative group/editable">
        <div className={className}>{value}</div>
        <button
          onClick={() => setIsEditing(true)}
          className="absolute -top-2 -right-2 p-1.5 bg-purple-500 text-white rounded-md opacity-0 group-hover/editable:opacity-100 transition-all duration-200 hover:bg-purple-600 shadow-lg z-10"
          title={language === "ar" ? "تحرير" : "Edit"}
        >
          <Edit3 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fadeIn">
      {label && (
        <label className="block text-sm font-bold text-gray-700">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          value={tempValue}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              setTempValue(e.target.value);
            }
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border-2 border-purple-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${editClassName}`}
          rows={3}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              setTempValue(e.target.value);
            }
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border-2 border-purple-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${editClassName}`}
          autoFocus
        />
      )}
      <div className="text-xs text-gray-500">
        {tempValue.length} / {maxLength} {language === "ar" ? "حرف" : "chars"}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-bold"
        >
          <Check className="w-4 h-4" />
          {language === "ar" ? "حفظ" : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-bold"
        >
          <X className="w-4 h-4" />
          {language === "ar" ? "إلغاء" : "Cancel"}
        </button>
      </div>
    </div>
  );
}
