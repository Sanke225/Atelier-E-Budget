import { Phone, AlarmCheck, ShieldCheck, CalendarArrowDown, Mail, Edit, Camera, User } from 'lucide-react'
import { UseUserStore } from '../Stores'
import { useState, useEffect, useRef } from 'react'
import { storage } from '../firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase'
import { Toastsuccess, Toasterror } from '../Controllers/ToastEmmiter'

function InformationProfil() {
    const { user, updateUser } = UseUserStore()
    const [metier, setMetier] = useState("Dev fullstack")
    const [isEditingMetier, setIsEditingMetier] = useState(false)
    const [ville, _setVille] = useState("Abidjan")
    const [telephone, setTelephone] = useState(user?.tel || "")
    const [isEditingTelephone, setIsEditingTelephone] = useState(false)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Debug pour vérifier le contenu du user
    useEffect(() => {
        console.log("User store data:", user)
        console.log("Photo URL:", user?.photoURL)
    }, [user])

    // Fonction pour gérer le changement de photo de profil
    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user?.uid) return

        try {
            setUploadingPhoto(true)

            // Créer une référence dans Firebase Storage
            const photoRef = storageRef(storage, `profile-photos/${user.uid}/${Date.now()}_${file.name}`)

            // Upload du fichier
            await uploadBytes(photoRef, file)

            // Récupérer l'URL de téléchargement
            const photoURL = await getDownloadURL(photoRef)

            // Mettre à jour le profil Firebase Auth
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { photoURL })
            }

            // Mettre à jour le store Zustand
            updateUser({
                ...user,
                photoURL
            })

            Toastsuccess("Photo de profil mise à jour avec succès")
        } catch (error) {
            console.error(error)
            Toasterror("Erreur lors de la mise à jour de la photo")
        } finally {
            setUploadingPhoto(false)
        }
    }
    return (
        <div className='w-full'>
            <div className='flex flex-col lg:flex-row lg:justify-between px-4 md:px-6 lg:px-10 py-5 shadow-sm bg-white border border-gray-200 rounded-xl gap-6'>
                {/* Section gauche - Photo et infos de base */}
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start'>
                    <div className='relative'>
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                className='w-20 h-20 sm:w-25 sm:h-25 rounded-full object-cover border-2 border-gray-200'
                                alt="Photo de profil"
                            />
                        ) : (
                            <div className='w-20 h-20 sm:w-25 sm:h-25 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center'>
                                <User className='w-10 h-10 sm:w-15 sm:h-15 text-gray-500' />
                            </div>
                        )}
                        {/* Bouton pour changer la photo */}
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto} className='absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50' title="Changer la photo de profil">
                            {uploadingPhoto ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <Camera className='w-4 h-4' />
                            )}
                        </button>
                        {/* Input file caché */}
                        <input aria-label="Choisir une photo de profil" ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className='hidden'
                        />
                    </div>
                    <div className='font-mono flex flex-col text-xs sm:text-sm text-center sm:text-left'>
                        {/* Nom dynamique depuis le store */}
                        <p className='font-bold text-base sm:text-lg'>{user?.nom || "Nom non disponible"}</p>

                        {/* Métier avec édition inline */}
                        <div className='flex items-center gap-2 mt-1 justify-center sm:justify-start'>
                            {isEditingMetier ? (
                                <input type="text" value={metier} placeholder="Votre métier" aria-label="Métier" onChange={(e) => setMetier(e.target.value)}
                                    onBlur={() => setIsEditingMetier(false)} onKeyDown={(e) => {
                                        if (e.key === 'Enter') setIsEditingMetier(false)
                                    }} className='input input-xs w-full max-w-xs' autoFocus
                                />
                            ) : (
                                <>
                                    <p className='text-blue-500'>{metier}</p>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingMetier(true)}
                                        className='hover:bg-gray-200 p-1 rounded'
                                        title="Modifier le métier"
                                    >
                                        <Edit className='w-3 h-3' />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Ville dynamique - Affichage simple pour l'instant */}
                        <p className='py-2 sm:py-3 text-gray-600'>{ville}</p>

                        <div className='flex justify-center sm:justify-start'>
                            <span className='inline-flex items-center gap-1 badge badge-sm sm:badge-md bg-emerald-200 text-emerald-700'>
                                <ShieldCheck className='w-4 h-4' />
                                Compte actif
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section droite - Coordonnées */}
                <div className='flex flex-col justify-center font-mono text-xs sm:text-sm gap-3 lg:gap-2'>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-gray-100 rounded-lg'>
                            <Mail className='w-8 h-8 sm:w-10 sm:h-10 p-2' />
                        </div>
                        <div>
                            <p className='text-gray-400 text-xs'>Email</p>
                            <p className='text-xs sm:text-sm'>{user?.email || "Non renseigné"}</p>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-gray-100 rounded-lg'>
                            <Phone className='w-8 h-8 sm:w-10 sm:h-10 p-2' />
                        </div>
                        <div className='flex-1'>
                            <p className='text-gray-400 text-xs'>Phone</p>
                            {isEditingTelephone ? (
                                <div className='flex items-center gap-1'>
                                    <span className='text-xs sm:text-sm'>+225</span>
                                    <input type="tel" placeholder="01 23 45 67 89" aria-label="Numéro de téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)}
                                        onBlur={() => setIsEditingTelephone(false)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') setIsEditingTelephone(false)
                                        }}  className='input input-xs w-32' autoFocus
                                    />
                                </div>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <p className='text-xs sm:text-sm'>
                                        {telephone ? `+225 ${telephone}` : "+225"}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingTelephone(true)}
                                        className='hover:bg-gray-200 p-1 rounded'
                                        title="Modifier le téléphone"
                                    >
                                        <Edit className='w-3 h-3' />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-gray-100 rounded-lg'>
                            <CalendarArrowDown className='w-8 h-8 sm:w-10 sm:h-10 p-2' />
                        </div>
                        <div>
                            <p className='text-gray-400 text-xs'>Membre depuis</p>
                            <p className='text-xs sm:text-sm'>15/06/2023</p>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-gray-100 rounded-lg'>
                            <AlarmCheck className='w-8 h-8 sm:w-10 sm:h-10 p-2' />
                        </div>
                        <div>
                            <p className='text-gray-400 text-xs'>Dernière connexion</p>
                            <p className='text-xs sm:text-sm'>15/06/2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InformationProfil
