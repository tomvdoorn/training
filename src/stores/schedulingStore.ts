import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface SchedulingState {
  selectedDate: Date | null
  selectedTemplateId: number | null
  setSelectedDate: (date: Date) => void
  setSelectedTemplateId: (id: number) => void
  resetState: () => void
}

export const useSchedulingStore = create<SchedulingState>()(
  immer((set) => ({
    selectedDate: null,
    selectedTemplateId: null,
    setSelectedDate: (date) => set((state) => { state.selectedDate = date }),
    setSelectedTemplateId: (id) => set((state) => { state.selectedTemplateId = id }),
    resetState: () => set((state) => { state.selectedDate = null; state.selectedTemplateId = null }),
  }))
)