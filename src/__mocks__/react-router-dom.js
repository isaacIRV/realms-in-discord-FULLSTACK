module.exports = {
  // Simulamos useNavigate, que es el hook que usamos.
  useNavigate: () => jest.fn(),

  // Simulamos BrowserRouter, que es necesario para que el componente se renderice.
  BrowserRouter: ({ children }) => <div>{children}</div>,

  // Simulamos Link para la Navbar y otras referencias.
  Link: ({ to, children }) => <a href={to}>{children}</a>,

  // Devolvemos versiones simuladas de otros hooks si los necesita Jest.
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({}),
};