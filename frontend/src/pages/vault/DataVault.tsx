import { useState } from 'react'
import {toastService} from '../../utils/toast'
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"
import Particles from "../../components/Particles"


import {
  useCreateVaultEntryMutation,
  useGetVaultEntriesQuery,
  useGetVaultStatsQuery,
  useGetDecryptedEntryMutation,
  useUpdateVaultEntryMutation,
  useDeleteVaultEntryMutation,
  type VaultEntry,
  type DecryptedEntry
} from '../../store/api/vaultApi'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Globe,
  User,
  Key,
  FileText,
  Shield,
  Copy,
  ExternalLink
} from 'lucide-react'

interface VaultFormData {
  applicationName: string
  websiteUrl: string
  username: string
  password: string
  notes: string
  masterPassword: string
}

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #374151;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #A3E635, #146536);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #8BC34A, #0f4a28);
  }
  
  /* Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #A3E635 #374151;
  }
`



const DataVault = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<VaultEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showMasterPasswordModal, setShowMasterPasswordModal] = useState(false)
  const [masterPassword, setMasterPassword] = useState('')
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
  const [decryptedEntries, setDecryptedEntries] = useState<Record<string, DecryptedEntry>>({})
  const [formData, setFormData] = useState<VaultFormData>({
    applicationName: '',
    websiteUrl: '',
    username: '',
    password: '',
    notes: '',
    masterPassword: ''
  })

  // API hooks
  const { data: entriesData, isLoading, refetch } = useGetVaultEntriesQuery({
    search: searchTerm || undefined
  })
  const { data: statsData } = useGetVaultStatsQuery()
  const [createVaultEntry] = useCreateVaultEntryMutation()
  const [getDecryptedEntry] = useGetDecryptedEntryMutation()
  const [updateVaultEntry] = useUpdateVaultEntryMutation()
  const [deleteVaultEntry] = useDeleteVaultEntryMutation()

  const resetForm = () => {
    setFormData({
      applicationName: '',
      websiteUrl: '',
      username: '',
      password: '',
      notes: '',
      masterPassword: ''
    })
    setEditingEntry(null)
  }

  const handleAddEntry = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const handleEditEntry = (entry: VaultEntry) => {
    setEditingEntry(entry)
    setFormData({
      applicationName: entry.applicationName || '',
      websiteUrl: entry.websiteUrl || '',
      username: '',
      password: '',
      notes: '',
      masterPassword: ''
    })
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingEntry) {
        await updateVaultEntry({
          id: editingEntry._id,
          data: {
            applicationName: formData.applicationName,
            websiteUrl: formData.websiteUrl || undefined,
            username: formData.username,
            password: formData.password || undefined,
            notes: formData.notes || undefined,
            masterPassword: formData.masterPassword
          }
        }).unwrap()
        toastService.success('Entry updated successfully')
      } else {
        await createVaultEntry({
          applicationName: formData.applicationName,
          websiteUrl: formData.websiteUrl || undefined,
          username: formData.username,
          password: formData.password,
          notes: formData.notes || undefined,
          masterPassword: formData.masterPassword
        }).unwrap()
        toastService.success('Entry created successfully')
      }

      setIsFormOpen(false)
      resetForm()
      refetch()
    } catch (error: any) {
      toastService.error(error?.data?.error || 'Operation failed')
    }
  }

  const handleDecryptEntry = async (entryId: string) => {
    setSelectedEntryId(entryId)
    setShowMasterPasswordModal(true)
  }

  const handleMasterPasswordSubmit = async () => {
    if (!selectedEntryId || !masterPassword) return

    try {
      const result = await getDecryptedEntry({
        id: selectedEntryId,
        data: { masterPassword }
      }).unwrap()

      setDecryptedEntries(prev => ({
        ...prev,
        [selectedEntryId]: {
          ...result.data,
          _id: result.data.id
        }
      }))

      setShowMasterPasswordModal(false)
      setMasterPassword('')
      setSelectedEntryId(null)
      toastService.success('Entry decrypted successfully')
    } catch (error: any) {
      toastService.error(error?.data?.error || 'Failed to decrypt entry')
    }
  }

  const handleDeleteEntry = async (entryId: string, entryName: string) => {
    const masterPass = prompt(`Enter your master password to delete "${entryName}":`)
    if (!masterPass) return

    try {
      await deleteVaultEntry({
        id: entryId,
        data: { masterPassword: masterPass }
      }).unwrap()
      toastService.success('Entry deleted successfully')
      refetch()
      // Remove from decrypted entries if it was decrypted
      setDecryptedEntries(prev => {
        const newEntries = { ...prev }
        delete newEntries[entryId]
        return newEntries
      })
    } catch (error: any) {
      toastService.error(error?.data?.error || 'Failed to delete entry')
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toastService.success(`${label} copied to clipboard`)
  }

  const isDecrypted = (entryId: string) => {
    return decryptedEntries[entryId] !== undefined
  }

  return (
    <>
      <div className="min-h-screen bg-[#0A191F] text-white relative overflow-hidden">
        <style>{scrollbarStyles}</style>

        {/* Hero Section Container for Particles and Content */}
        <div className="relative mt-20 min-h-[70vh] pb-10">
          <Navbar />

          {/* Particles Background */}
          <div className="absolute inset-0 z-0">
            <Particles
              particleCount={250}
              particleSpread={10}
              speed={0.7}
              particleSize={30}
              particleColor="#A3E635"
              moveParticlesOnHover={true}
              disableRotation={true}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-20 container mx-auto px-4 pt-20">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent">
                Data Vault
              </h1>
              <p className="text-xl text-gray-300">
                Securely store and manage your passwords and sensitive data
              </p>
            </div>

            {/* Stats Cards */}
            {statsData && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-3 rounded-full">
                      <Shield className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent">
                        {statsData.data?.totalEntries || 0}
                      </h3>
                      <p className="text-gray-300">Total Entries</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-[#A3E635] to-[#146536] p-3 rounded-full">
                      <Plus className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent">
                        {statsData.data?.recentEntries || 0}
                      </h3>
                      <p className="text-gray-300">Recent Entries</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              <button
                onClick={handleAddEntry}
                className="px-6 py-2 bg-gradient-to-r from-[#A3E635] via-[#8BC34A] to-[#146536] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#A3E635]/25 transform hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            </div>

            {/* Entries List */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A3E635] mx-auto"></div>
                  <p className="mt-4 text-gray-300">Loading entries...</p>
                </div>
              ) : !entriesData?.data || entriesData.data.length === 0 ? (
                <div className="p-8 text-center">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">No vault entries found</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first entry to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-600 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {entriesData.data.map((entry) => {
                    const decrypted = decryptedEntries[entry._id]
                    const isEntryDecrypted = isDecrypted(entry._id)

                    return (
                      <div key={entry._id} className="p-6 hover:bg-gray-700/30 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white bg-clip-text">
                                {entry.applicationName}
                              </h3>
                              {entry.websiteUrl && (
                                <a
                                  href={entry.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#A3E635] hover:text-[#8BC34A] transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            {entry.websiteUrl && (
                              <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                {entry.websiteUrl}
                              </p>
                            )}

                            {isEntryDecrypted && decrypted && (
                              <div className="mt-4 space-y-2 bg-gray-700/50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-300">Username:</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-mono">{decrypted.username}</span>
                                    <button
                                      onClick={() => copyToClipboard(decrypted.username || '', 'Username')}
                                      className="text-[#A3E635] hover:text-[#8BC34A] transition-colors cursor-pointer"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-300">Password:</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-mono">{'•'.repeat(12)}</span>
                                    <button
                                      onClick={() => copyToClipboard(decrypted.password || '', 'Password')}
                                      className="text-[#A3E635] hover:text-[#8BC34A] transition-colors cursor-pointer"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {decrypted.notes && (
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm text-gray-300">Notes:</span>
                                    </div>
                                    <div className="flex-1 ml-4">
                                      <p className="text-white text-sm">{decrypted.notes}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleDecryptEntry(entry._id)}
                              className={`p-2 rounded-lg transition-colors cursor-pointer ${isEntryDecrypted
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                }`}
                              title={isEntryDecrypted ? 'Decrypted' : 'Decrypt entry'}
                            >
                              {isEntryDecrypted ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => handleEditEntry(entry)}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                              title="Edit entry"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteEntry(entry._id, entry.applicationName)}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                              title="Delete entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />

      </div>

      {/* Add/Edit Entry Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center p-6 border-b border-gray-600">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent">
                {editingEntry ? 'Edit Entry' : 'Add New Entry'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Application/Website Name *
                </label>
                <input
                  type="text"
                  value={formData.applicationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationName: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                  placeholder="e.g., Gmail, Facebook, GitHub"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username/Email *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                  placeholder="username or email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password {editingEntry ? '(leave empty to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required={!editingEntry}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                  placeholder="Additional notes (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Master Password *
                </label>
                <input
                  type="password"
                  value={formData.masterPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, masterPassword: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                  placeholder="Enter your account password"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-600">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#A3E635] via-[#8BC34A] to-[#146536] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#A3E635]/25 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {editingEntry ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Master Password Modal */}
      {showMasterPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent mb-4">
                Enter Master Password
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Enter your account password to decrypt this entry
              </p>
              <input
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMasterPasswordSubmit()}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635] mb-4"
                placeholder="Master password"
                autoFocus
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowMasterPasswordModal(false)
                    setMasterPassword('')
                    setSelectedEntryId(null)
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMasterPasswordSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-[#A3E635] via-[#8BC34A] to-[#146536] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#A3E635]/25 transition-all duration-300 cursor-pointer"
                >
                  Decrypt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default DataVault