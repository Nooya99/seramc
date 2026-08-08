import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token');
    if (!token || token.value !== 'authenticated') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const applications = await prisma.helperApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const settings = await prisma.setting.findMany({
      where: { 
        key: { 
          in: ['isHelperRegistrationOpen', 'registrationTitle', 'registrationInterviewText', 'registrationRequirements'] 
        } 
      }
    });

    const config = {
      isOpen: false,
      title: 'Helper',
      interviewText: 'Tanggal 7 & 8',
      requirements: [
        'Minimal umur tahun ini 15 tahun',
        'Diutamakan player java / pc',
        'Dewasa secara pikiran',
        'Bersedia mengikuti arahan dari Admin',
        'Tidak menyalahgunakan kekuasaan',
        'Memiliki sikap ramah, sabar, jujur, dan bertanggungjawab',
        'Mampu berkomunikasi dengan baik dengan pemain dan staff',
        'Mampu membantu pemain baru dan menjawab pertanyaan dasar',
        'Mampu menangani konflik dengan tenang dan tidak memihak',
        'Sudah bergabung di server minimal 1 minggu',
        'Tidak memiliki riwayat terkena banned di dalam server',
        'Memahami dan menaati seluruh peraturan server',
        'Memahami konsep permainan minecraft dan server sera mc'
      ].join('\n')
    };

    settings.forEach(s => {
      if (s.key === 'isHelperRegistrationOpen') config.isOpen = s.value === 'true';
      if (s.key === 'registrationTitle') config.title = s.value;
      if (s.key === 'registrationInterviewText') config.interviewText = s.value;
      if (s.key === 'registrationRequirements') config.requirements = s.value;
    });

    return NextResponse.json({ applications, ...config });
  } catch (error) {
    console.error('Error fetching helper applications:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
