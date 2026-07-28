'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function markAsReadAction(id) {
  if (id) {
    await prisma.feedback.update({
      where: { id },
      data: { isRead: true }
    });
    revalidatePath('/admin/feedback');
  }
}

export async function deleteFeedbacksAction(ids) {
  if (ids && ids.length > 0) {
    await prisma.feedback.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    revalidatePath('/admin/feedback');
  }
}
