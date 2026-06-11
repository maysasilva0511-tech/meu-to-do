export interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  category?: Category
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
}

export interface AuthUser {
  id: string
  email: string
  avatar_url?: string
}