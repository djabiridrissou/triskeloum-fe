// src/hooks/useEditCourseInitialization.ts
import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { getImageUrl } from '../utils/imageUtils';

interface CourseInitializationProps {
  initialData?: any;
  setValue: UseFormSetValue<any>;
  setCoverPreview: (preview: string | null) => void;
  setSections: (sections: any[]) => void;
  setSectionCoverPreviews: (previews: { [key: number]: string }) => void;
}

export const useEditCourseInitialization = ({
  initialData,
  setValue,
  setCoverPreview,
  setSections,
  setSectionCoverPreviews
}: CourseInitializationProps) => {
  useEffect(() => {
    if (!initialData) return;

    // Pré-remplir les champs de base
    setValue('title', initialData.title || '');
    setValue('legend', initialData.legend || '');
    setValue('est_time_min', initialData.est_time_min || 60);
    setValue('level', initialData.level?.id || '');
    setValue('category', initialData.category?.id || '');
    setValue('published', initialData.published || false);

    // Charger l'image de couverture existante
    if (initialData.cover) {
      const coverUrl = getImageUrl(initialData.cover);
      setCoverPreview(coverUrl);
    }

    // Charger les sections existantes avec leurs images
    if (initialData.sections && Array.isArray(initialData.sections)) {
      setSections(initialData.sections);

      // Charger les images des sections
      const sectionPreviews: { [key: number]: string } = {};
      initialData.sections.forEach((section: any, index: number) => {
        if (section.content?.cover) {
          sectionPreviews[index] = getImageUrl(section.content.cover);
        }
      });

      if (Object.keys(sectionPreviews).length > 0) {
        setSectionCoverPreviews(sectionPreviews);
      }
    }
  }, [initialData, setValue, setCoverPreview, setSections, setSectionCoverPreviews]);
};