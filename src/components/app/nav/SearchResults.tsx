// src/components/app/nav/SearchResults.tsx
import React from 'react'
import { User, NotepadTextDashed, Play } from 'lucide-react' // Import appropriate icons
import Link from 'next/link' // Add this import (or use the appropriate import for your routing library)

interface SearchResult {
  id: string | number;
  name: string;
  type: 'user' | 'template';
}

interface SearchResultsProps {
  results: SearchResult[]
  onClose: () => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onClose }) => {
  return (
    <div className="absolute top-full left-0 w-full bg-brand-dark border border-gray-800 rounded-md shadow-lg mt-1 z-50">
      {results.map((result) => (
        <Link
          key={result.id}
          href={result.type === 'user' ? `/app/profile/${result.id}` : `/app/workouts/start/${result.id}`}
          className="flex items-center p-2 hover:bg-gray-800 text-brand-light"
          onClick={onClose}
        >
          {result.type === 'user' ? (
            <User className="w-4 h-4 mr-2 text-gray-400" />
          ) : (
            <NotepadTextDashed className="w-4 h-4 mr-2 text-gray-400" />
          )}
          <span>{result.name}</span>
          <span className="ml-auto text-xs text-gray-400">
            {result.type === 'user' ? 'View Profile' : <Play className="w-4 h-4 mr-2" />}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default SearchResults
