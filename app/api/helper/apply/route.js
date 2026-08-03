import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Check if registration is open
    const statusSetting = await prisma.setting.findUnique({
      where: { key: 'isHelperRegistrationOpen' }
    });

    if (!statusSetting || statusSetting.value !== 'true') {
      return NextResponse.json({ error: 'Pendaftaran Helper sedang ditutup.' }, { status: 400 });
    }

    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['platform', 'nickname', 'whatsapp', 'discord', 'discovery', 'previousServer', 'skills', 'reason'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Field ${field} is required` }, { status: 400 });
      }
    }

    // Save to database
    const application = await prisma.helperApplication.create({
      data: {
        platform: data.platform,
        nickname: data.nickname,
        whatsapp: data.whatsapp,
        discord: data.discord,
        discovery: data.discovery,
        previousServer: data.previousServer,
        skills: data.skills,
        reason: data.reason
      }
    });

    return NextResponse.json({ success: true, application }, { status: 201 });

  } catch (error) {
    console.error('Error in /api/helper/apply:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
