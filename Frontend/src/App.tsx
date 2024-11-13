import './App.css'
import {Provider} from 'react-redux'
import Body from './Pages/Body'
import {store} from './Redux/store'
 function App(){

   return(
    <>
     <Provider store={store}><Body/></Provider>
    </>
   )
}


export default App;