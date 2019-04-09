import {
  h,
  app
} from 'hyperapp'
import withCompat from "hyperapp-compat";
import debounce from 'debounce-promise'
import * as jsondata from './jsondata.json'
import './styles/main.sass'

const getfoundListFn = search => {
  return jsondata.laureates.filter(obj => Object.keys(obj).some(key => {
    if(typeof obj[key] === 'string') {
      return (obj[key].toLowerCase().indexOf(search.toLowerCase()) > -1);
    }else {
      return false;
    }
  }))
}

const getfoundList = debounce(getfoundListFn, 700)

const initialState = {
  search: '',
  foundList: [],
}

const UpdateUrl = (state, { target: { value } }) => ({...state, url: value });

const  UpdateSearch = (state, { target: { value } }) => ({...state, search: value}) => {
  getfoundList(state.search).then(newlist => SetFoundList(newlist))
  return {
    search
  }
}
const SetFoundList = newlist => ({...state, foundList: newlist}) => ({
  foundList
})


const view = ({search, foundList}) =>
  <main>
    <div> Search Nobel laureates: </div> 
    <input type = 'text' className = 'searchInput' value = { state.search }
      onInput = { UpdateSearch } /> 
    <br/>
      { state.foundList.length ? state.foundList.map(item => {
        return  <div className='userCard'> 
                  <div class='userCard__name'> 
                    { item.firstname + ' ' + item.surname } 
                  </div> 
                  <div class='userCard__location'> 
                    { item.bornCity + ', ' + item.bornCountry } 
                  </div> 
                </div>
        }) : <div className='userCard'>  👆enter name or other info </div>
      } 
  </main>

// This runs the app. The return object (here not used) makes it possible
// to interact with the app from outside of the view
// In a real app, you should not attach the view directly to the body, but
// create some element in the static HTML to attach to.
// more on that: https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375#486f

//app(state, actions, view, document.body)

withCompat(app)({
  init: initialState,
  view,
  container: document.body
});