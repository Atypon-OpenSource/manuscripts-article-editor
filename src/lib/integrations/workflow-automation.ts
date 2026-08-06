/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

export type WorkflowTrigger =
  | 'manual'
  | 'save'
  | 'interval'
  | 'export'
  | 'collaboration'

export type WorkflowAction =
  | 'backup_google_drive'
  | 'commit_github'
  | 'export_pdf'
  | 'sync_references'
  | 'send_notification'
  | 'validate_citations'
  | 'check_plagiarism'

export interface WorkflowRule {
  id: string
  name: string
  description: string
  enabled: boolean
  trigger: WorkflowTrigger
  conditions?: WorkflowCondition[]
  actions: WorkflowActionConfig[]
  lastRun?: string
  runCount: number
  createdAt: string
}

export interface WorkflowCondition {
  type: 'field_changed' | 'word_count' | 'time_elapsed' | 'user_role'
  field?: string
  operator?: 'equals' | 'greater_than' | 'less_than' | 'contains'
  value?: any
}

export interface WorkflowActionConfig {
  type: WorkflowAction
  provider?: string
  settings: Record<string, any>
}

export interface WorkflowExecutionLog {
  workflowId: string
  executedAt: string
  trigger: WorkflowTrigger
  success: boolean
  actions: {
    type: WorkflowAction
    success: boolean
    error?: string
    result?: any
  }[]
  duration: number
}

export class WorkflowEngine {
  private static readonly STORAGE_KEY = 'manuscripts_workflows'
  private static readonly LOG_KEY = 'manuscripts_workflow_logs'
  private static intervalHandles: Map<string, number> = new Map()

  static getWorkflows(): WorkflowRule[] {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static saveWorkflow(workflow: WorkflowRule) {
    const workflows = this.getWorkflows()
    const index = workflows.findIndex((w) => w.id === workflow.id)

    if (index >= 0) {
      workflows[index] = workflow
    } else {
      workflows.push(workflow)
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workflows))

    if (workflow.enabled && workflow.trigger === 'interval') {
      this.scheduleInterval(workflow)
    }
  }

  static deleteWorkflow(workflowId: string) {
    const workflows = this.getWorkflows().filter((w) => w.id !== workflowId)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workflows))
    this.clearInterval(workflowId)
  }

  static async executeWorkflow(
    workflowId: string,
    context?: Record<string, any>
  ): Promise<WorkflowExecutionLog> {
    const workflow = this.getWorkflows().find((w) => w.id === workflowId)
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`)
    }

    const startTime = Date.now()
    const log: WorkflowExecutionLog = {
      workflowId,
      executedAt: new Date().toISOString(),
      trigger: workflow.trigger,
      success: true,
      actions: [],
      duration: 0,
    }

    try {
      if (workflow.conditions && !this.evaluateConditions(workflow.conditions, context)) {
        log.success = false
        return log
      }

      for (const actionConfig of workflow.actions) {
        try {
          const result = await this.executeAction(actionConfig, context)
          log.actions.push({
            type: actionConfig.type,
            success: true,
            result,
          })
        } catch (error) {
          log.actions.push({
            type: actionConfig.type,
            success: false,
            error: (error as Error).message,
          })
          log.success = false
        }
      }

      workflow.lastRun = new Date().toISOString()
      workflow.runCount++
      this.saveWorkflow(workflow)
    } catch (error) {
      log.success = false
    }

    log.duration = Date.now() - startTime
    this.logExecution(log)

    return log
  }

  private static async executeAction(
    actionConfig: WorkflowActionConfig,
    context?: Record<string, any>
  ): Promise<any> {
    switch (actionConfig.type) {
      case 'backup_google_drive':
        return this.backupToGoogleDrive(actionConfig.settings, context)

      case 'commit_github':
        return this.commitToGitHub(actionConfig.settings, context)

      case 'export_pdf':
        return this.exportToPDF(actionConfig.settings, context)

      case 'sync_references':
        return this.syncReferences(actionConfig.settings, context)

      case 'send_notification':
        return this.sendNotification(actionConfig.settings, context)

      case 'validate_citations':
        return this.validateCitations(actionConfig.settings, context)

      case 'check_plagiarism':
        return this.checkPlagiarism(actionConfig.settings, context)

      default:
        throw new Error(`Unknown action type: ${actionConfig.type}`)
    }
  }

  private static async backupToGoogleDrive(
    settings: Record<string, any>,
    context?: Record<string, any>
  ): Promise<any> {
    // TODO: Implement Google Drive backup
    console.log('Backing up to Google Drive', settings, context)
    return { success: true, message: 'Backup created' }
  }

  private static async commitToGitHub(
    settings: Record<string, any>,
    context?: Record<string, any>
  ): Promise<any> {
    // TODO: Implement GitHub commit
    console.log('Committing to GitHub', settings, context)
    return { success: true, commitSha: 'abc123' }
  }

  private static async exportToPDF(
    settings: Record<string, any>,
    context?: Record<string, any>
  ): Promise<any> {
    // TODO: Implement PDF export
    console.log('Exporting to PDF', settings, context)
    return { success: true, url: '/exports/document.pdf' }
  }

  private static async syncReferences(
    settings: Record<string, any>,
    context?: Record<string, any>
  ): Promise<any> {
    // TODO: Implement reference syncing
    console.log('Syncing references', settings, context)
    return { success: true, synced: 15 }
  }

  private static async sendNotification(
    settings: Record<string, any>,
    context?: Record<string, any>
  ): Promise<any> {
    // TODO: Implement notifications
    console.log('Sending notification', settings, context)
    return { success: true, sent: true }
  }

  private static async validateCitations(
    settings: Record<string, any>,
    context?: Record<string, any>
  ): Promise<any> {
    // TODO: Implement citation validation
    console.log('Validating citations', settings, context)
    return { success: true, valid: true, issues: [] }
  }

  private static async checkPlagiarism(
    settings: Record<string, any>,
    context?: Record<string, any>
  ): Promise<any> {
    // TODO: Implement plagiarism check
    console.log('Checking plagiarism', settings, context)
    return { success: true, similarity: 0.05 }
  }

  private static evaluateConditions(
    conditions: WorkflowCondition[],
    context?: Record<string, any>
  ): boolean {
    return conditions.every((condition) => {
      switch (condition.type) {
        case 'field_changed':
          return context?.changedFields?.includes(condition.field)
        case 'word_count':
          const wordCount = context?.wordCount || 0
          return this.compareValues(
            wordCount,
            condition.operator!,
            condition.value
          )
        case 'time_elapsed':
          return true // TODO: Implement time check
        case 'user_role':
          return context?.userRole === condition.value
        default:
          return true
      }
    })
  }

  private static compareValues(
    a: any,
    operator: string,
    b: any
  ): boolean {
    switch (operator) {
      case 'equals':
        return a === b
      case 'greater_than':
        return a > b
      case 'less_than':
        return a < b
      case 'contains':
        return String(a).includes(String(b))
      default:
        return false
    }
  }

  private static scheduleInterval(workflow: WorkflowRule) {
    this.clearInterval(workflow.id)

    const intervalMs = workflow.actions[0]?.settings?.intervalMinutes
      ? workflow.actions[0].settings.intervalMinutes * 60 * 1000
      : 3600000 // Default 1 hour

    const handle = window.setInterval(() => {
      this.executeWorkflow(workflow.id)
    }, intervalMs)

    this.intervalHandles.set(workflow.id, handle)
  }

  private static clearInterval(workflowId: string) {
    const handle = this.intervalHandles.get(workflowId)
    if (handle) {
      window.clearInterval(handle)
      this.intervalHandles.delete(workflowId)
    }
  }

  static initializeIntervals() {
    const workflows = this.getWorkflows()
    workflows
      .filter((w) => w.enabled && w.trigger === 'interval')
      .forEach((w) => this.scheduleInterval(w))
  }

  private static logExecution(log: WorkflowExecutionLog) {
    const logs = this.getLogs()
    logs.unshift(log)
    
    // Keep last 100 logs
    if (logs.length > 100) {
      logs.splice(100)
    }

    localStorage.setItem(this.LOG_KEY, JSON.stringify(logs))
  }

  static getLogs(): WorkflowExecutionLog[] {
    const stored = localStorage.getItem(this.LOG_KEY)
    return stored ? JSON.parse(stored) : []
  }
}

// Initialize interval workflows on module load
if (typeof window !== 'undefined') {
  WorkflowEngine.initializeIntervals()
}
