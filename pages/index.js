import dynamic from 'next/dynamic'
import Link from 'next/link'
import Layout from '../components/MyLayout.js'
import RubyExercise from '../components/Editors/RubyExercise.js'

export default () => {
  return (
    <Layout>
      
      {/*<Link href="/about">
        <button>Go to About Page</button>
      </Link> 
      */}

      <RubyExercise />
    </Layout>
  )
}

