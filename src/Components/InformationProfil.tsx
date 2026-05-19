import { Phone } from 'lucide-react'
import { AlarmCheck } from 'lucide-react'
import { ShieldCheck } from 'lucide-react'
import { CalendarArrowDown } from 'lucide-react'
import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

function InformationProfil() {
    return (
        <div className=''>
            <div className='flex justify-between px-10 pt-5 shadow items-center border border-gray-200 rounded-xl'>
                <div className='flex gap-5'>
                    <Link to={""}>
                        <img src="/src/images/user.png" className='w-25 h-25' alt="" />
                    </Link>
                    <div className='font-mono flex flex-col text-sm'>
                        <p className='font-bold'>Sankara Cheick Issa</p>
                        <p className='text-blue-500'>Dev fullstack</p>
                        <p className='py-3'>Abijdan</p>
                        <p className='flex badge bg-emerald-200 text-emerald-700'>
                            <ShieldCheck className='w-5 h-5' />
                            Compte actif
                        </p>
                    </div>
                </div>
                <div className='flex flex-col justify-center font-mono text-xs gap-2'>
                    <div className='flex gap-2'>
                        <div>
                            <Mail className='w-10 h-10 p-3' />
                        </div>
                        <div>
                            <p className='text-gray-400'>Email</p>
                            <p>scheickissa@gmail.com</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <div>
                            <Phone className='w-10 h-10 p-3' />
                        </div>
                        <div>
                            <p className='text-gray-400'>Phone</p>
                            <p>+225 07 33 88 88 88</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <div>
                            <CalendarArrowDown className='w-10 h-10 p-3' />
                        </div>
                        <div>
                            <p className='text-gray-400'>Membre depuis</p>
                            <p>15/06/2023</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <div>
                            <AlarmCheck className='w-10 h-10 p-3' />
                        </div>
                        <div>
                            <p className='text-gray-400'>Dernière connexion</p>
                            <p>15/06/2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InformationProfil
