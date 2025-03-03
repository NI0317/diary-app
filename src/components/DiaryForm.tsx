import { useState, FormEvent } from 'react';

interface DiaryFormProps {
  onSubmit: (data: DiaryFormData) => Promise<void>;
  initialData?: DiaryFormData;
}

export interface DiaryFormData {
  _id?: string;
  title: string;
  content: string;
  mood: number;
  date: string;
  learned: string;
  improvements: string;
  gratitude: string[];
  lookingForward: string;
  news: string;
}

export default function DiaryForm({ onSubmit, initialData }: DiaryFormProps) {
  const [formData, setFormData] = useState<DiaryFormData>(initialData || {
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    mood: 5,
    learned: '',
    improvements: '',
    gratitude: ['', '', ''],
    lookingForward: '',
    news: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // 验证必需字段
    if (!formData.title.trim()) {
      alert('请输入标题');
      return;
    }
    if (!formData.content.trim()) {
      alert('请输入内容');
      return;
    }
    if (!formData.date) {
      alert('请选择日期');
      return;
    }
    if (formData.mood < 1 || formData.mood > 10) {
      alert('心情值必须在1-10之间');
      return;
    }

    await onSubmit(formData);
  };

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitude = [...formData.gratitude];
    newGratitude[index] = value;
    setFormData({ ...formData, gratitude: newGratitude });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          日期
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          今日心情 (1-10)
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.mood}
          onChange={(e) => setFormData({ ...formData, mood: Number(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center">{formData.mood}</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          今天学到了什么？
        </label>
        <textarea
          value={formData.learned}
          onChange={(e) => setFormData({ ...formData, learned: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          有什么需要改进的地方？
        </label>
        <textarea
          value={formData.improvements}
          onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          3件感恩的事
        </label>
        {formData.gratitude.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item}
            onChange={(e) => handleGratitudeChange(index, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder={`感恩事项 ${index + 1}`}
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          明天期待的事情
        </label>
        <textarea
          value={formData.lookingForward}
          onChange={(e) => setFormData({ ...formData, lookingForward: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          今天的新闻
        </label>
        <textarea
          value={formData.news}
          onChange={(e) => setFormData({ ...formData, news: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        保存
      </button>
    </form>
  );
} 