
function CardDepenses() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-10 '>
            <div className='stat shadow bg-gray-100 border border-gray-200 rounded-lg'>
                <p className='font-mono stat-title'>Budget du mois</p>
                <p className='font-mono text-xl stat-value'>450 000 FCFA</p>
                <p className='font-mono stat-desc'>Objecti  </p>
            </div>

            <div className='stat shadow bg-gray-100 border border-gray-200 rounded-lg'>
                <p className='font-mono stat-title'>Reste total </p>
                <p className='font-mono text-xl stat-value'>3 500 000 FCFA</p>
                <p className='font-mono stat-desc ::'>Janvier - Décembre</p>
            </div>

            <div className='stat shadow bg-gray-100 border border-gray-200 rounded-lg'>
                <p className='font-mono stat-title'>Dépense (Ce mois ci)</p>
                <p className='font-mono text-xl stat-value'>450 000 FCFA</p>
                <p className='font-mono stat-desc'> 8% de moins que le mois dernier</p>
            </div> 
    </div>
  )
}

export default CardDepenses
