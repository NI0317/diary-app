import { useState, useEffect } from 'react';

interface DiaryFormProps {
  onSubmit: (data: DiaryFormData) => void;
  initialData?: DiaryFormData;
  disabled?: boolean;
}

export interface DiaryFormData {
  _id?: string;
  date: string;
  mood: number;
  learned: string;
  improvements: string;
  gratitude: string[];
  lookingForward: string;
  news: string;
}

export default function DiaryForm({ onSubmit, initialData, disabled = false }: DiaryFormProps) {
  const [formData, setFormData] = useState<DiaryFormData>({
    date: new Date().toISOString().split('T')[0],
    mood: 5,
    learned: '',
    improvements: '',
    gratitude: ['', '', ''],
    lookingForward: '',
    news: ''
  });

  useEffect(() => {
    if (initialData) {
      console.log('初始化表单数据:', {
        initialData,
        timestamp: new Date().toISOString()
      });
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    console.log('表单验证:', {
      fields: Object.keys(formData),
      validationStatus: {
        date: !!formData.date,
        mood: formData.mood >= 1 && formData.mood <= 10,
        learned: !!formData.learned?.trim(),
        improvements: !!formData.improvements?.trim(),
        gratitude: formData.gratitude?.some(item => item.trim()),
        lookingForward: !!formData.lookingForward?.trim(),
        news: !!formData.news?.trim()
      },
      timestamp: new Date().toISOString()
    });

    // 验证表单数据
    if (!formData.learned.trim()) {
      console.error('表单验证失败: 缺少学习内容');
      alert('请输入今天学到了什么');
      return;
    }
    if (!formData.improvements.trim()) {
      console.error('表单验证失败: 缺少改进内容');
      alert('请输入需要改进的地方');
      return;
    }
    if (!formData.gratitude.some(item => item.trim())) {
      console.error('表单验证失败: 缺少感恩事项');
      alert('请至少输入一件感恩的事');
      return;
    }
    if (!formData.lookingForward.trim()) {
      console.error('表单验证失败: 缺少期待事项');
      alert('请输入明天期待的事');
      return;
    }
    if (!formData.news.trim()) {
      console.error('表单验证失败: 缺少新闻内容');
      alert('请输入今日新闻');
      return;
    }

    // 过滤掉空的感恩事项
    const filteredGratitude = formData.gratitude.filter(item => item.trim());
    console.log('表单提交:', {
      formData: {
        ...formData,
        gratitude: filteredGratitude
      },
      timestamp: new Date().toISOString()
    });
    
    onSubmit({
      ...formData,
      gratitude: filteredGratitude
    });
  };

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitude = [...formData.gratitude];
    newGratitude[index] = value;
    setFormData({ ...formData, gratitude: newGratitude });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">日期</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">心情指数 (1-10)</label>
        <input
          type="number"
          min="1"
          max="10"
          value={formData.mood}
          onChange={(e) => setFormData({ ...formData, mood: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">今天学到了什么</label>
        <textarea
          value={formData.learned}
          onChange={(e) => setFormData({ ...formData, learned: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          required
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">需要改进的地方</label>
        <textarea
          value={formData.improvements}
          onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          required
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">感恩的事</label>
        {formData.gratitude.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item}
            onChange={(e) => handleGratitudeChange(index, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder={`感恩的事 ${index + 1}`}
            disabled={disabled}
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">明天期待的事</label>
        <textarea
          value={formData.lookingForward}
          onChange={(e) => setFormData({ ...formData, lookingForward: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          required
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">今日新闻</label>
        <textarea
          value={formData.news}
          onChange={(e) => setFormData({ ...formData, news: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          required
          disabled={disabled}
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          {initialData ? '更新日记' : '创建日记'}
        </button>
      </div>
    </form>
  );
} 