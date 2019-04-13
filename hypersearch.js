import { app, h } from './hyperappv2'
import './styles/main.sass'

const getfoundListFn = ( find ) =>  
    find ? jsondata.filter(obj => Object.keys(obj).some( key => 
        typeof obj[key] === 'string' ?
        obj[key].toLowerCase().indexOf(find.toLowerCase()) > -1 : false
    )) : ''

const  UpdateSearch = (state, event) =>  
( { ...state, search: event.target.value, foundList: getfoundListFn(event.target.value) } );

$('.hypersearch').each(function() {

    app({
    init: { search:'', foundList:[], variation:$(this).attr('variation') },
    view: ({ search, foundList, variation }) => (
        <main>
        <div> Search Nobel laureates ({variation}): </div> 
        <input type = 'text' className = 'searchInput' value = { search }
            oninput = { UpdateSearch } /> 
        <br/>
            { foundList.length ? foundList.map(item => 
                <div className='userCard'> 
                    <div class={variation}> 
                    { item.firstname + ' ' + item.surname } 
                    </div> 
                    <div class='userCard__location'> 
                    { item.bornCity + ', ' + item.bornCountry } 
                    </div> 
                </div>
            ) : <div className='userCard'>  👆 enter name or other info </div>
            } 
        </main>
    ),
    container: this
    })

})