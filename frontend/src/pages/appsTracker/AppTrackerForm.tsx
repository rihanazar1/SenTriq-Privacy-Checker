
import { useState, useEffect } from 'react'
import type { App } from '../../store/api/appsApi'
import type { AppPermissions } from '../../store/api/appsApi'

interface AppTrackerFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: any) => void
  editingApp?: App | null
}

const AppTrackerForm = ({ isOpen, onClose, onSubmit, editingApp }: AppTrackerFormProps) => {
  const [formData, setFormData] = useState({
    appName: '',
    url: '',
    userEmail: '',
    userPhoneNumber: '',
    permissions: {} as AppPermissions
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const permissionsList = [
    { key: 'paymentInfoAccess', label: 'Payment Info Access' },
    { key: 'healthDataAccess', label: 'Health Data Access' },
    { key: 'smsAccess', label: 'SMS Access' },
    { key: 'callLogsAccess', label: 'Call Logs Access' },
    { key: 'locationAccess', label: 'Location Access' },
    { key: 'cameraMicrophoneAccess', label: 'Camera / Microphone Access' },
    { key: 'storageAccess', label: 'Storage Access' },
    { key: 'cookiesOrTrackers', label: 'Cookies / Trackers' },
    { key: 'deviceIdAccess', label: 'Device ID Access' },
    { key: 'contactsAccess', label: 'Contacts Access' },
    { key: 'networkInfoAccess', label: 'Network Info Access' }
  ]

  useEffect(() => {
    if (editingApp) {
      console.log('Setting form data for editing app:', editingApp)
      console.log('App permissions:', editingApp.permissions)

      setFormData({
        appName: editingApp.appName || '',
        url: editingApp.url || '',
        userEmail: editingApp.userEmail || '',
        userPhoneNumber: editingApp.userPhoneNumber || '',
        permissions: editingApp.permissions || {}
      })
    } else {
      console.log('Setting form data for new app')
      setFormData({
        appName: '',
        url: '',
        userEmail: '',
        userPhoneNumber: '',
        permissions: {}
      })
    }
  }, [editingApp])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePermissionChange = (permissionKey: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionKey]: checked
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-[#A3E635]">
            {editingApp ? 'Edit Your App' : 'Add New App'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                App Name *
              </label>
              <input
                type="text"
                name="appName"
                value={formData.appName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3E635]"
                placeholder="Enter app name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3E635]"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                User Email
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3E635]"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                User Phone Number
              </label>
              <input
                type="tel"
                name="userPhoneNumber"
                value={formData.userPhoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3E635]"
                placeholder="+1234567890"
              />
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">App Permissions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {permissionsList.map((permission) => {
                const isChecked = Boolean(formData.permissions[permission.key])
                // console.log(`${permission.key}: ${formData.permissions[permission.key]} -> ${isChecked}`)

                return (
                  <label key={permission.key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                      className="w-4 h-4 text-[#A3E635] bg-gray-700 border-gray-600 rounded focus:ring-[#A3E635] focus:ring-2 cursor-pointer"
                    />
                    <span className="text-sm text-gray-300">{permission.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.appName.trim()}
              className="px-6 py-2 bg-gradient-to-r from-[#A3E635] to-[#A3E635] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : (editingApp ? 'Update App' : 'Add App')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AppTrackerForm