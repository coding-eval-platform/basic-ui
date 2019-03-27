import dynamic from 'next/dynamic'
import Link from 'next/link'
import Layout from '../components/MyLayout.js'
import Exercise from '../components/Exercise.js'

export default () => {
  return (
    <Layout>
      
      {/*<Link href="/about">
        <button>Go to About Page</button>
      </Link> 
      */}

      {/*<CodeEditor value={"for (var i=0; i < 10; i++) {\n  console.log(i)\n}"} />*/}
      <Exercise />
    </Layout>
  )
}

