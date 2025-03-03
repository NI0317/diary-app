'use client';

import { useState, useEffect } from 'react';
import DiaryForm, { DiaryFormData } from '@/components/DiaryForm';
import DiaryList from '@/components/DiaryList';
import MoodChart from '@/components/MoodChart';

// 确保 DiaryEntry 包含所有必需字段
type DiaryEntry = Omit<DiaryFormData, '_id'> & {
  _id: string;
};

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
      console.log('API response:', {
        raw: data,
        formatted: Array.isArray(data) ? data : []
      });
      setEntries(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('获取日记列表失败:', err);
      setError('获取日记列表失败');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: DiaryFormData) => {
    try {
      console.log('Form validation:', {
        title: formData.title.trim(),
        content: formData.content.trim(),
        date: formData.date,
        mood: formData.mood
      });

      const url = formData._id 
        ? '/api/diary'  // 更新日记
        : '/api/diary'; // 创建新日记
      
      const method = formData._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(errorData.details || '保存失败');
      }

      const savedEntry = await response.json();
      console.log('State updates:', {
        entries: entries.length,
        editingEntry: editingEntry?._id,
        savedEntry
      });

      setEntries(prev => {
        if (formData._id) {
          return prev.map(entry => 
            entry._id === formData._id ? savedEntry : entry
          );
        }
        return [savedEntry, ...prev];
      });
      setEditingEntry(null);
      setSuccess('日记保存成功');
    } catch (err) {
      console.error('保存失败:', err);
      setError('保存失败，请重试');
    }
  };

  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条日记吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/diary?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      setEntries(prev => prev.filter(entry => entry._id !== id));
      setSuccess('日记删除成功');
    } catch (err) {
      console.error('删除失败:', err);
      setError('删除失败，请重试');
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
          onSubmit={handleSave}
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
