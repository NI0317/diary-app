import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DiaryEntry from '@/lib/models/DiaryEntry';

export async function POST(request: Request) {
  try {
    console.log('开始创建新日记...');
    await dbConnect();
    console.log('数据库连接成功');
    
    const data = await request.json();
    console.log('接收到的数据:', JSON.stringify(data, null, 2));
    
    // 验证必需字段
    const requiredFields = ['date', 'mood', 'learned', 'improvements', 'gratitude', 'lookingForward', 'news'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('缺少必需字段:', missingFields);
      return NextResponse.json({ 
        error: '创建日记失败',
        details: `缺少必需字段: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    console.log('开始创建日记条目...');
    const entry = await DiaryEntry.create(data);
    console.log('日记创建成功:', entry);
    
    return NextResponse.json(entry);
  } catch (err: unknown) {
    console.error('创建日记失败:', err);
    return NextResponse.json(
      { error: '创建日记失败' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('开始获取日记列表...');
    await dbConnect();
    console.log('数据库连接成功');
    
    const entries = await DiaryEntry.find().sort({ date: -1 });
    console.log(`成功获取 ${entries.length} 条日记`);
    
    return NextResponse.json(entries);
  } catch (err: unknown) {
    console.error('获取日记列表失败:', err);
    return NextResponse.json(
      { error: '获取日记列表失败' },
      { status: 500 }
    );
  }
} 