
import type { App } from '../../store/api/appsApi'

interface AppTrackerListProps {
  apps: App[]
  isLoading: boolean
  error: any
  onEdit: (app: App) => void
  onDelete: (appId: string, appName: string) => void
}

const AppTrackerList = ({ apps, isLoading, error, onEdit, onDelete }: AppTrackerListProps) => {
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'text-green-300 bg-green-900/30 border border-green-700'
      case 'Medium':
        return 'text-yellow-300 bg-yellow-900/30 border border-yellow-700'
      case 'High':
        return 'text-red-300 bg-red-900/30 border border-red-700'
      case 'Critical':
        return 'text-gray-300 bg-red-800/20 border border-red-700'
      default:
        return 'text-gray-300 bg-gray-800/30 border border-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A3E635] mx-auto"></div>
        <p className="mt-4 text-gray-300">Loading apps...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm rounded-lg p-8 text-center">
        <p className="text-red-400">Error loading apps. Please try again.</p>
      </div>
    )
  }

  if (!apps || apps.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 h-80 flex justify-center items-center">
        <p className="text-gray-300">No apps found. Add your first app to get started!</p>
      </div>
    )
  }

  return (
    <div className=" bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden h-80">
      {/* Header */}
      {/* <div className="bg-gray-700/50 px-6 py-4 border-b border-gray-600">
        <h2 className="text-xl font-semibold text-[#A3E635]">App Information</h2>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/30 text-white h-20 border-b-1 border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                App Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                User Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                User Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Risk Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600 cursor-pointer">
            {apps.map((app) => (
              <tr key={app._id} className="hover:bg-gray-600/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{app.appName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {app.url ? (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A3E635] hover:underline"
                      >
                        {app.url.length > 30 ? `${app.url.substring(0, 30)}...` : app.url}
                      </a>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {app.userEmail || <span className="text-gray-500">-</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {app.userPhoneNumber || <span className="text-gray-500">-</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {app.riskScore}/100
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(app.riskLevel)}`}>
                    {app.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(app)}
                      className="text-[#A3E635] hover:text-[#A3E635]/80 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(app._id, app.appName)}
                      className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AppTrackerList