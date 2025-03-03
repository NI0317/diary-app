import { useState, useEffect } from 'react';

interface DiaryFormProps {
  onSubmit: (data: DiaryFormData) => void;
  initialData?: DiaryFormData;
}

export interface DiaryFormData {
  title: string;
  date: string;
  mood: number;
  learned: string;
  improvements: string;
  gratitude: string[];
  lookingForward: string;
  news: string;
}

export default function DiaryForm({ onSubmit, initialData }: DiaryFormProps) {
  const [formData, setFormData] = useState<DiaryFormData>({
    title: '',
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
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单数据
    if (!formData.title.trim()) {
      alert('请输入标题');
      return;
    }
    if (!formData.learned.trim()) {
      alert('请输入今天学到了什么');
      return;
    }
    if (!formData.improvements.trim()) {
      alert('请输入需要改进的地方');
      return;
    }
    if (!formData.gratitude.some(item => item.trim())) {
      alert('请至少输入一件感恩的事');
      return;
    }
    if (!formData.lookingForward.trim()) {
      alert('请输入明天期待的事');
      return;
    }
    if (!formData.news.trim()) {
      alert('请输入今日新闻');
      return;
    }

    // 过滤掉空的感恩事项
    const filteredGratitude = formData.gratitude.filter(item => item.trim());
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
        <label className="block text-sm font-medium text-gray-700">标题</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="请输入标题"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">日期</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
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
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? '更新日记' : '创建日记'}
        </button>
      </div>
    </form>
  );
} 