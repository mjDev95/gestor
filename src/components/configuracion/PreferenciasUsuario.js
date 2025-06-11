import React, {useContext} from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Sun, Moon } from 'react-bootstrap-icons';
import { ThemeContext } from '../../theme/ThemeProvider'; 


const PreferenciasUsuario = () => {
    const { theme, toggleTheme } = useContext(ThemeContext); 

    return (
        <div>
            <h5>Preferencias</h5>
            <ul className="nav nav-pills flex-md-column">
                <li className="my-2 mx-2 mx-md-0">
                    <button className="link ms-auto ms-lg-0 btn-sidebar" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun color="gold" size={16} /> : <Moon color="silver" size={16} />}
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default PreferenciasUsuario;