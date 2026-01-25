'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, type CreateNoteData } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [formData, setFormData] = useState<CreateNoteData>(draft);
  const [errors, setErrors] = useState<Partial<CreateNoteData>>({});

  useEffect(() => {
    setFormData(draft);
  }, [draft]);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
    onError: error => {
      console.error('Error creating note:', error);
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };

    setFormData(updatedData);
    setDraft(updatedData);

    if (errors[name as keyof CreateNoteData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<CreateNoteData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title is too short';
    } else if (formData.title.length > 50) {
      newErrors.title = 'Title is too long';
    }

    if (formData.content.length > 500) {
      newErrors.content = 'Content must be at most 500 symbols';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      createMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={css.input}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={8}
          className={css.textarea}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={formData.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
