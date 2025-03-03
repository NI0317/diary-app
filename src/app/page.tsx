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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 添加自动刷新功能
  useEffect(() => {
    const startTime = performance.now();
    fetchEntries().finally(() => {
      const endTime = performance.now();
      console.log('页面加载性能:', {
        loadTime: endTime - startTime,
        entriesCount: entries.length,
        timestamp: new Date().toISOString()
      });
    });

    // 每5分钟自动刷新一次
    const interval = setInterval(fetchEntries, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchEntries = async () => {
    try {
      setError(null);
      console.log('开始获取日记列表:', {
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
      });
      
      const response = await fetch('/api/diary');
      if (!response.ok) {
        const errorData = await response.json();
        console.error('获取日记失败:', {
          status: response.status,
          error: errorData,
          timestamp: new Date().toISOString()
        });
        throw new Error(errorData.details || '获取日记失败');
      }
      
      const data = await response.json();
      console.log('获取日记成功:', {
        count: Array.isArray(data) ? data.length : 0,
        timestamp: new Date().toISOString()
      });
      
      // 确保数据格式正确
      const validEntries = Array.isArray(data) ? data.filter(entry => {
        const isValid = entry && 
          typeof entry.date === 'string' &&
          typeof entry.mood === 'number' &&
          entry.mood >= 1 && entry.mood <= 10 &&
          Array.isArray(entry.gratitude);
        
        if (!isValid) {
          console.error('无效的日记条目:', {
            entry,
            timestamp: new Date().toISOString()
          });
        }
        return isValid;
      }) : [];
      
      setEntries(validEntries);
    } catch (err: unknown) {
      console.error('获取日记列表失败:', {
        error: err,
        message: err instanceof Error ? err.message : '未知错误',
        timestamp: new Date().toISOString()
      });
      setError('获取日记列表失败');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: DiaryFormData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log('开始保存日记:', {
        formData,
        timestamp: new Date().toISOString(),
        currentEntriesCount: entries.length
      });

      const url = formData._id ? '/api/diary' : '/api/diary';
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
        console.error('保存日记失败:', {
          status: response.status,
          error: errorData,
          formData,
          timestamp: new Date().toISOString()
        });
        throw new Error(errorData.details || '保存失败');
      }

      const savedEntry = await response.json();
      console.log('保存日记成功:', {
        entry: savedEntry,
        timestamp: new Date().toISOString(),
        currentEntriesCount: entries.length
      });

      // 更新本地状态
      setEntries(prev => {
        const newEntries = formData._id
          ? prev.map(entry => entry._id === formData._id ? savedEntry : entry)
          : [savedEntry, ...prev];
        
        console.log('本地状态更新:', {
          oldCount: prev.length,
          newCount: newEntries.length,
          timestamp: new Date().toISOString()
        });
        
        return newEntries;
      });
      
      setEditingEntry(null);
      setSuccess('日记保存成功');
      
      // 重新获取数据以确保同步
      await fetchEntries();
    } catch (err) {
      console.error('保存失败:', {
        error: err,
        message: err instanceof Error ? err.message : '未知错误',
        formData,
        timestamp: new Date().toISOString()
      });
      setError('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
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
      console.log('开始删除日记:', {
        id,
        timestamp: new Date().toISOString()
      });

      const response = await fetch(`/api/diary?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('删除日记失败:', {
          status: response.status,
          error: errorData,
          id,
          timestamp: new Date().toISOString()
        });
        throw new Error(errorData.details || '删除失败');
      }

      console.log('删除日记成功:', {
        id,
        timestamp: new Date().toISOString()
      });

      // 更新本地状态
      setEntries(prev => prev.filter(entry => entry._id !== id));
      setSuccess('日记删除成功');
      
      // 重新获取数据以确保同步
      await fetchEntries();
    } catch (err) {
      console.error('删除失败:', {
        error: err,
        message: err instanceof Error ? err.message : '未知错误',
        id,
        timestamp: new Date().toISOString()
      });
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
