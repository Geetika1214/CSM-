import {BrowserRouter, Routes , Route} from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Account from './pages/Account';
import EmailVerification from './pages/EmailVerification';
import ForgotPassword from './pages/forgotPassword';
import GenerateNewPassword from './pages/generateNewPass';
import FileUploadPage from './pages/FileUploadPage';
import { Project } from './pages/project';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/about';

export default function App() {
  return (
    <Routes>
      <Route path='/' element= {<Home/>}></Route>
      <Route path='/about' element= {<About/>}></Route>
      <Route path='/signin' element= {<SignIn/>}></Route>
      <Route path='/forgotpassword' element= {<ForgotPassword/>}></Route>
      <Route path='/generatenewpass' element = {<GenerateNewPassword/>}></Route>
      <Route path='/profile' element= {<Profile/>}></Route>
      <Route path='/signup' element= {<SignUp/>}></Route>
      <Route path='/emailverification' element= {<EmailVerification/>}></Route>
      <Route path='/account' element= {<Account/>}></Route>
      <Route path='/fileupload/:id' element= {<FileUploadPage/>}></Route>
      <Route path='/project' element= {<Project/>}></Route>
      <Route path="/project/:id" element={<ProjectDetail/>} />
    </Routes>
  )
}
