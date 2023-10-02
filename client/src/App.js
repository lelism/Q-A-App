import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import './colors.css';
import Questions from './Pages/Questions/Questions';
import Registration from './Pages/Registration/Registration';
import Sidebar from './Components/Sidebar/Sidebar';
import UserSection from './Components/UserSection/UserSection';
import { refreshUserData } from './Utils/api';
import { checkSession } from './Utils/functions';
import Answers from './Pages/Answers';
import IconAws from './Components/IconAws';
import NotFound from './Pages/NotFound/NotFound';

function App () {
    const [isLogged, setIsLogged] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        checkSession() ? setIsLogged(true) : setIsLogged(false);
    }, []);

    useEffect(() => {
        refreshUserData(isLogged, userData, setUserData);
    }, [isLogged]);

    return (
        <div className="react-app flex-col-top-c full">
            <header className='flex-col-bot-r'>
                <span className='header-slogan'>Ask the right questions if you are going to find the right answers.</span>
                <span className='header-author'>Vanessa Redgrave</span>
            </header>
            <div className='section-wrapper flex-top-l'>
                <Sidebar />
                <main className='flex-top-l'>
                    <Routes>
                        <Route path="/" element={ <Questions isLogged={ isLogged } userDetails={ userData } /> } />
                        <Route path="/answers" element={ <Answers isLogged={ isLogged } userDetails={ userData }/> } />
                        <Route path="/signup" element={ <Registration /> } />
                        <Route path='*' element={<NotFound />}/>
                    </Routes>
                    <UserSection isLogged={ isLogged } setIsLogged={ setIsLogged } userDetails={ userData } />
                </main>
            </div>
            <footer className='flex-c'>
                <IconAws iconClass='fa-regular fa-copyright' />
                <span>&nbsp; M.L. {new Date().getFullYear()}</span>
            </footer>
        </div>
    );
}

export default App;
