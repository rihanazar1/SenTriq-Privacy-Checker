import { useState, useEffect } from 'react'
import { useGetSampleDataQuery, useGenerateFakeDataMutation } from '../../store/api/fakeDataApi'
import { toast } from 'react-hot-toast'
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"
import Particles from "../../components/Particles"

// Custom scrollbar styles
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

interface FieldSelection {
  [key: string]: boolean
}

const FakeDataGenerator = () => {
  const [selectedFields, setSelectedFields] = useState<FieldSelection>({})
  const [recordCount, setRecordCount] = useState(10)
  const [generatedData, setGeneratedData] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Get sample data to show available fields
  const { data: sampleData, isLoading: isSampleLoading } = useGetSampleDataQuery()
  const [generateFakeData] = useGenerateFakeDataMutation()

  // Initialize field selections when sample data loads
  useEffect(() => {
    if (sampleData?.data) {
      const initialSelection: FieldSelection = {}
      Object.keys(sampleData.data).forEach(field => {
        initialSelection[field] = false
      })
      setSelectedFields(initialSelection)
    }
  }, [sampleData])

  const handleFieldToggle = (fieldName: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  const handleSelectAll = () => {
    if (sampleData?.data) {
      const allSelected: FieldSelection = {}
      Object.keys(sampleData.data).forEach(field => {
        allSelected[field] = true
      })
      setSelectedFields(allSelected)
    }
  }

  const handleDeselectAll = () => {
    if (sampleData?.data) {
      const noneSelected: FieldSelection = {}
      Object.keys(sampleData.data).forEach(field => {
        noneSelected[field] = false
      })
      setSelectedFields(noneSelected)
    }
  }

  const handleGenerate = async () => {
    const selectedFieldNames = Object.keys(selectedFields).filter(field => selectedFields[field])

    if (selectedFieldNames.length === 0) {
      toast.error('Please select at least one field')
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateFakeData({
        fields: selectedFieldNames,
        count: recordCount,
        format: 'json'
      }).unwrap()

      setGeneratedData(result.data)
      toast.success(`Generated ${result.count} records successfully`)
    } catch (error) {
      toast.error('Failed to generate fake data')
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderFieldValue = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      // Handle nested objects like location and address
      if (value.coordinates) {
        // Location object with coordinates
        return `${value.city}, ${value.state}, ${value.country} (${value.coordinates.latitude}, ${value.coordinates.longitude})`
      } else if (value.street) {
        // Address object
        return `${value.street}, ${value.city}, ${value.state} ${value.zipCode}, ${value.country}`
      } else {
        // Other nested objects - flatten them
        return Object.entries(value)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      }
    }
    return String(value)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2))
    toast.success('Data copied to clipboard')
  }

  const downloadAsJson = () => {
    const dataStr = JSON.stringify(generatedData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `fake-data-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (isSampleLoading) {
    return (
      <div className="min-h-screen bg-[#0A191F] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A3E635] mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading available fields...</p>
        </div>
      </div>
    )
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
                Fake Data Generator
              </h1>
              <p className="text-xl text-gray-300">
                Generate realistic fake data for testing and development
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Field Selection */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent">Select Fields</h2>
                  <div className="space-x-2">
                    <button
                      onClick={handleSelectAll}
                      className="px-3 py-1 text-sm bg-[#A3E635]/20 text-[#A3E635] rounded hover:bg-[#A3E635]/30 transition-colors cursor-pointer"
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleDeselectAll}
                      className="px-3 py-1 text-sm bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-colors cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Field Checkboxes */}
                <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {sampleData?.data && Object.entries(sampleData.data).map(([fieldName]) => (
                    <label key={fieldName} className="flex items-start space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFields[fieldName] || false}
                        onChange={() => handleFieldToggle(fieldName)}
                        className="w-4 h-4 mt-1 text-[#A3E635] bg-gray-700 border-gray-600 rounded focus:ring-[#A3E635] focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white group-hover:text-[#A3E635] transition-colors">
                          {fieldName}
                        </div>
                        {/* <div className="text-sm text-gray-400 mt-1">
                          Sample: {renderFieldValue(sampleValue)}
                        </div> */}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Generation Controls */}
                <div className="border-t border-gray-600 pt-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Data You Want to Generate
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={recordCount}
                      onChange={(e) => setRecordCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                    />
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || Object.values(selectedFields).every(v => !v)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#A3E635] via-[#8BC34A] to-[#146536] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#A3E635]/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Data'}
                  </button>
                </div>
              </div>

              {/* Right Panel - Generated Data */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-[#A3E635] to-[#028fa5] bg-clip-text text-transparent">Generated Data</h2>
                  {generatedData.length > 0 && (
                    <div className="space-x-2">
                      <button
                        onClick={copyToClipboard}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        Copy JSON
                      </button>
                      <button
                        onClick={downloadAsJson}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  )}
                </div>

                {generatedData.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No data generated yet</p>
                    <p className="text-sm mt-1">Select fields and click "Generate Data" to start</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {generatedData.map((record, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                        <div className="text-sm font-medium bg-gradient-to-r from-[#A3E635] to-[#146536] bg-clip-text text-transparent mb-2">
                          Data {index + 1}
                        </div>
                        <div className="space-y-2">
                          {Object.entries(record).map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="text-gray-300 font-medium w-32 flex-shrink-0">
                                {key}:
                              </span>
                              <span className="text-white break-all">
                                {renderFieldValue(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      <Footer />
      </div>
    </>
  )
}

export default FakeDataGenerator