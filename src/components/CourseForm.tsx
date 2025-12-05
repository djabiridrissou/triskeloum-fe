// src/components/CourseForm.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useCourseDraft } from '../hooks/useCourseDraft';
import { useAutoSave } from '../hooks/useAutoSave';
import { useEditCourseInitialization } from '../hooks/useEditCourseInitialization';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Sections from './Sections';
import BasicInfo from './BasicInfo';

interface CourseFormProps {
    initialData?: any;
    onSubmit: (data: FormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting
}) => {
    const { hasDraft, loadDraft, saveDraft, clearDraft, isSaving } = useCourseDraft();
    const [showDraftPrompt, setShowDraftPrompt] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [sections, setSections] = useState<any[]>([]);
    const [sectionCoverPreviews, setSectionCoverPreviews] = useState<{ [key: number]: string }>({});
    const [sectionCoverFiles, setSectionCoverFiles] = useState<{ [key: number]: File }>({});
    const [mainCoverFile, setMainCoverFile] = useState<File | null>(null);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [contentType, setContentType] = useState<'sections' | 'media'>('sections');

    const methods = useForm({
        defaultValues: {
            title: initialData?.title || '',
            legend: initialData?.legend || '',
            est_time_min: initialData?.est_time_min || 60,
            levels: initialData?.levels?.map((l: any) => l.id) || (initialData?.level ? [initialData.level.id] : []),
            category: initialData?.category?.id || '',
            published: initialData?.published || false,
            contentType: initialData?.hasMediaContent ? 'media' : 'sections',
            mediaFile: null
        }
    });

    // Initialiser le formulaire avec les données du cours existant (édition)
    useEditCourseInitialization({
        initialData,
        setValue: methods.setValue,
        setCoverPreview,
        setSections,
        setSectionCoverPreviews
    });

    // Vérifier brouillon au montage
    useEffect(() => {
        if (!initialData && hasDraft) {
            setShowDraftPrompt(true);
        }
    }, []);

    // Restaurer brouillon
    const handleRestoreDraft = async () => {
        const draft = await loadDraft();
        if (draft) {
            const { data, files } = draft;

            // Restaurer formulaire
            Object.keys(data).forEach(key => {
                if (key !== 'sections' && key !== 'coverPreview' && key !== 'sectionCoverPreviews' && key !== 'timestamp') {
                    methods.setValue(key as any, data[key]);
                }
            });

            setSections(data.sections || []);
            setCoverPreview(data.coverPreview || null);
            setSectionCoverPreviews(data.sectionCoverPreviews || {});

            // Restaurer fichiers
            if (files['mainCover']) {
                setMainCoverFile(files['mainCover']);
            }

            const sectionFiles: { [key: number]: File } = {};
            Object.entries(files).forEach(([key, file]) => {
                if (key.startsWith('section_cover_')) {
                    const index = parseInt(key.replace('section_cover_', ''));
                    sectionFiles[index] = file;
                }
            });
            setSectionCoverFiles(sectionFiles);

            toast.success('Brouillon restauré');
        }
        setShowDraftPrompt(false);
    };

    const handleDiscardDraft = async () => {
        await clearDraft();
        setShowDraftPrompt(false);
    };

    // Préparer données pour auto-save
    const formValues = methods.watch();

    const draftData = useMemo(() => ({
        ...formValues,
        sections,
        coverPreview,
        sectionCoverPreviews
    }), [formValues, sections, coverPreview, sectionCoverPreviews]);

    const allFiles = useMemo(() => ({
        ...(mainCoverFile && { mainCover: mainCoverFile }),
        ...Object.entries(sectionCoverFiles).reduce((acc, [index, file]) => ({
            ...acc,
            [`section_cover_${index}`]: file
        }), {})
    }), [mainCoverFile, sectionCoverFiles]);

    // Auto-save (désactivé en mode édition)
    const { isSaving: isAutoSaving } = useAutoSave(
        draftData,
        allFiles,
        {
            onSave: saveDraft,
            delay: 3000,
            enabled: !initialData // Seulement en mode création
        }
    );

    const onFormSubmit = async (data: any) => {
        try {
            const formData = new FormData();

            formData.append('title', data.title);
            formData.append('legend', data.legend);
            formData.append('est_time_min', data.est_time_min.toString());
            formData.append('levels', JSON.stringify(data.levels || []));
            formData.append('category', data.category.toString());
            formData.append('published', data.published ? 'true' : 'false');

            // Ajouter le fichier de couverture principal uniquement s'il y a un nouveau fichier
            if (mainCoverFile) {
                formData.append('file', mainCoverFile);
            }

            // Gérer le contenu: soit sections, soit media
            if (contentType === 'media' && mediaFile) {
                formData.append('courseMedia', mediaFile);
            } else if (contentType === 'sections') {
                // Ajouter les fichiers de couverture des sections
                Object.entries(sectionCoverFiles).forEach(([index, file]) => {
                    formData.append(`section_cover_${index}`, file);
                });

                if (sections.length > 0) {
                    formData.append('sections', JSON.stringify(sections));
                }
            }

            // Appel API unique via onSubmit (gérée par la page parent)
            await onSubmit(formData);
            await clearDraft();
            onCancel();
        } catch (error: any) {
            console.error('Erreur:', error);
            toast.error(error?.response?.data?.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setUploadProgress(0);
        }
    };

    const handleCancel = async () => {
        if (!initialData && (formValues.title || sections.length > 0)) {
            const shouldSave = window.confirm('Voulez-vous sauvegarder un brouillon avant de quitter ?');
            if (shouldSave) {
                await saveDraft(draftData, allFiles);
                toast.success('Brouillon sauvegardé');
            }
        }
        onCancel();
    };

    return (
        <>
            {/* Prompt restauration brouillon */}
            {showDraftPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                        <h3 className="text-lg font-semibold mb-2">Brouillon détecté</h3>
                        <p className="text-gray-600 mb-4">
                            Un brouillon de cours a été trouvé. Voulez-vous le restaurer ?
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleRestoreDraft}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Restaurer
                            </button>
                            <button
                                onClick={handleDiscardDraft}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Ignorer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onFormSubmit)} className="space-y-8">
                    {/* Indicateur de sauvegarde */}
                    {!initialData && (isAutoSaving || isSaving) && (
                        <div className="flex items-center justify-end space-x-2 text-sm text-gray-500">
                            <CloudArrowUpIcon className="w-4 h-4 animate-pulse" />
                            <span>Sauvegarde automatique...</span>
                        </div>
                    )}

                    {/* Barre de progression upload */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-900">
                                    Upload en cours...
                                </span>
                                <span className="text-sm font-medium text-blue-900">
                                    {uploadProgress}%
                                </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <BasicInfo
                        register={methods.register}
                        errors={methods.formState.errors}
                        coverPreview={coverPreview}
                        setCoverPreview={setCoverPreview}
                        setMainCoverFile={setMainCoverFile}
                    />

                    {/* Content Type Toggle */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Type de contenu</h3>
                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    value="sections"
                                    checked={contentType === 'sections'}
                                    onChange={(e) => setContentType(e.target.value as 'sections' | 'media')}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">Sections structurées</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    value="media"
                                    checked={contentType === 'media'}
                                    onChange={(e) => setContentType(e.target.value as 'sections' | 'media')}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">Audio/Vidéo direct</span>
                            </label>
                        </div>

                        {/* Media upload (only for media content type) */}
                        {contentType === 'media' && (
                            <div className="border-t pt-4 mt-4">
                                <label htmlFor="courseMedia" className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Audio ou Vidéo
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        id="courseMedia"
                                        type="file"
                                        accept="audio/*,video/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
                                                    setMediaFile(file);
                                                    setMediaPreview(`${file.type.split('/')[0]}: ${file.name}`);
                                                } else {
                                                    toast.error('Veuillez sélectionner un fichier audio ou vidéo');
                                                }
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                    {mediaPreview && (
                                        <div className="flex-1 text-sm text-gray-600 truncate">
                                            {mediaPreview}
                                        </div>
                                    )}
                                </div>
                                {!mediaFile && <p className="text-xs text-red-600 mt-1">Un fichier audio ou vidéo est requis</p>}
                            </div>
                        )}
                    </div>

                    {/* Sections (only for sections content type) */}
                    {contentType === 'sections' && (
                        <Sections
                            sections={sections}
                            setSections={setSections}
                            sectionCoverPreviews={sectionCoverPreviews}
                            setSectionCoverPreviews={setSectionCoverPreviews}
                            sectionCoverFiles={sectionCoverFiles}
                            setSectionCoverFiles={setSectionCoverFiles}
                        />
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || uploadProgress > 0}
                        >
                            {isSubmitting ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Créer le cours'}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};

export default CourseForm;