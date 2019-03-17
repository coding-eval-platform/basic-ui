import dynamic from 'next/dynamic'
import Link from 'next/link'
import Header from '../components/Header'
import Layout from '../components/MyLayout.js'
const CodeEditor = dynamic(import('../components/codeEditor'), {ssr: false})
import Button from '@material-ui/core/Button'

export default () => {
  return (
    <Layout>
      
      {/*<Link href="/about">
        <button>Go to About Page</button>
      </Link> 
      */}

      {/*<CodeEditor value={"for (var i=0; i < 10; i++) {\n  console.log(i)\n}"} />*/}



      <CodeEditor/>
      <Button variant="contained" color="primary">
        Execute code inside editor
      </Button>
    </Layout>
  )
}

