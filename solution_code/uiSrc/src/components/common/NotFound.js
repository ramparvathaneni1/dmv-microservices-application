import '../../styles/not_found.scss';

export const NotFound = () => (
  <div className='not-found'>
    <h1>Uh-oh...</h1>
    <p>
      The page you are looking for may have been moved, deleted <br /> or
      possibly never existed.
    </p>
    <p className='status-code'>404</p>
  </div>
);
