import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/navbar.scss';

export const Navbar = () => {
  const [activeLink, setActiveLink] = useState('drivers');

  const handleActiveLink = (e) => setActiveLink(e.target.id);

  const getClassNames = (linkName) =>
    activeLink === linkName ? 'nav-link active' : 'nav-link';

  return (
    <header id='nav-wrapper'>
      <nav id='nav'>
        <div className='nav left'>
          <span className='gradient skew'>
            <h1 className='logo un-skew'>
              <Link to="/">GA DMV</Link>
            </h1>
          </span>
          <button id='menu' className='btn-nav'>
            <span className='fas fa-bars'></span>
          </button>
        </div>
        <div className='nav right'>
          <Link
            to='/drivers'
            className={getClassNames('drivers')}
            onClick={handleActiveLink}
            id='drivers'
          >
            <span className='nav-link-span'>
              <span className='u-nav'>Drivers</span>
            </span>
          </Link>
          
        </div>
      </nav>
    </header>
  );
};
