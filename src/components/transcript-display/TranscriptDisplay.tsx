import { FileText, Users, Tag } from "@phosphor-icons/react";

interface TranscriptDisplayProps {
  transcript: {
    id: string;
    meetingId: string;
    title: string;
    dateISO: string;
    participants?: string[];
    language?: string;
    text: string;
    source?: "zoom" | "meet" | "teams" | "webhook" | "manual";
  };
  onProcess?: (transcript: TranscriptDisplayProps["transcript"]) => void;
}

export function TranscriptDisplay({
  transcript,
  onProcess
}: TranscriptDisplayProps) {
  const { title, dateISO, participants, source, text } = transcript;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-2 mb-3">
          <FileText size={20} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Meeting Transcript
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Title:
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold ml-1">
              {title}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Date:
            </span>
            <span className="text-gray-900 dark:text-gray-100 ml-1">
              {dateISO}
            </span>
          </div>
          {source && (
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Source:
              </span>
              <span className="text-gray-900 dark:text-gray-100 ml-1 capitalize">
                {source}
              </span>
            </div>
          )}
        </div>

        {participants && participants.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center space-x-2 mb-2">
              <Users size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Participants:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => (
                <span
                  key={`participant-${participant}`}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                >
                  {participant}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transcript Content */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <FileText size={16} className="text-gray-600 dark:text-gray-400" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Transcript Content
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({text.length} characters)
          </span>
        </div>

        <div className="max-h-64 overflow-y-auto">
          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
            {text}
          </pre>
        </div>
      </div>

      {/* Action Button */}
      {onProcess && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => onProcess(transcript)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Tag size={16} />
            <span>Process Transcript</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default TranscriptDisplay;
