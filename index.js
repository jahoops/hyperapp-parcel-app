import { app, h } from './hyperappv2'
import './styles/main.sass'

const getfoundListFn = ( find ) => {
  return find ? window.jsondata.filter(obj => Object.keys(obj).some(key => {
    if(typeof obj[key] === 'string') {
      return (obj[key].toLowerCase().indexOf(find.toLowerCase()) > -1);
    } else {
      return false;
    }
  })) : ''
}

const  UpdateSearch = (state, event) => ({ search: event.target.value, foundList : getfoundListFn(event.target.value)})

app({
  init: { search:'', foundList:[] },
  view: ({ search, foundList }) => (
    <main>
      <div> Search Nobel laureates: </div> 
      <input type = 'text' className = 'searchInput' value = { search }
        oninput = { UpdateSearch } /> 
      <br/>
        { foundList.length ? foundList.map(item => {
          return  <div className='userCard'> 
                    <div class='userCard__name'> 
                      { item.firstname + ' ' + item.surname } 
                    </div> 
                    <div class='userCard__location'> 
                      { item.bornCity + ', ' + item.bornCountry } 
                    </div> 
                  </div>
          }) : <div className='userCard'>  👆 enter name or other info </div>
        } 
    </main>
  ),
  container: document.body
});