import { useWorkoutTemplateStore } from './workoutTemplateStore';

export class SessionStore extends useWorkoutTemplateStore {
  // Add session-specific properties and methods
  sessionId: string | null = null;
  
  setSessionId(id: string) {
    this.sessionId = id;
  }

  // Override or extend methods as needed for session-specific behavior
  saveSession() {
    // Implement session saving logic
  }

  // ... other session-specific methods
}

export const sessionStore = new SessionStore();