import { Card } from '../card/Card';
import { Button } from '../button/Button';
import { 
  Download, 
  Copy, 
  PencilSimple, 
  Check, 
  FileText,
  Eye,
  EyeSlash
} from '@phosphor-icons/react';

interface CoverLetterDisplayProps {
  coverLetterData: {
    coverLetter: string;
    metadata: {
      companyName: string;
      jobTitle: string;
      tone: string;
      generatedAt: string;
      wordCount: number;
    };
  };
  onDownloadPDF?: () => void;
  onCopy?: () => void;
  onEdit?: (newContent: string) => void;
  className?: string;
}

export function CoverLetterDisplay({ 
  coverLetterData, 
  onDownloadPDF, 
  onCopy, 
  onEdit,
  className = "" 
}: CoverLetterDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(coverLetterData.coverLetter);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const { coverLetter, metadata } = coverLetterData;

  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
    } else {
      await navigator.clipboard.writeText(coverLetter);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(editContent);
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with metadata */}
      <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-2 mb-3">
          <FileText size={20} className="text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
            Cover Letter Generated
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Company: </span>
            <span className="text-green-800 dark:text-green-200 font-semibold">{metadata.companyName}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Position: </span>
            <span className="text-gray-900 dark:text-gray-100">{metadata.jobTitle}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Tone: </span>
            <span className="text-gray-900 dark:text-gray-100 capitalize">{metadata.tone}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Word Count: </span>
            <span className="text-gray-900 dark:text-gray-100">{metadata.wordCount}</span>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Generated on {formatDate(metadata.generatedAt)}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setShowPreview(!showPreview)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          {showPreview ? <EyeSlash size={16} /> : <Eye size={16} />}
          <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
        </Button>
        
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <PencilSimple size={16} />
          <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
        </Button>
        
        <Button
          onClick={handleCopy}
          variant="outline"
          className="flex items-center space-x-2"
        >
          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          <span>{copied ? 'Copied!' : 'Copy Text'}</span>
        </Button>
        
        {onDownloadPDF && (
          <Button
            onClick={onDownloadPDF}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </Button>
        )}
      </div>

      {/* Content */}
      {showPreview && (
        <Card className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Edit your cover letter..."
              />
              <div className="flex space-x-3">
                <Button
                  onClick={handleSaveEdit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setEditContent(coverLetter);
                    setIsEditing(false);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                {coverLetter}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Tips */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          💡 Cover Letter Tips
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Customize the letter with specific examples from your experience</li>
          <li>• Research the company culture and incorporate relevant details</li>
          <li>• Keep it concise - aim for 3-4 short paragraphs</li>
          <li>• Proofread carefully before sending</li>
          <li>• Consider downloading as PDF for professional formatting</li>
        </ul>
      </Card>
    </div>
  );
}

export default CoverLetterDisplay;