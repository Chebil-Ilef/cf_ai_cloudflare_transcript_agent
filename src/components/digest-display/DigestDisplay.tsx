import {
  FileText,
  CheckCircle,
  Clock,
  Tag,
  Users
} from "@phosphor-icons/react";

interface DigestDisplayProps {
  digest: {
    dateISO: string;
    teamId: string;
    summaries: Array<{
      meetingId: string;
      title: string;
      bullets: string[];
      topics?: string[];
    }>;
    actions: Array<{
      owner: string;
      task: string;
      due?: string;
      confidence?: number;
    }>;
    approved: boolean;
    sent: boolean;
    createdAt: number;
    updatedAt: number;
  };
  onApprove?: () => void;
  onSend?: () => void;
}

export function DigestDisplay({
  digest,
  onApprove,
  onSend
}: DigestDisplayProps) {
  const { dateISO, teamId, summaries, actions, approved, sent } = digest;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileText
              size={20}
              className="text-green-600 dark:text-green-400"
            />
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              Daily Digest
            </h3>
          </div>
          <div className="flex items-center space-x-4">
            {approved && (
              <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <CheckCircle size={16} />
                <span className="text-sm">Approved</span>
              </span>
            )}
            {sent && (
              <span className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                <CheckCircle size={16} />
                <span className="text-sm">Sent</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Date:
            </span>
            <span className="text-green-600 dark:text-green-400 font-semibold ml-1">
              {dateISO}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Team:
            </span>
            <span className="text-gray-900 dark:text-gray-100 ml-1">
              {teamId}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Meetings:
            </span>
            <span className="text-gray-900 dark:text-gray-100 ml-1">
              {summaries.length}
            </span>
          </div>
        </div>
      </div>

      {/* Meeting Summaries */}
      {summaries.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <FileText size={18} />
            <span>Meeting Summaries</span>
          </h4>

          {summaries.map((summary, index) => (
            <div
              key={`meeting-${summary.meetingId}-${index}`}
              className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900 dark:text-gray-100">
                  {summary.title}
                </h5>
                {summary.topics && summary.topics.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Tag size={14} className="text-gray-500" />
                    <div className="flex space-x-1">
                      {summary.topics.map((topic) => (
                        <span
                          key={`topic-${topic}`}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {summary.bullets.map((bullet, bulletIndex) => (
                  <li
                    key={`bullet-${bullet.substring(0, 20)}-${bulletIndex}`}
                    className="flex items-start space-x-2"
                  >
                    <span className="text-green-600 dark:text-green-400 mt-1">
                      •
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Action Items */}
      {actions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Clock size={18} />
            <span>Action Items</span>
          </h4>

          <div className="space-y-3">
            {actions.map((action, index) => (
              <div
                key={`action-${action.owner}-${action.task.substring(0, 20)}-${index}`}
                className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users
                        size={14}
                        className="text-orange-600 dark:text-orange-400"
                      />
                      <span className="font-medium text-orange-800 dark:text-orange-200">
                        {action.owner}
                      </span>
                      {action.confidence && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({Math.round(action.confidence * 100)}% confidence)
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {action.task}
                    </p>
                  </div>
                  {action.due && (
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      Due: {action.due}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {!approved && onApprove && (
          <button
            type="button"
            onClick={onApprove}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <CheckCircle size={16} />
            <span>Approve Digest</span>
          </button>
        )}

        {approved && !sent && onSend && (
          <button
            type="button"
            onClick={onSend}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <FileText size={16} />
            <span>Send Digest</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default DigestDisplay;
