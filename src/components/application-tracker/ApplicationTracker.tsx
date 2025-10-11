import React, { useState } from 'react';
import { Card } from '../card/Card';
import { Button } from '../button/Button';
import { 
  Plus, 
  Calendar,
  BuildingOffice,
  CheckCircle,
  Clock,
  XCircle,
  Trophy,
  Eye,
  Pencil,
  Trash
} from '@phosphor-icons/react';

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'accepted';
  applicationDate: string;
  notes: string;
}

interface ApplicationTrackerProps {
  applications: Application[];
  onAddApplication?: () => void;
  onUpdateApplication?: (id: string, updates: Partial<Application>) => void;
  onDeleteApplication?: (id: string) => void;
  className?: string;
}

export function ApplicationTracker({ 
  applications, 
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication,
  className = "" 
}: ApplicationTrackerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Application>>({});

  const statusConfig = {
    applied: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
    screening: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Eye },
    interview: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: Calendar },
    offer: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: Trophy },
    rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
    accepted: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200', icon: CheckCircle }
  };

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      applied: applications.filter(app => app.status === 'applied').length,
      screening: applications.filter(app => app.status === 'screening').length,
      interview: applications.filter(app => app.status === 'interview').length,
      offer: applications.filter(app => app.status === 'offer').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      accepted: applications.filter(app => app.status === 'accepted').length
    };
    return stats;
  };

  const handleEdit = (application: Application) => {
    setEditingId(application.id);
    setEditData(application);
  };

  const handleSaveEdit = () => {
    if (editingId && onUpdateApplication) {
      onUpdateApplication(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = getStatusStats();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Stats */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Application Tracker
          </h2>
          {onAddApplication && (
            <Button
              onClick={onAddApplication}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus size={16} />
              <span>Add Application</span>
            </Button>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.applied}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Applied</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.screening}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Screening</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.interview}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Interview</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.offer}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Offers</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accepted</div>
          </Card>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <BuildingOffice size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
              <p className="text-sm">Start tracking your job applications to stay organized!</p>
              {onAddApplication && (
                <Button
                  onClick={onAddApplication}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Your First Application
                </Button>
              )}
            </div>
          </Card>
        ) : (
          applications.map((application) => {
            const StatusIcon = statusConfig[application.status].icon;
            const isEditing = editingId === application.id;

            return (
              <Card key={application.id} className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={editData.companyName || ''}
                          onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={editData.jobTitle || ''}
                          onChange={(e) => setEditData({ ...editData, jobTitle: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Status
                        </label>
                        <select
                          value={editData.status || application.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value as Application['status'] })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                          <option value="applied">Applied</option>
                          <option value="screening">Screening</option>
                          <option value="interview">Interview</option>
                          <option value="offer">Offer</option>
                          <option value="rejected">Rejected</option>
                          <option value="accepted">Accepted</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Application Date
                        </label>
                        <input
                          type="date"
                          value={editData.applicationDate || application.applicationDate}
                          onChange={(e) => setEditData({ ...editData, applicationDate: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={editData.notes || ''}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        rows={3}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        placeholder="Add notes about this application..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="secondary"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {application.jobTitle}
                          </h3>
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <BuildingOffice size={16} />
                            <span>{application.companyName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[application.status].color}`}>
                          <StatusIcon size={14} />
                          <span className="capitalize">{application.status}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar size={14} />
                          <span>{formatDate(application.applicationDate)}</span>
                        </div>
                      </div>

                      {application.notes && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          {application.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleEdit(application)}
                        variant="tertiary"
                        size="sm"
                      >
                        <Pencil size={14} />
                      </Button>
                      {onDeleteApplication && (
                        <Button
                          onClick={() => onDeleteApplication(application.id)}
                          variant="tertiary"
                          size="sm"
                          className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                        >
                          <Trash size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ApplicationTracker;