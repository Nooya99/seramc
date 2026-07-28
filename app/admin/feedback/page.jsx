import { prisma } from '@/lib/prisma';
import FeedbackClient from './FeedbackClient';

export default async function FeedbackPage() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <FeedbackClient initialFeedbacks={feedbacks} />
    </div>
  );
}
