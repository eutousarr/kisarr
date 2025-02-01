'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import confetti from 'canvas-confetti';
import { createTag, getTags } from '@/app/actions/actions';
import { Tag } from '@prisma/client';

export default function TagPage() {
  const { user } = useUser();
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTags();
        if (tags) {
          setTags(tags);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des tags :', error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    setIsNameValid(categoryTitle.length <= 60);
  }, [categoryTitle]);

  const handleCreateCategory = async () => {
    try {
      if (user) {
        createTag(categoryTitle, categoryDescription, { title: categoryTitle, description: categoryDescription });
        window.location.reload();
      } else {
        throw new Error('Utilisateur non connecté');
      }
      confetti();
      setCategoryTitle('');
      setCategoryDescription('');
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie :', error);
    } finally {
    }
  };

  return (
   
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="p-0 text-2xl font-bold md:text-xl lg:text-2xl">
            Catégories
          </h1>
          <div className="flex items-center space-x-2">
            <button
              className="rounded-md bg-blue-500 p-2 text-white"
              onClick={() => {
                const modal = document.getElementById(
                  'my_modal_3',
                ) as HTMLDialogElement;
                if (modal) {
                  modal.showModal();
                }
              }}
            >
              Ajouter
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-around gap-2">
          {tags.map(tag => (
            <div key={tag.id}>
              <Link
                href="/blog/categories/[id]"
                as={`/blog/categories/${tag.id}`}
                className="flex flex-wrap items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 md:max-w-xl md:flex-row dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Image
                  className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                  src="/taureau1.png"
                  alt={tag.title}
                  title={tag.description ?? ''}
                  width={100}
                  height={100}
                />
                <div className="flex w-56 flex-col justify-around p-4 leading-normal">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {tag.title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {tag.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>

            <h3 className="text-lg font-bold">Nouvelle Catégorie</h3>

            <input
              type="text"
              placeholder="Nom de la facture (max 60 caractères)"
              className="input input-bordered my-4 w-full"
              value={categoryTitle}
              onChange={e => setCategoryTitle(e.target.value)}
            />

            {!isNameValid && (
              <p className="mb-4 text-sm">
                Le nom ne peut pas dépasser 60 caractères.
              </p>
            )}
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Description"
              value={categoryDescription}
              onChange={e => setCategoryDescription(e.target.value)}
            ></textarea>
            {!isNameValid && (
              <p className="mb-4 text-sm">
                La description ne peut pas dépasser 60 caractères.
              </p>
            )}

            <button
              className="btn btn-accent"
              disabled={!isNameValid || categoryTitle.length === 0}
              onClick={handleCreateCategory}
            >
              Créer
            </button>
          </div>
        </dialog>
      </div>
  );
}