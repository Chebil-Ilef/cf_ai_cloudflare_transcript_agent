import React from 'react';
import { JobCard, type JobData } from '../job-card/JobCard';
import { 
  MagnifyingGlass, 
  ListBullets, 
  ChartBar 
} from '@phosphor-icons/react';

interface JobSearchResultsProps {
  results: {
    totalFound: number;
    searchCriteria: {
      jobTitle: string;
      location: string;
      experience: string;
      skills: string[];
      industry: string;
      salaryRange: string;
      remote: boolean | string;
    };
    jobs: JobData[];
  };
  onApplyToJob?: (job: JobData) => void;
  onSaveJob?: (job: JobData) => void;
  onGenerateCoverLetter?: (job: JobData) => void;
}

export function JobSearchResults({ 
  results, 
  onApplyToJob, 
  onSaveJob, 
  onGenerateCoverLetter 
}: JobSearchResultsProps) {
  const { totalFound, searchCriteria, jobs } = results;

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-2 mb-3">
          <MagnifyingGlass size={20} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Job Search Results
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Total Found: </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{totalFound} jobs</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Role: </span>
            <span className="text-gray-900 dark:text-gray-100">{searchCriteria.jobTitle}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Location: </span>
            <span className="text-gray-900 dark:text-gray-100">{searchCriteria.location}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Experience: </span>
            <span className="text-gray-900 dark:text-gray-100">{searchCriteria.experience}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Remote: </span>
            <span className="text-gray-900 dark:text-gray-100">
              {typeof searchCriteria.remote === 'boolean' 
                ? (searchCriteria.remote ? 'Yes' : 'No') 
                : searchCriteria.remote}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Salary: </span>
            <span className="text-gray-900 dark:text-gray-100">{searchCriteria.salaryRange}</span>
          </div>
        </div>

        {searchCriteria.skills && searchCriteria.skills.length > 0 && (
          <div className="mt-3">
            <span className="font-medium text-gray-700 dark:text-gray-300">Skills: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {searchCriteria.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Match Score Distribution */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <ChartBar size={20} className="text-gray-600 dark:text-gray-400" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Match Score Distribution</h4>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div className="space-y-1">
            <div className="text-green-600 font-semibold">90-100%</div>
            <div className="text-gray-600 dark:text-gray-400">
              {jobs.filter(job => job.matchScore >= 90).length} jobs
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-blue-600 font-semibold">80-89%</div>
            <div className="text-gray-600 dark:text-gray-400">
              {jobs.filter(job => job.matchScore >= 80 && job.matchScore < 90).length} jobs
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-yellow-600 font-semibold">70-79%</div>
            <div className="text-gray-600 dark:text-gray-400">
              {jobs.filter(job => job.matchScore >= 70 && job.matchScore < 80).length} jobs
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600 font-semibold">&lt;70%</div>
            <div className="text-gray-600 dark:text-gray-400">
              {jobs.filter(job => job.matchScore < 70).length} jobs
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <ListBullets size={20} className="text-gray-600 dark:text-gray-400" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Top {jobs.length} Matching Jobs
          </h4>
        </div>
        
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <div key={job.id} className="relative">
              <div className="absolute -left-8 top-6 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <JobCard
                job={job}
                onApply={onApplyToJob}
                onSaveJob={onSaveJob}
                className="ml-4"
              />
              {index < jobs.length - 1 && onGenerateCoverLetter && (
                <div className="ml-4 mt-2 mb-2">
                  <button
                    onClick={() => onGenerateCoverLetter(job)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium"
                  >
                    📝 Generate Cover Letter for this position
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-200 rounded text-sm">
            Refine Search
          </button>
          <button className="px-3 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-200 rounded text-sm">
            Save Search
          </button>
          <button className="px-3 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 text-purple-800 dark:text-purple-200 rounded text-sm">
            Set Job Alert
          </button>
          <button className="px-3 py-1 bg-orange-100 hover:bg-orange-200 dark:bg-orange-800 dark:hover:bg-orange-700 text-orange-800 dark:text-orange-200 rounded text-sm">
            Export Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobSearchResults;