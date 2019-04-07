import { h, app } from 'hyperapp'
import debounce from 'debounce-promise'
import './jsondata.js'
import './styles/main.sass'

const getfoundListFn = anyinfo => {
    return jsondata.laureates.filter(obj => Object.keys(obj).some(key => obj[key].includes(anyinfo))); 
}

const getfoundList = debounce(getfoundListFn, 700)

// single global state - one per app
const state = {
  anyinfo: '',
  foundList: [],
}

const actions = {
  updateanyinfo: (anyinfo) => (state, actions) => {
    // perform side effect - fetching the user data from JSON
    getfoundList(anyinfo)
      .then(actions.setFoundList)
    //  what the action actually changes in state is just anyinfo
    return { anyinfo }
  },
  // a simplest action, which just updates some part of state
  setfoundList: foundList => state => ({ foundList })
}

// here comes the JSX, but remember that it's just syntactic sugar:
// <div className='classy'>hello</div>
// becomes
// h('div', {className: 'classy'}, 'hello')
// the 'h' corresponds to 'React.createElement' in React
const view = (state, actions) =>
  <main>
    <div>Search Nobel laureates:</div>
    <input
      type='text'
      className='searchInput'
      value={state.anyinfo}
      oninput={e => actions.updateanyinfo(e.target.value)}
    />
    <br/>
    <div className='userCard'>
      {state.foundList.length ? state.FoundList.map( item => {
        return <div>
          <div class='userCard__name'>{item.firstname + ' ' + item.surname}</div>
          <div class='userCard__location'>{item.bornCity + ', ' + item.botnCountry}</div>
        </div>
      }) : (
        <div>👆 enter name or other info</div>
      )}
    </div>
  </main>

// This runs the app. The return object (here not used) makes it possible
// to interact with the app from outside of the view
// In a real app, you should not attach the view directly to the body, but
// create some element in the static HTML to attach to.
// more on that: https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375#486f
app(state, actions, view, document.body)
