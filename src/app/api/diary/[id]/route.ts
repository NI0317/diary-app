import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import DiaryEntry from '@/lib/models/DiaryEntry';

export async function PUT(
  request: NextRequest,
  { params }
) {
  try {
    await dbConnect();
    const data = await request.json();
    const entry = await DiaryEntry.findByIdAndUpdate(params.id, data, {
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

export async function DELETE(
  request: NextRequest,
  { params }
) {
  try {
    await dbConnect();
    const entry = await DiaryEntry.findByIdAndDelete(params.id);
    if (!entry) {
      return NextResponse.json({ error: '日记不存在' }, { status: 404 });
    }
    return NextResponse.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除日记失败:', err);
    return NextResponse.json({ error: '删除日记失败' }, { status: 500 });
  }
} 