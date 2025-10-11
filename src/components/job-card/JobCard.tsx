import React from 'react';
import { Card } from '../card/Card';
import { Button } from '../button/Button';
import { 
  MapPin, 
  CurrencyDollar, 
  Clock, 
  Star, 
  BuildingOffice2,
  CheckCircle
} from '@phosphor-icons/react';

export interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  remote: boolean;
  description: string;
  requirements: string[];
  matchScore: number;
  postedDate: string;
  applicationUrl: string;
}

interface JobCardProps {
  job: JobData;
  onApply?: (job: JobData) => void;
  onSaveJob?: (job: JobData) => void;
  className?: string;
}

export function JobCard({ job, onApply, onSaveJob, className = "" }: JobCardProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {job.title}
            </h3>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <BuildingOffice2 size={16} />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
            <div className="flex items-center space-x-1">
              <Star size={14} />
              <span>{job.matchScore}% match</span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <MapPin size={16} />
            <span>{job.location}</span>
            {job.remote && (
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                Remote
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <CurrencyDollar size={16} />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{formatPostedDate(job.postedDate)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
          {job.description}
        </p>

        {/* Requirements */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Key Requirements:
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 5).map((req, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 5 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                +{job.requirements.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => onApply?.(job)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <CheckCircle size={16} className="mr-2" />
            Apply Now
          </Button>
          <Button
            onClick={() => onSaveJob?.(job)}
            variant="outline"
            className="px-4"
          >
            Save Job
          </Button>
          <Button
            onClick={() => window.open(job.applicationUrl, '_blank')}
            variant="outline"
            className="px-4"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default JobCard;