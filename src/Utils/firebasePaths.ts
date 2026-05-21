// Helper pour générer les chemins Firebase par utilisateur

export const getDepensesPath = (userId: string) => `users/${userId}/depenses`
export const getDepenseByIdPath = (userId: string, depenseId: string) => `users/${userId}/depenses/${depenseId}`

export const getBudgetsPath = (userId: string) => `users/${userId}/budgets`
export const getBudgetByIdPath = (userId: string, budgetId: string) => `users/${userId}/budgets/${budgetId}`

export const getEpargnePath = (userId: string) => `users/${userId}/epargne`
export const getEpargneByMonthPath = (userId: string, month: string) => `users/${userId}/epargne/${month}`
