export type UserType = {
    uid?: string,
    nom: string,
    email?: string,
    password?: string,
    tel?: string
}

export type BudgetType = {
    id?: string,
    tittre: string,
    montant: number,
    depense?: number,
    reste?: number,
    idUser?: string,
}

export type TransactionsType = {
    id?: string,
    montant: number,
    description?: string,
    date: string,
    idBudget?: string
}

export type DepenseType = {
    id?: string,
    categorie?: string,
    titre: string,
    createdAt?: number,
    depense: number,
    idUser?: string
}

export type ResteType = {
    id?: string
    tittre?: string
    montant: number 
    depense: number
    reste?: number
}