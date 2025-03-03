import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import DiaryEntry from '@/lib/models/DiaryEntry';

const TIMEOUT = 8000; // 8 秒超时

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('操作超时')), timeoutMs);
  });
  return Promise.race([promise, timeout]);
}

export async function GET() {
  try {
    console.log('开始获取日记列表...');
    console.log('环境变量检查:', {
      hasMongoDBUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
    await withTimeout(dbConnect(), TIMEOUT);
    console.log('数据库连接成功，开始查询...');
    
    const entries = await withTimeout(
      DiaryEntry.find().sort({ date: -1 }),
      TIMEOUT
    );
    console.log(`成功获取 ${entries.length} 条日记`);
    return NextResponse.json(entries);
  } catch (err) {
    const errorDetails = {
      error: err,
      message: err instanceof Error ? err.message : '未知错误',
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      env: {
        hasMongoDBUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV
      }
    };
    
    console.error('获取日记列表失败:', errorDetails);
    
    return NextResponse.json({ 
      error: '获取日记列表失败',
      details: err instanceof Error ? err.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const entry = await DiaryEntry.create(data);
    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error('创建日记失败:', err);
    return NextResponse.json({ error: '创建日记失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: '缺少日记ID' }, { status: 400 });
    }

    const entry = await DiaryEntry.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!entry) {
      return NextResponse.json({ error: '日记不存在' }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (err) {
    console.error('更新日记失败:', err);
    return NextResponse.json({ error: '更新日记失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '缺少日记ID' }, { status: 400 });
    }

    const entry = await DiaryEntry.findByIdAndDelete(id);
    if (!entry) {
      return NextResponse.json({ error: '日记不存在' }, { status: 404 });
    }

    return NextResponse.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除日记失败:', err);
    return NextResponse.json({ error: '删除日记失败' }, { status: 500 });
  }
} 