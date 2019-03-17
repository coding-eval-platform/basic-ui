import Header from './Header'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

/*
If you remove {props.children}, the Layout cannot 
render the content we put inside the Layout element
*/

const Layout = props => (
  <div style={layoutStyle}>
    <Header />
    {props.children}
  </div>
)

export default Layout