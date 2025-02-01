import { Invoice as PrismaInvoice } from '@prisma/client';
import { Todo as PrismaTodo } from '@prisma/client';
import { Post as PrismaPost, Tag as PrismaTag, User as PrismaUser } from '@prisma/client';
import { InvoiceLine } from '@prisma/client';

export interface Invoice extends PrismaInvoice {
  lines: InvoiceLine[];
}

export interface Totals {
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
}

export interface Post extends PrismaPost {
  tags: Tag[];
  auteur: PrismaUser;
}

export interface Tag extends PrismaTag {
  posts: Post[];
}

export interface User extends PrismaUser {
  posts: Post[];
  invoices: Invoice[];
} 

export interface Todo extends PrismaTodo {
  user: User;
}
