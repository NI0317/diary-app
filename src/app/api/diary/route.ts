import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import DiaryEntry from '@/lib/models/DiaryEntry';

export async function GET() {
  try {
    await dbConnect();
    const entries = await DiaryEntry.find().sort({ date: -1 });
    return NextResponse.json(entries);
  } catch (err) {
    console.error('获取日记列表失败:', err);
    return NextResponse.json({ error: '获取日记列表失败' }, { status: 500 });
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