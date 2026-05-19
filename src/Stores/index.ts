import { create } from 'zustand'
import { persist } from "zustand/middleware"
import type { BudgetType, DepenseType, ResteType, UserType } from '../Types'

type UserStoreType = {
  user: UserType | null,
  updateUser: (user: UserType) => void
}


type BudgetStoreType = {
  budget: BudgetType[],
  updateBudget: (item: BudgetType) => void // Typage des budgets
  deleteBudget: (id: string) => void, // Typage de supprèssion
  updateBudgetItem: (item: BudgetType) => void // Typage de la modification
}

type DepenseStoreType = {
  depenses: DepenseType[],
  updateDepense: (item: DepenseType) => void
  removeDepense: (id: string) => void
  setDepenses: (items: DepenseType[]) => void
}

type ResteStoreType ={
  reste: ResteType[]
  resteTotal: (restes: ResteType[]) => void
}

export const ResteStore = create<ResteStoreType>((set) => ({
    reste: [],

    resteTotal: (restes) =>
        set({
            reste: restes
        })
}))


export const UseUserStore = create<UserStoreType>()(
  persist(
    (set) => ({

      user: null,
      updateUser: (user) => set(() => ({ user })),
    }),
    {
      name: "user-store"
    }
  )
)
/* Store sans mise a jour de l'ui après la supprèssion dans la db
export const BudgetStore = create<BudgetStoreType>()(
    persist(
        (set) => ({
            budget: [],
            updateBudget: (item) => 
                set((state) => ({ 
                    budget: [...state.budget, item] })),
        }),
        {
            name: "budget-store"
        }
    )
)

*/

export const BudgetStore = create<BudgetStoreType>()(
  persist(
    (set) => ({
      //Je parcour le tableau et j'affiche les éléments du tableau
      //Le store de tout mes budgets
      budget: [],
      updateBudget: (item) => set((state) => ({
        budget: [...state.budget, item]
      })),
      //Je parcourt le tableau budget et je supprime grace a son ID
      //Le sotre de supprèssion des données db-ui
      deleteBudget: (id) => set((state) => ({
        budget: state.budget.filter(b => b.id !== id)
      })),
      // Je parcourt tous les budgets et on remplace uniquement
      // celui dont l'id correspond par le nouveau budget modifié
      // Le store des modifications
      updateBudgetItem: (item) => set((state) => ({
        budget: state.budget.map(b => b.id === item.id ? item : b)
      }))
    }),
    { name: "budget-store" }
  )
)

export const DepenseStore = create<DepenseStoreType>()(
  persist(
    (set) => ({
      depenses: [],

      updateDepense: (item) =>
        set((state) => ({
          depenses: [...state.depenses, item]
        })),

      removeDepense: (id) =>
        set((state) => ({
          depenses: state.depenses.filter(
            (d) => d.id !== id
          )
        })),

      setDepenses: (items) =>
        set(() => ({
          depenses: items
        }))
    }),
    {
      name: "depense-store"
    }
  )
)