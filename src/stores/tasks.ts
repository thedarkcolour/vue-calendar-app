import { defineStore } from 'pinia'

export class Task {
  name: string
  time: any
  description: string
}

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    // Stores tasks
    tasksByDate: new Map<Date, Array<Task>>()
  }),
  getters: {
    // Get tasks for a specific date
    getTasksForDate: (state) => (date: Date) => {
      // Convert date to a string key supported by Map
      const dateKey = date.toDateString()
      // Return tasks or an empty array if none exist
      return state.tasksByDate[dateKey] || []
    }
  },
  actions: {
    addTask(date: Date, task: Task) {
      const dateKey = date.toDateString()
      // Initialize an array if no tasks exist for the date
      if (!this.tasksByDate[dateKey]) {
        this.tasksByDate[dateKey] = []
      }
      // Add the new task to the date's task list
      this.tasksByDate[dateKey].push(task)
    }
  }
})







