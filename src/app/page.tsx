'use client';

import { useState, useEffect } from 'react';
import DiaryForm, { DiaryFormData } from '@/components/DiaryForm';
import DiaryList from '@/components/DiaryList';
import MoodChart from '@/components/MoodChart';

interface DiaryEntry {
  _id: string;
  title: string;
  content: string;
  mood: number;
  date: string;
}

export default function Home() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setError(null);
      const response = await fetch('/api/diary');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || '获取日记失败');
      }
      const data = await response.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('获取日记列表失败:', err);
      setError('获取日记列表失败');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: DiaryFormData) => {
    try {
      setError(null);
      setSuccess(null);
      
      if (editingEntry) {
        const response = await fetch(`/api/diary/${editingEntry._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || '更新日记失败');
        }
        
        setEditingEntry(null);
        setSuccess('日记更新成功');
        await fetchEntries();
      } else {
        const response = await fetch('/api/diary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || '保存日记失败');
        }
        
        setSuccess('日记保存成功');
        await fetchEntries();
      }
    } catch (err: unknown) {
      console.error('保存日记失败:', err);
      setError('保存日记失败');
    }
  };

  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这条日记吗？')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/diary/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || '删除日记失败');
      }
      
      setSuccess('日记删除成功');
      await fetchEntries();
    } catch (err: unknown) {
      console.error('删除日记失败:', err);
      setError('删除日记失败');
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">加载中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">每日记录</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingEntry ? '编辑日记' : '新建日记'}
        </h2>
        <DiaryForm
          onSubmit={handleSubmit}
          initialData={editingEntry || undefined}
        />
      </div>

      {entries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">心情趋势</h2>
          <MoodChart
            data={entries.map((entry) => ({
              date: entry.date,
              mood: entry.mood,
            }))}
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">历史记录</h2>
        <DiaryList
          entries={entries}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
