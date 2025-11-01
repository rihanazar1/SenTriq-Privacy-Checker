import { useState } from 'react'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import Particles from '../../components/Particles'
import AppTrackerForm from './AppTrackerForm'
import AppTrackerList from './AppTrackerList'
import { useGetUserAppsQuery, useDeleteAppMutation, useUpdateAppMutation} from '../../store/api/appsApi'
import type { App } from '../../store/api/appsApi'
import type { UpdateAppRequest } from '../../store/api/appsApi'
import { toast } from 'react-hot-toast'

const AppTrackerPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<App | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'Low' | 'Medium' | 'High' | 'Critical'>('ALL')

  // API hooks
  const { data: appsData, isLoading, error, refetch } = useGetUserAppsQuery({
    search: searchTerm || undefined,
    riskLevel: riskFilter !== 'ALL' ? riskFilter : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const [deleteApp] = useDeleteAppMutation()
  const [updateApp] = useUpdateAppMutation()
  // const [checkAppRisk] = useCheckAppRiskMutation()

  const handleAddApp = () => {
    setEditingApp(null)
    setIsFormOpen(true)
  }

  const handleEditApp = (app: App) => {
    setEditingApp(app)
    setIsFormOpen(true)
  }

  const handleDeleteApp = async (appId: string, appName: string) => {
    if (window.confirm(`Are you sure you want to delete "${appName}"?`)) {
      try {
        await deleteApp(appId).unwrap()
        toast.success('App deleted successfully')
        refetch()
      } catch (error) {
        toast.error('Failed to delete app')
        console.error('Delete error:', error)
      }
    }
  }

  const handleUpdateApp = async (appId: string, updateData: UpdateAppRequest) => {
    console.log(updateData)
    try {
      await updateApp({ id: appId, ...updateData }).unwrap()
      toast.success('App updated successfully')
      setIsFormOpen(false)
      setEditingApp(null)
      refetch()
    } catch (error) {
      toast.error('Failed to update app')
      console.error('Update error:', error)
    }
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingApp) {
        // Update existing app
        await handleUpdateApp(editingApp._id, formData)
      } else {
        // Add new app
        // const result = await checkAppRisk({ ...formData, save: true }).unwrap()
        toast.success('App added successfully')
        setIsFormOpen(false)
        refetch()
      }
    } catch (error) {
      toast.error(editingApp ? 'Failed to update app' : 'Failed to add app')
      console.error('Form submit error:', error)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#0A191F] text-white relative overflow-hidden">
        {/* Hero Section Container for Particles and Content */}
        <div className="relative mt-20 min-h-[70vh] pb-10">
          <Navbar />

          {/* Particles Background - Now limited to the Hero section */}
          <div className="absolute inset-0 z-0">
            <Particles
              particleCount={250}
              particleSpread={10}
              speed={0.7}
              particleSize={30}
              particleColor="#00ffcc"
              moveParticlesOnHover={true}
              disableRotation={true}
            />
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 h-80">
              <div className='absolute inset-0 bg-gradient-to-t from-[#146536] to-transparent'></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-20 container mx-auto px-4 pt-10 ">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#A3E635] to-[#A3E635] bg-clip-text text-transparent">
                App Tracker
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Monitor and manage your app security risks
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A3E635]"
                />
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as any)}
                  className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                >
                  <option value="ALL">All Risk Levels</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <button
                onClick={handleAddApp}
                className="px-6 py-2 bg-gradient-to-r from-[#A3E635] to-[#A3E635] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                Add App
              </button>
            </div>

            {/* App List */}
            <AppTrackerList
              apps={appsData?.data.apps || []}
              isLoading={isLoading}
              error={error}
              onEdit={handleEditApp}
              onDelete={handleDeleteApp}
            />
          </div>
        </div>

        <div className="absolute left-0 right-0 h-64">
          <div className='absolute inset-0 bg-gradient-to-b from-[#146536] to-transparent'></div>
        </div>
      <Footer />

      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <AppTrackerForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingApp(null)
          }}
          onSubmit={handleFormSubmit}
          editingApp={editingApp}
        />
      )}

    </>
  )
}

export default AppTrackerPage