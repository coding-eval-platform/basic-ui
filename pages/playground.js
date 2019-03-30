import Layout from '../components/MyLayout.js'
import RubyExercise from '../components/RubyExercise.js'
import JavaExercise from '../components/JavaExercise.js'
import CExercise from '../components/CExercise.js'

import Divider from '@material-ui/core/Divider';

export default () => (
  <Layout>
      <RubyExercise />
      
      {/* <Divider/> */}

      <JavaExercise />

      {/* <Divider/> */}

      <CExercise />
  </Layout>
)