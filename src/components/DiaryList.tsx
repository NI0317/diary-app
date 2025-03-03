import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DiaryFormData } from './DiaryForm';

type DiaryEntry = Omit<DiaryFormData, '_id'> & {
  _id: string;
};

interface DiaryListProps {
  entries: DiaryEntry[];
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export default function DiaryList({ entries = [], onEdit, onDelete, disabled = false }: DiaryListProps) {
  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <div key={entry._id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {format(new Date(entry.date), 'yyyy年MM月dd日', { locale: zhCN })}
              </h3>
              <p className="mt-1 text-sm text-gray-500">心情指数: {entry.mood}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(entry)}
                disabled={disabled}
                className={`p-2 ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-500'}`}
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(entry._id)}
                disabled={disabled}
                className={`p-2 ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500'}`}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">学到了什么</h4>
              <p className="mt-1 text-sm text-gray-600">{entry.learned}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">需要改进</h4>
              <p className="mt-1 text-sm text-gray-600">{entry.improvements}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">感恩的事</h4>
              <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                {entry.gratitude.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">明天期待</h4>
              <p className="mt-1 text-sm text-gray-600">{entry.lookingForward}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">今日新闻</h4>
              <p className="mt-1 text-sm text-gray-600">{entry.news}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 