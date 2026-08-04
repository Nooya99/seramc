import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ipMap = new Map(); // Simple in-memory IP tracker

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    
    // Check IP rate limit (prevent multiple submissions from same IP in memory)
    if (ip !== 'unknown' && ipMap.has(ip)) {
      return NextResponse.json({ error: 'Anda sudah pernah mengisi formulir pendaftaran dari perangkat ini.' }, { status: 429 });
    }

    // Check if registration is open
    const statusSetting = await prisma.setting.findUnique({
      where: { key: 'isHelperRegistrationOpen' }
    });

    if (!statusSetting || statusSetting.value !== 'true') {
      return NextResponse.json({ error: 'Pendaftaran Helper sedang ditutup.' }, { status: 400 });
    }

    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['platform', 'nickname', 'whatsapp', 'discord', 'age', 'discovery', 'previousServer', 'skills', 'reason'];
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === '') {
        return NextResponse.json({ error: `Field ${field} is required` }, { status: 400 });
      }
    }
    
    if (data.interview !== true) {
      return NextResponse.json({ error: `Anda harus bersedia di interview` }, { status: 400 });
    }

    // Check if user has already applied in the database
    const existingApplication = await prisma.helperApplication.findFirst({
      where: {
        OR: [
          { nickname: data.nickname },
          { whatsapp: data.whatsapp },
          { discord: data.discord }
        ]
      }
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'Data Anda (Nickname/WhatsApp/Discord) sudah pernah terdaftar sebelumnya.' }, { status: 400 });
    }

    // Save to database
    const application = await prisma.helperApplication.create({
      data: {
        platform: data.platform,
        nickname: data.nickname,
        whatsapp: data.whatsapp,
        discord: data.discord,
        age: parseInt(data.age, 10),
        interview: data.interview,
        discovery: data.discovery,
        previousServer: data.previousServer,
        skills: data.skills,
        reason: data.reason
      }
    });

    // Mark IP as having submitted
    if (ip !== 'unknown') {
      ipMap.set(ip, Date.now());
    }

    return NextResponse.json({ success: true, application }, { status: 201 });

  } catch (error) {
    console.error('Error in /api/helper/apply:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
