import { app, h } from './hyperappv2'
import './styles/main.sass'

const themes = { theme1: { userCard: 'userCard text-white bg-dark col-auto', userCard_location: 'userCard text-success'}
                ,theme2: { userCard: 'userCard text-dark bg-success col-4', userCard_location: 'userCard text-warning'} }

const getfoundListFn = ( find ) =>  
    find ? jsondata.filter(obj => Object.keys(obj).some( key => 
        typeof obj[key] === 'string' ?
        obj[key].toLowerCase().indexOf(find.toLowerCase()) > -1 : false
    )) : ''

const  UpdateSearch = (state, event) =>  
( { ...state, search: event.target.value, foundList: getfoundListFn(event.target.value) } );

$('.hypersearch').each(function() {
    app({
    init: { search:'', foundList:[], theme:$(this).attr('theme')},
    view: ({ search, foundList, theme }) => (
        <main>
        <div> Search Nobel laureates ({theme}): </div> 
        <input type = 'text' className = 'searchInput' value = { search }
            oninput = { UpdateSearch } /> 
        <br/>
            { foundList.length ? foundList.map(item => 
                <div className={themes[theme].userCard}> 
                    <div class={themes[theme].userCard}> 
                    { item.firstname + ' ' + item.surname } 
                    </div> 
                    <div class={themes[theme].userCard_location}> 
                    { item.bornCity + ', ' + item.bornCountry } 
                    </div> 
                </div>
            ) : <div className={themes[theme].userCard}>  👆 enter name or other info </div>
            } 
        </main>
    ),
    container: this
    })

})