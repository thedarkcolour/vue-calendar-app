<script setup lang="ts">
import { ref, computed } from 'vue'
import { Task, useTaskStore } from '@/stores/tasks'

const currentDate = ref(new Date())

class CalendarCell {
  date: Date
  notCurrentMonth: boolean
  tasks: Array<Task>
  key: number

  constructor(date: Date, notCurrentMonth: boolean, tasks: Array<Task>) {
    this.date = date
    this.notCurrentMonth = notCurrentMonth
    this.tasks = tasks
    this.key = date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate()
  }
}

const tasks = useTaskStore()
const days = computed(() => {
  const date = currentDate.value
  const array: Array<CalendarCell> = []

  // First date of this month (ex. October 1st)
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  // Last date of this month (date 0 underflows from the next month to last day of this month)
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  // Make a copy of the first date of this month...
  const prevMonthLastDay = new Date(first)
  // ...then set date to 0 to "underflow" to the last date of the previous month
  prevMonthLastDay.setDate(0)
  // getDay returns the index of the day of the week (ex. if the date is a Sunday, returns 0)
  const prevDaysCount = first.getDay()

  // Add days from the previous month
  for (let i = prevDaysCount - 1; i >= 0; i--) {
    const prevMonthDay = new Date(prevMonthLastDay)
    prevMonthDay.setDate(prevMonthLastDay.getDate() - i)

    // Add a "day" object that has a date and notCurrentMonth property
    array.push(new CalendarCell(prevMonthDay, true, tasks.getTasksForDate(prevMonthDay)))
  }

  // Add days of the current month
  for (let day = 1; day <= last.getDate(); day++) {
    const currentMonthDay = new Date(date.getFullYear(), date.getMonth(), day)
    array.push(new CalendarCell(currentMonthDay, false, tasks.getTasksForDate(currentMonthDay)))
  }

  // Add days from the next month, if any
  if (last.getDay() !== 0) {
    const nextMonthDays = 7 - last.getDay()

    for (let i = 1; i < nextMonthDays; i++) {
      array.push(
        new CalendarCell(new Date(last.getFullYear(), last.getMonth(), last.getDate() + i), true)
      )
    }
  }

  return array
})
</script>

<template>
  <div class="calendar-page">
    <h1>Task Calendar</h1>

    <div class="calendar-header">
      <h2 class="month-year">
        {{ currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) }}
      </h2>
    </div>

    <div class="week-header">
      <div
        v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
        :key="day"
        class="week-day"
      >
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="day in days"
        :key="day.key"
        class="calendar-cell"
        :class="{ 'not-current-month': day.notCurrentMonth }"
      >
        <div class="date-label">{{ day.date.getDate() }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-cell {
  padding: 10px;
  transition: all 0.2s ease-in-out;
  border: 1px solid #ffffff;
  background-color: #d1dde4;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100px;
}

.date-label {
  font-weight: bold;
  color: black;
  margin-bottom: 5px;
  text-align: right;
}

.not-current-month {
  opacity: 0.5;
}
</style>
