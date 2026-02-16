import { Edit3, Check, X, Settings } from "lucide-react";
import { useState } from "react";
import {
  Smartphone,
  Camera,
  Battery,
  Laptop,
  Watch,
  Headphones,
  Shield,
} from "lucide-react";

const iconMap: { [key: string]: any } = {
  Smartphone,
  Watch,
  Headphones,
  Battery,
  Camera,
  Laptop,
  Shield,
  Settings,
};

interface KeyFeaturesEditorProps {
  specs: any[];
  selectedSpecs: any[];
  onSave: (selectedSpecs: any[]) => void;
  language: "ar" | "en";
  userPermissions: { canEditContent: boolean };
}

export function KeyFeaturesEditor({
  specs,
  selectedSpecs,
  onSave,
  language,
  userPermissions,
}: KeyFeaturesEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<number[]>(
    selectedSpecs.map((spec) => specs.findIndex((s) => s.title === spec.title))
  );

  if (!userPermissions.canEditContent) {
    return null;
  }

  const handleToggleSpec = (index: number) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      if (selected.length < 4) {
        setSelected([...selected, index]);
      }
    }
  };

  const handleSave = () => {
    const newSelectedSpecs = selected.map((index) => specs[index]);
    onSave(newSelectedSpecs);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSelected(
      selectedSpecs.map((spec) => specs.findIndex((s) => s.title === spec.title))
    );
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className={`absolute top-4 ${language === "ar" ? "left-4" : "right-4"} p-2 bg-white rounded-lg shadow-lg border-2 border-[#009FE3] text-[#009FE3] opacity-100 transition-all duration-200 hover:bg-[#009FE3] hover:text-white flex items-center gap-2 z-10`}
      >
        <Edit3 className="w-4 h-4" />
        <span className="text-sm font-bold">
          {language === "ar" ? "تعديل المميزات" : "Edit Features"}
        </span>
      </button>
    );
  }

  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl p-6 z-20 animate-fadeIn overflow-auto border-2 border-purple-500 shadow-2xl">
      <h4 className="font-bold text-gray-900 mb-4 text-lg">
        {language === "ar"
          ? "اختر 4 مميزات رئيسية من المواصفات"
          : "Select 4 key features from specifications"}
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {specs.map((spec, index) => {
          const IconComponent = iconMap[spec.icon] || Settings;
          const isSelected = selected.includes(index);

          return (
            <button
              key={index}
              onClick={() => handleToggleSpec(index)}
              className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                isSelected
                  ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-500 shadow-md"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg flex-shrink-0 ${
                  isSelected
                    ? "bg-gradient-to-br from-[#009FE3] to-[#007BC7]"
                    : "bg-gray-100"
                }`}
              >
                <IconComponent
                  className={`w-5 h-5 ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">{spec.title}</p>
                <p className="font-bold text-gray-900 truncate">{spec.value}</p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
        <p className="text-sm text-blue-700">
          {language === "ar"
            ? `تم اختيار ${selected.length} من 4 مميزات`
            : `Selected ${selected.length} of 4 features`}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={selected.length !== 4}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-5 h-5" />
          {language === "ar" ? "حفظ" : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" />
          {language === "ar" ? "إلغاء" : "Cancel"}
        </button>
      </div>
    </div>
  );
}
