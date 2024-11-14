import { useState, useEffect } from 'react'

class RefreshEventEmitter {
  constructor() {
    this.events = {}
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }

  remove(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
}

export const refreshEvents = new RefreshEventEmitter()

const useRefreshable = (componentId, onRefresh) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const handleRefresh = async () => {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    refreshEvents.on(`refresh:${componentId}`, handleRefresh)
    return () => refreshEvents.remove(`refresh:${componentId}`, handleRefresh)
  }, [componentId, onRefresh])

  return isRefreshing
}

export default useRefreshable
