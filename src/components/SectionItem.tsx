// src/components/CourseForm/SectionItem.tsx
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';
import PartItem from './PartItem';


interface SectionItemProps {
  section: any;
  sectionIndex: number;
  isCollapsed: boolean;
  coverPreview?: string;
  onToggle: () => void;
  onRemove: () => void;
  onChange: (field: string, value: any) => void;
  onContentChange: (field: string, value: any) => void;
  onCoverChange: (file: File, preview: string) => void;
  onCoverRemove: () => void;
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  sectionIndex,
  isCollapsed,
  coverPreview,
  onToggle,
  onRemove,
  onChange,
  onContentChange,
  onCoverChange,
  onCoverRemove
}) => {
  const [collapsedParts, setCollapsedParts] = useState<Set<number>>(new Set());

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onCoverChange(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPart = () => {
    const newParts = [
      ...section.content.parts,
      {
        title: `Partie ${section.content.parts.length + 1}`,
        content: ''
      }
    ];
    onContentChange('parts', newParts);
  };

  const handleRemovePart = (partIndex: number) => {
    const newParts = [...section.content.parts];
    newParts.splice(partIndex, 1);
    onContentChange('parts', newParts);
    
    setCollapsedParts(prev => {
      const newSet = new Set(prev);
      newSet.delete(partIndex);
      return newSet;
    });
  };

  const handlePartChange = (partIndex: number, field: string, value: any) => {
    const newParts = [...section.content.parts];
    newParts[partIndex][field] = value;
    onContentChange('parts', newParts);
  };

  const togglePart = (partIndex: number) => {
    setCollapsedParts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(partIndex)) {
        newSet.delete(partIndex);
      } else {
        newSet.add(partIndex);
      }
      return newSet;
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Section header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <button
              type="button"
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isCollapsed ? (
                <ChevronDownIcon className="w-5 h-5" />
              ) : (
                <ChevronUpIcon className="w-5 h-5" />
              )}
            </button>
            <span className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {sectionIndex + 1}
            </span>
            <input
              type="text"
              value={section.title}
              onChange={(e) => onChange('title', e.target.value)}
              className="font-semibold text-gray-900 bg-transparent border-none focus:ring-0 p-0 flex-1"
              placeholder="Titre de la section"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition-all duration-200"
          >
            Supprimer
          </button>
        </div>
      </div>
      
      {/* Section content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4 bg-white">
          {/* Section cover */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture de la section
            </label>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <label 
                  htmlFor={`section-cover-${sectionIndex}`}
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">
                      {coverPreview ? 'Changer l\'image' : 'Cliquez pour uploader'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF jusqu'à 5MB
                    </p>
                  </div>
                  <input
                    id={`section-cover-${sectionIndex}`}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>
              </div>
              {coverPreview && (
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img 
                      src={coverPreview} 
                      alt="Section cover preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onCoverRemove}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Section summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Résumé de la section
            </label>
            <RichTextEditor
              value={section.content.summary}
              onChange={(value) => onContentChange('summary', value)}
              placeholder="Résumé de la section..."
            />
          </div>
          
          {/* Section parts */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">
                Parties de la section ({section.content.parts.length})
              </h4>
              <button
                type="button"
                onClick={handleAddPart}
                className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition-all duration-200"
              >
                + Ajouter une partie
              </button>
            </div>
            
            <div className="space-y-3">
              {section.content.parts.map((part: any, partIndex: number) => (
                <PartItem
                  key={partIndex}
                  part={part}
                  partIndex={partIndex}
                  isCollapsed={collapsedParts.has(partIndex)}
                  onToggle={() => togglePart(partIndex)}
                  onRemove={() => handleRemovePart(partIndex)}
                  onChange={(field, value) => handlePartChange(partIndex, field, value)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionItem;