// src/components/CourseForm/BasicInfo.tsx
import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, Controller, useFormContext } from 'react-hook-form';
import { useGetAllLevelsQuery, useGetAllCategoriesQuery } from '../services/api';
import { Level, Category } from '../utils/typeDef';
import { getImageUrl } from '../utils/imageUtils';

interface BasicInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  coverPreview: string | null;
  setCoverPreview: (preview: string | null) => void;
  setMainCoverFile: (file: File | null) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  register,
  errors,
  coverPreview,
  setCoverPreview,
  setMainCoverFile
}) => {
  const { data: levelsData } = useGetAllLevelsQuery();
  const { data: categoriesData } = useGetAllCategoriesQuery({ page: 1, limit: 100 });
  const { watch, setValue } = useFormContext();
  const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
  
  const levels = Array.isArray(levelsData?.payload) 
    ? levelsData.payload 
    : (levelsData?.payload as any)?.data || [];
  const categories = categoriesData?.payload?.data || [];

  useEffect(() => {
    const watchedLevel = watch('level');
    const watchedLevels = watch('levels');
    
    if (watchedLevels && Array.isArray(watchedLevels)) {
      setSelectedLevels(watchedLevels);
    } else if (watchedLevel) {
      setSelectedLevels([watchedLevel]);
    }
  }, [watch('level'), watch('levels'), watch]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setMainCoverFile(file);
    }
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setMainCoverFile(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre du cours *
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Le titre est requis' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Entrez le titre du cours"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
          )}
        </div>
        
        {/* Legend */}
        <div>
          <label htmlFor="legend" className="block text-sm font-medium text-gray-700 mb-1">
            Légende du cours *
          </label>
          <textarea
            id="legend"
            {...register('legend', { required: 'La légende est requise' })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brève description du cours"
          />
          {errors.legend && (
            <p className="mt-1 text-sm text-red-600">{errors.legend.message as string}</p>
          )}
        </div>
        
        {/* Estimated time */}
        <div>
          <label htmlFor="est_time_min" className="block text-sm font-medium text-gray-700 mb-1">
            Durée estimée (minutes) *
          </label>
          <input
            id="est_time_min"
            type="number"
            min="1"
            {...register('est_time_min', { 
              required: 'La durée est requise',
              min: { value: 1, message: 'La durée doit être positive' }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.est_time_min && (
            <p className="mt-1 text-sm text-red-600">{errors.est_time_min.message as string}</p>
          )}
        </div>
      </div>
      
      {/* Right column */}
      <div className="space-y-6">
        {/* Cover image */}
        <div>
          <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">
            Image de couverture
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                id="cover"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {coverPreview && (
              <div className="relative">
                <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-gray-200">
                  <img 
                    src={coverPreview} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Supprimer l'image"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Levels (Multi-select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveaux * <span className="text-xs text-gray-500">(sélectionner 1 ou plusieurs)</span>
          </label>
          <div className="space-y-2 border border-gray-300 rounded-md p-3 bg-white max-h-48 overflow-y-auto">
            {levels.map((level: Level) => (
              <div key={level.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`level_${level.id}`}
                  checked={selectedLevels.includes(level.id)}
                  onChange={(e) => {
                    const newLevels = e.target.checked
                      ? [...selectedLevels, level.id]
                      : selectedLevels.filter(l => l !== level.id);
                    setSelectedLevels(newLevels);
                    setValue('levels', newLevels);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`level_${level.id}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                  {level.name}
                </label>
              </div>
            ))}
          </div>
          {errors.levels && (
            <p className="mt-1 text-sm text-red-600">{errors.levels.message as string}</p>
          )}
          {selectedLevels.length === 0 && (
            <p className="mt-1 text-sm text-red-600">Sélectionnez au moins un niveau</p>
          )}
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie *
          </label>
          <select
            id="category"
            {...register('category', { required: 'La catégorie est requise' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message as string}</p>
          )}
        </div>
        
        {/* Published status */}
        <div className="flex items-center space-x-2 mt-4">
          <input
            id="published"
            type="checkbox"
            {...register('published')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">
            Publier immédiatement
          </label>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;