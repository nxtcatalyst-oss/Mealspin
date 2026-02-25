import Link from 'next/link'
import { ArrowLeft, ChefHat } from 'lucide-react'
import MealManager from '@/components/MealManager'

export const dynamic = 'force-dynamic'

export default function MealsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-amber-400 transition-colors duration-200 mb-6"
        >
          <ArrowLeft size={16} />
          Back to spin
        </Link>

        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}
          >
            <ChefHat size={22} className="text-[#07071a]" />
          </div>
          <div>
            <h1
              className="text-2xl font-black leading-tight"
              style={{
                fontFamily: 'var(--font-playfair)',
                background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Manage Meals
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Add, edit, or disable meals in the rotation</p>
          </div>
        </div>
      </div>

      {/* Manager */}
      <MealManager />
    </div>
  )
}
