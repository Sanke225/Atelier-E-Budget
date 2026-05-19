import { UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { MapPin } from 'lucide-react'
import { Mail } from 'lucide-react'

function EditProfil() {
  return (
    
                
                <div className='max-w-4xl'>
                    <div className='border border-gray-100 p-5 rounded-lg flex flex-col shadow-sm max-w-full'>
                        <div className='flex justify-between w-full border border-gray-100 p-5 rounded-lg'>
                            <Link to={""} className='flex items-center gap-10 ms-3'>
                                <UserRound className='w-13 h-13 bg-blue-100 border border-gray-400 rounded-full p-3' />
                                <div>
                                    <p className='font-mono text- text-gray-400'>Nom et prénom</p>
                                    <p>Sankara Issa</p>
                                </div>
                            </Link>
                            <div className='flex items-center'>
                                <Link to={""}>
                                    <button type='submit' className='btn btn-sm'>Modifier</button>
                                </Link>
                            </div>
                        </div>

                        <div className='flex justify-between  w-full border border-gray-100 p-5 rounded-lg'>
                            <Link to={""} className='flex items-center gap-10 ms-3'>
                                <Mail className='w-13 h-13 bg-blue-100 border border-gray-400 rounded-full p-3' />
                                <div>
                                    <p className='font-mono text- text-gray-400'>Email</p>
                                    <p>email-email@example.com</p>
                                </div>
                            </Link>
                        </div>

                        <div className='flex justify-between  w-full border border-gray-100 p-5 rounded-lg'>
                            <Link to={""} className='flex items-center gap-10 ms-3'>
                                <MapPin className='w-13 h-13 bg-blue-100 border border-gray-400 rounded-full p-3' />
                                <div>
                                    <p className='font-mono text- text-gray-400'>Ville</p>
                                    <p>Abidjan</p>
                                </div>
                            </Link>
                            <div className='flex items-center'>
                                <Link to={""}>
                                    <button type='submit' className='btn btn-sm'>Modifier</button>
                                </Link>
                            </div>
                        </div>

                        <div className='flex justify-between  w-full border border-gray-100 p-5 rounded-lg'>
                            <Link to={""} className='flex items-center gap-10 ms-3'>
                                <Phone className='w-13 h-13 bg-blue-100 border border-gray-400 rounded-full p-3' />
                                <div>
                                    <p className='font-mono text- text-gray-400'>Numéro de téléphone</p>
                                    <p><span>(+225)</span> 01 23 45 67 89</p>
                                </div>
                            </Link>
                            <div className='flex items-center'>
                                <Link to={""}>
                                    <button type='submit' className='btn btn-sm'>Modifier</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
  )
}

export default EditProfil
