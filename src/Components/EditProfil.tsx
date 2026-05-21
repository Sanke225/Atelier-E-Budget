import { UserRound, Phone, MapPin, Mail } from 'lucide-react'
import { useState } from 'react'
import { UseUserStore } from '../Stores'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase'
import { Toastsuccess, Toasterror } from '../Controllers/ToastEmmiter'

function EditProfil() {
  const { user, updateUser } = UseUserStore()

  // États pour l'édition
  const [isEditingNom, setIsEditingNom] = useState(false)
  const [isEditingVille, setIsEditingVille] = useState(false)
  const [isEditingTel, setIsEditingTel] = useState(false)

  // États pour les valeurs
  const [nom, setNom] = useState(user?.nom || "")
  const [ville, setVille] = useState("Abidjan") // Vous pouvez ajouter ville dans le UserType si besoin
  const [telephone, setTelephone] = useState(user?.tel || "")

  // Fonction pour sauvegarder le nom
  const handleSaveNom = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: nom })
      }
      updateUser({ ...user!, nom })
      setIsEditingNom(false)
      Toastsuccess("Nom mis à jour avec succès")
    } catch (error) {
      console.error(error)
      Toasterror("Erreur lors de la mise à jour")
    }
  }

  // Fonction pour sauvegarder le téléphone
  const handleSaveTel = () => {
    updateUser({ ...user!, tel: telephone })
    setIsEditingTel(false)
    Toastsuccess("Téléphone mis à jour avec succès")
  }

  // Fonction pour sauvegarder la ville (stockage local pour l'instant)
  const handleSaveVille = () => {
    // Vous pouvez ajouter ville à Firebase Database si besoin
    setIsEditingVille(false)
    Toastsuccess("Ville mise à jour avec succès")
  }
  return (
                <div className='w-full'>
                    <div className='bg-white border border-gray-200 p-3 sm:p-5 rounded-xl flex flex-col shadow-sm gap-3 sm:gap-4'>

                        {/* Nom et prénom */}
                        <div className='flex justify-between items-center w-full border border-gray-100 p-3 sm:p-5 rounded-lg'>
                            <div className='flex items-center gap-3 sm:gap-10 flex-1'>
                                <UserRound className='w-10 h-10 sm:w-13 sm:h-13 bg-blue-100 border border-gray-300 rounded-full p-2 sm:p-3 shrink-0' />
                                <div className='flex-1'>
                                    <p className='font-mono text-xs sm:text-sm text-gray-400'>Nom et prénom</p>
                                    {isEditingNom ? (
                                        <input type="text" placeholder='Nom et prénom' aria-label='Nom complet' value={nom} onChange={(e) => setNom(e.target.value)} className='input input-sm w-full max-w-xs mt-1' autoFocus />
                                    ) : (
                                        <p className='text-sm sm:text-base font-medium'>{user?.nom || "Non renseigné"}</p>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                {isEditingNom ? (
                                    <>
                                        <button onClick={handleSaveNom} className='btn btn-success btn-xs sm:btn-sm'>Sauver</button>
                                        <button onClick={() => setIsEditingNom(false)} className='btn btn-xs sm:btn-sm'>Annuler</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditingNom(true)} className='btn btn-neutral btn-xs sm:btn-sm'>Modifier</button>
                                )}
                            </div>
                        </div>

                        {/* Email - Sans bouton modifier */}
                        <div className='flex items-center w-full border border-gray-100 p-3 sm:p-5 rounded-lg'>
                            <div className='flex items-center gap-3 sm:gap-10'>
                                <Mail className='w-10 h-10 sm:w-13 sm:h-13 bg-blue-100 border border-gray-300 rounded-full p-2 sm:p-3 shrink-0' />
                                <div>
                                    <p className='font-mono text-xs sm:text-sm text-gray-400'>Email</p>
                                    <p className='text-sm sm:text-base font-medium break-all'>email-email@example.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Ville */}
                        <div className='flex justify-between items-center w-full border border-gray-100 p-3 sm:p-5 rounded-lg'>
                            <div className='flex items-center gap-3 sm:gap-10 flex-1'>
                                <MapPin className='w-10 h-10 sm:w-13 sm:h-13 bg-blue-100 border border-gray-300 rounded-full p-2 sm:p-3 shrink-0' />
                                <div className='flex-1'>
                                    <p className='font-mono text-xs sm:text-sm text-gray-400'>Ville</p>
                                    {isEditingVille ? (
                                        <input type="text" placeholder='Ville' aria-label='Ville' value={ville} onChange={(e) => setVille(e.target.value)} className='input input-sm w-full max-w-xs mt-1' autoFocus />
                                    ) : (
                                        <p className='text-sm sm:text-base font-medium'>{ville}</p>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                {isEditingVille ? (
                                    <>
                                        <button onClick={handleSaveVille} className='btn btn-success btn-xs sm:btn-sm'>Sauver</button>
                                        <button onClick={() => setIsEditingVille(false)} className='btn btn-xs sm:btn-sm'>Annuler</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditingVille(true)} className='btn btn-neutral btn-xs sm:btn-sm'>Modifier</button>
                                )}
                            </div>
                        </div>

                        {/* Numéro de téléphone */}
                        <div className='flex justify-between items-center w-full border border-gray-100 p-3 sm:p-5 rounded-lg'>
                            <div className='flex items-center gap-3 sm:gap-10 flex-1'>
                                <Phone className='w-10 h-10 sm:w-13 sm:h-13 bg-blue-100 border border-gray-300 rounded-full p-2 sm:p-3 shrink-0' />
                                <div className='flex-1'>
                                    <p className='font-mono text-xs sm:text-sm text-gray-400'>Numéro de téléphone</p>
                                    {isEditingTel ? (
                                        <div className='flex items-center gap-1 mt-1'>
                                            <span className='text-sm sm:text-base'>+225</span>
                                            <input
                                                type="tel"
                                                value={telephone}
                                                onChange={(e) => setTelephone(e.target.value)}
                                                placeholder="01 23 45 67 89"
                                                className='input input-sm w-full max-w-xs'
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        <p className='text-sm sm:text-base font-medium'>
                                            {telephone ? `+225 ${telephone}` : "Non renseigné"}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                {isEditingTel ? (
                                    <>
                                        <button onClick={handleSaveTel} className='btn btn-success btn-xs sm:btn-sm'>Sauver</button>
                                        <button onClick={() => setIsEditingTel(false)} className='btn btn-xs sm:btn-sm'>Annuler</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditingTel(true)} className='btn btn-neutral btn-xs sm:btn-sm'>Modifier</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
  )
}

export default EditProfil
