import { prisma } from '@/lib/prisma';
import { MessageSquare, Calendar, User, CheckCircle2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

// Next.js server action to mark as read
async function markAsRead(formData) {
  'use server';
  const id = formData.get('id');
  if (id) {
    await prisma.feedback.update({
      where: { id },
      data: { isRead: true }
    });
    revalidatePath('/admin/feedback');
  }
}

export default async function FeedbackPage() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            Kritik & Saran
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Lihat semua masukan dari pemain SERA MC.
          </p>
        </div>
        
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3">
          <div className="text-xs text-slate-400">Total Masukan</div>
          <div className="text-lg font-bold text-cyan-400">{feedbacks.length}</div>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
          <MessageSquare className="w-12 h-12 text-slate-700 mb-4" />
          <p>Belum ada kritik dan saran yang masuk.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feedbacks.map((fb) => (
            <div key={fb.id} className={`bg-[#0b101d] border rounded-2xl p-5 transition-colors group relative overflow-hidden ${fb.isRead ? 'border-slate-800/60 opacity-80' : 'border-cyan-500/40 hover:border-cyan-500'}`}>
              {!fb.isRead && (
                <div className="absolute top-0 right-0 w-1.5 h-full bg-cyan-500"></div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(fb.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
                
                {!fb.isRead && (
                  <form action={markAsRead}>
                    <input type="hidden" name="id" value={fb.id} />
                    <button type="submit" title="Tandai sudah dibaca" className="text-slate-500 hover:text-emerald-400 transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </form>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    {fb.ign ? fb.ign : <span className="text-slate-500 italic">Anonim</span>}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">Pemain</div>
                </div>
              </div>
              
              <div className="bg-[#070b14] rounded-xl p-4 border border-slate-800/50">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {fb.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
