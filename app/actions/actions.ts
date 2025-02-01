'use server';

import prisma from '@/lib/prisma';
import { Invoice, Post } from '@/type';
import { Prisma } from '@prisma/client';

import { randomBytes } from 'crypto';

export async function checkAndAddUser(email: string, name: string) {
  if (!email) return;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser && name) {
      await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
}

const generateUniqueId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = randomBytes(3).toString('hex');
    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        id: uniqueId,
      },
    });
    if (!existingInvoice) {
      isUnique = true;
    }
  }
  return uniqueId;
};

export async function createEmptyInvoice(email: string, name: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const invoiceId = (await generateUniqueId()) as string;

    if (user) {
      const newInvoice = await prisma.invoice.create({
        data: {
          id: invoiceId,
          name: name,
          userId: user?.id,
          issuerName: '',
          issuerAddress: '',
          clientName: '',
          clientAddress: '',
          invoiceDate: '',
          dueDate: '',
          vatActive: false,
          vatRate: 20,
        },
      });
      return newInvoice;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getInvoicesByEmail(email: string) {
  if (!email) return;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        invoices: {
          include: {
            lines: true,
          },
        },
      },
    });
    // Statuts possibles :
    // 1: Brouillon
    // 2: En attente
    // 3: Payée
    // 4: Annulée
    // 5: Impayé
    if (user) {
      const today = new Date();
      const updatedInvoices = await Promise.all(
        user.invoices.map(async invoice => {
          const dueDate = new Date(invoice.dueDate);
          if (dueDate < today && invoice.status == 2) {
            const updatedInvoice = await prisma.invoice.update({
              where: { id: invoice.id },
              data: { status: 5 },
              include: { lines: true },
            });
            return updatedInvoice;
          }
          return invoice;
        }),
      );
      return updatedInvoices;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getInvoiceById(invoiceId: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        lines: true,
      },
    });
    if (!invoice) {
      throw new Error('Facture non trouvée.');
    }
    return invoice;
  } catch (error) {
    console.error(error);
  }
}

export async function updateInvoice(invoice: Invoice) {
  try {
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: invoice.id },
      include: {
        lines: true,
      },
    });

    if (!existingInvoice) {
      throw new Error(`Facture avec l'ID ${invoice.id} introuvable.`);
    }

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        issuerName: invoice.issuerName,
        issuerAddress: invoice.issuerAddress,
        clientName: invoice.clientName,
        clientAddress: invoice.clientAddress,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        vatActive: invoice.vatActive,
        vatRate: invoice.vatRate,
        status: invoice.status,
      },
    });

    const existingLines = existingInvoice.lines;

    const receivedLines = invoice.lines;

    const linesToDelete = existingLines.filter(
      existingLine => !receivedLines.some(line => line.id === existingLine.id),
    );

    if (linesToDelete.length > 0) {
      await prisma.invoiceLine.deleteMany({
        where: {
          id: { in: linesToDelete.map(line => line.id) },
        },
      });
    }

    for (const line of receivedLines) {
      const existingLine = existingLines.find(l => l.id == line.id);
      if (existingLine) {
        const hasChanged =
          line.description !== existingLine.description ||
          line.quantity !== existingLine.quantity ||
          line.unitPrice !== existingLine.unitPrice;

        if (hasChanged) {
          await prisma.invoiceLine.update({
            where: { id: line.id },
            data: {
              description: line.description,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
            },
          });
        }
      } else {
        //créer une nouvelle ligne
        await prisma.invoiceLine.create({
          data: {
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            invoiceId: invoice.id,
          },
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteInvoice(invoiceId: string) {
  try {
    const deleteInvoice = await prisma.invoice.delete({
      where: { id: invoiceId },
    });
    if (!deleteInvoice) {
      throw new Error('Erreur lors de la suppression de la facture.');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        tags: true,
        auteur: true,
      },
    });
    return posts;
  } catch (error) {
    console.error(error);
  }
}
export async function getPostById(postId: number) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: true,
        auteur: true,
      },
    });
    if (!post) {
      throw new Error('Post non trouvé.');
    }
    return post;
  } catch (error) {
    console.error(error);
  }
}
export async function createPost(post: Post) {
  try {
    const newPost = await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        auteur: { connect: { id: post.userId } },
        tags: {
          connect: post.tags.map((tag) => ({ id: tag.id })),
        },
      },
    });
    return newPost;
  } catch (error) {
    console.error(error);
  }
}
export async function updatePost(postId: number, post: Post) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: post.title,
        content: post.content,
        auteur: { connect: { id: post.userId } },
        tags: {
          set: post.tags.map((tag) => ({ id: tag.id })),
        },
      },
    });
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}
export async function deletePost(postId: number) {
  try {
    const deletedPost = await prisma.post.delete({
      where: { id: postId },
    });
    return deletedPost;
  } catch (error) {
    console.error(error);
  }
}
export async function getPostsByTag(tagId: number) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            id: Number(tagId),
          },
        },
      },
      include: {
        tags: true,
        auteur: true,
      },
    });
    return posts;
  } catch (error) {
    console.error(error);
  }
}
export async function getPostsByAuteur(auteurId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        auteur: { id: auteurId }
      },
      include: {
        tags: true,
        auteur: true,
      },
    });
    return posts;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostTags(postId: number) {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        posts: {
          some: {
            id: postId,
          },
        },
      },
    });
    return tags;
  } catch (error) {
    console.error(error);
  }
}

export async function getTagPosts(tagId: number) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            id: tagId,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error(error);
  }
}


export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error(error);
  }
}
export async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error(error);
  }
}
export async function createUser(data: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.create({
      data,
    });
    return user;
  } catch (error) {
    console.error(error);
  }
}
export async function updateUser(userId: string, data: Prisma.UserUpdateInput) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });
    return updatedUser;
  } catch (error) {
    console.error(error);
  }
}
export async function deleteUser(userId: string) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return deletedUser;
  } catch (error) {
    console.error(error);
  }
}

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany();
    return tags;
  } catch (error) {
    console.error(error);
  }
}
export async function getTag(tagId: number) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: Number(tagId) },
    });
    return tag;
  } catch (error) {
    console.error(error);
  }
}
export async function createTag(categoryTitle: string, categoryDescription: string, data: Prisma.TagCreateInput) {
  try {
    const tag = await prisma.tag.create({
      data,
    });
    return tag;
  } catch (error) {
    console.error(error);
  }
}
export async function updateTag(tagId: number, data: Prisma.TagUpdateInput) {
  try {
    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data,
    });
    return updatedTag;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteTag(tagId: number) {
  try {
    const deletedTag = await prisma.tag.delete({
      where: { id: tagId },
    });
    return deletedTag;
  } catch (error) {
    console.error(error);
  }
}

export async function getTodos() {
  try {
    const todos = await prisma.todo.findMany();
    return todos;
  } catch (error) {
    console.error(error);
  }
}
export async function getTodo(todoId: number) {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: Number(todoId) },
    });
    return todo;
  } catch (error) {
    console.error(error);
  }
}
export async function createTodo(title: string, owner: string, data: Prisma.TodoCreateInput) {
  try {
    const todo = await prisma.todo.create({
      data,
    });
    return todo;
  } catch (error) {
    console.error(error);
  }
}
export async function updateTodo(todoId: number, data: Prisma.TodoUpdateInput) {
  try {
    const updatedTodo = await prisma.todo.update({
      where: { id: Number(todoId) },
      data,
    });
    return updatedTodo;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteTodo(todoId: number) {
  try {
    const deletedTag = await prisma.tag.delete({
      where: { id: todoId },
    });
    return deletedTag;
  } catch (error) {
    console.error(error);
  }
}
