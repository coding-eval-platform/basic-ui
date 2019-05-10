import Header from './Header'

const layoutStyle = {
  margin: 5,
  padding: 5,
  // border: '1px solid #DDD'
}

/*
If you remove {props.children}, the Layout cannot 
render the content we put inside the Layout element
*/

const Layout = props => (
  <div>
    <Header />
    <div style={layoutStyle}>
      {props.children}
    </div>
  </div>
)

export default Layout