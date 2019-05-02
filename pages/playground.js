import Layout from '../components/MyLayout.js'
import RubyExercise from '../components/Editors/RubyExercise.js'
import JavaExercise from '../components/Editors/JavaExercise.js'
import CExercise from '../components/Editors/CExercise.js'

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